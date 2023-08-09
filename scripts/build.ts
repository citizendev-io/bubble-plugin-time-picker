import { preact as preactPreset } from "@preact/preset-vite";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import vite, { InlineConfig } from "vite";

const COMPONENTS = {
  "custom-time-picker": {
    path: "src/TimePicker/TimePicker.tsx",
    actions: ["setTime"],
  },
};

const config: InlineConfig = {
  plugins: [preactPreset()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [
        "preact",
        "preact-custom-element",
        "preact/compat",
        "preact/hooks",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          preact: "preact",
          "preact-custom-element": "preactCustomElement",
          "preact/compat": "preactCompat",
          "preact/hooks": "preactHooks",
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
    outDir: "tmp",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "src/index",
      name: "CZDateTimePicker",
      fileName: "index",
    },
  },
};

function readFileContent(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(file), (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.toString("utf-8"));
    });
  });
}

function deleteFolder(folder: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.rm(folder, { recursive: true, force: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function writeFileContent(
  folder: string,
  file: string,
  content: string,
): Promise<void> {
  const filePath = path.join(folder, file);
  return new Promise((resolve, reject) => {
    fs.mkdir(folder, { recursive: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

async function compileFileTemplate(file: string) {
  const templateStr = await readFileContent("templates/" + file);
  return Handlebars.compile(templateStr, { noEscape: true });
}

async function main() {
  const sharedHeaderTemplate = await compileFileTemplate(
    "shared_header.html.hbs",
  );
  const elementUpdateTemplate = await compileFileTemplate(
    "element_update.js.hbs",
  );
  const elementPreviewTemplate = await compileFileTemplate(
    "element_preview.js.hbs",
  );
  const elementActionTemplate = await compileFileTemplate(
    "element_action.js.hbs",
  );

  await vite.build(config);
  const jsString = await readFileContent("./tmp/index.umd.js");
  const cssString = await readFileContent("./tmp/style.css");
  // await deleteFolder("tmp");
  await deleteFolder("dist");

  const commonContext = {
    bundle: {
      js: jsString,
      css: cssString,
    },
  };

  const sharedHeader = sharedHeaderTemplate(commonContext);

  await Promise.all(
    Object.keys(COMPONENTS).map(async (element) => {
      const context = {
        ...commonContext,
        componentName: element,
      };
      const elementPreview = elementPreviewTemplate(context);
      const elementUpdate = elementUpdateTemplate(context);

      const elementFolder = path.join("dist", element);
      await writeFileContent(elementFolder, "preview.js", elementPreview);
      await writeFileContent(elementFolder, "update.js", elementUpdate);
      const actions = COMPONENTS[element].actions || [];
      await Promise.all(
        actions.map(async (actionName) => {
          const elementActionCode = elementActionTemplate({
            ...context,
            actionName,
          });
          await writeFileContent(
            elementFolder,
            actionName + ".js",
            elementActionCode,
          );
        }),
      );
    }),
  );

  await writeFileContent("dist", "shared_header.html", sharedHeader);
}

main();
