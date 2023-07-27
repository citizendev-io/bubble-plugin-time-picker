# Bubble.io plugin with Preact.js

## About:

This is a simple proof-of-concept to set up a viable development workflow to build a Bubble plugin element using Preact.js.
The aim is to allow plugin developers to break out of the limited Bubble plugin SDK.

Write up: 

## Steps to reproduce:

1.  Clone this repository, run `yarn` to install dependencies.
2.  Create a Bubble plugin. You can also fork [this plugin](https://bubble.io/plugin/preact-in-bubble-demo-1689333796103x787054972551823400) to skip the next Bubble plugin setup steps.

    1. Add this piece of code into the shared header of Bubble:

       ```
       <script>
       function loadJS(url, module = false) {
           let scriptEle = document.createElement("script");
           scriptEle.setAttribute("src", url);
           scriptEle.setAttribute("type", module ? "module" : "text/javascript" );
           document.head.appendChild(scriptEle);
       }

       function loadCSS(url) {
           let link = document.createElement("link");
           link.rel  = 'stylesheet';
           link.type = 'text/css';
           link.href = url;
           link.media = 'all';
           document.head.appendChild(link);
       }

       window.devServerURL = "_*_DEV_SERVER_URL_*_";
       if (!!window.devServerURL) {
           loadJS(window.devServerURL + "/index.umd.js");
           loadCSS(window.devServerURL + "/style.css");
       }
       </script>
       ```

    2. Add a new Bubble plugin element. Set the update function as below:
       ```
       function(instance, properties, context) {
           if (!instance.data.element) {
               instance.data.element = document.createElement("custom-counter");
               instance.canvas.append(instance.data.element);
           }
           instance.data.element.properties = properties;
       }
       ```

3. Add the plugin into a test app, and set the `DEV_SERVER_URL` plugin key to be `http://localhost:3000`.
4. Put the new Bubble element in your test app.
5.  Run `yarn dev` on your machine.
6.  Open test app.

## Caveats

- No hot reload right now. When you update the Preact code, you need to reload the browser tab again.
- Speed optimization is still in question.