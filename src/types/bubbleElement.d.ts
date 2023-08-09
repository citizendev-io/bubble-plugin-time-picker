export namespace Element {
  export type Context = {
    currentUser: Bubble.Type.UserObject;
    jQuery: JQuery;
    /**
     *
     * @param fileName
     * @param contents
     * @param callback
     * @param attachTo: optional parameter to attach the file to. It has to be a thing in Bubble
     */
    uploadContent: (
      fileName: string,
      contents: String,
      callback: (err, url: string) => void,
      [attachTo],
    ) => void;
    keys: {};
    onCookieOptIn: (callback: () => void) => void;
    reportDebugger: (message: string) => void;
  };
  export type Instance<StateMap, EventType extends string> = {
    canvas: JQuery;
    publishState: (
      name: keyof StateMap,
      value: StateMap[typeof name] | null | undefined,
    ) => void;
    triggerEvent: (name: EventType, callback?: (err) => void) => void;
    data: {};
  };
  export type Properties<FieldMap> = Partial<FieldMap> & {
    bubble: BubbleProperties;
  };

  export type ElementProps<FieldMap, StateMap, EventType extends string> = {
    properties?: Bubble.Element.Properties<FieldMap>;
    context?: Bubble.Element.Context;
    instance?: Bubble.Element.Instance<StateMap, EventType>;
  };
}
interface BubbleProperties {
  width: () => number;
  height: () => number;
  min_width_css: () => string;
  max_width_css: () => string;
  fit_width: () => boolean;
  min_height_css: () => string;
  max_height_css: () => string;
  fit_height: () => boolean;
  margin_top: () => number;
  margin_bottom: () => number;
  margin_left: () => number;
  margin_right: () => number;
  collapse_when_hidden: () => boolean;
  background_style: () => string;
  bgcolor: () => string;
  background_gradient_style: () => string;
  background_gradient_direction: () => string;
  background_gradient_custom_angle: () => number;
  background_radial_gradient_shape: () => string;
  background_radial_gradient_size: () => string;
  background_radial_gradient_xpos: () => number;
  background_radial_gradient_ypos: () => number;
  background_gradient_from: () => string;
  background_gradient_to: () => string;
  background_gradient_mid: () => string;
  background_image: () => string;
  center_background: () => boolean;
  background_size_cover: () => boolean;
  crop_responsive: () => boolean;
  repeat_background_vertical: () => boolean;
  repeat_background_horizontal: () => boolean;
  background_color_if_empty_image: () => string;
  four_border_style: () => boolean;
  border_style: () => string;
  border_roundness: () => number;
  border_width: () => number;
  border_color: () => string;
  border_style_top: () => string;
  border_roundness_top: () => number;
  border_width_top: () => number;
  border_color_top: () => string;
  border_style_right: () => string;
  border_roundness_right: () => number;
  border_width_right: () => number;
  border_color_right: () => string;
  border_style_bottom: () => string;
  border_roundness_bottom: () => number;
  border_width_bottom: () => number;
  border_color_bottom: () => string;
  border_style_left: () => string;
  border_roundness_left: () => number;
  border_width_left: () => number;
  border_color_left: () => string;
  padding_vertical: () => number;
  padding_horizontal: () => number;
  boxshadow_style: () => string;
  boxshadow_horizontal: () => number;
  boxshadow_vertical: () => number;
  boxshadow_blur: () => number;
  boxshadow_spread: () => number;
  boxshadow_color: () => string;
  font_size: () => number;
  font_alignment: () => string;
  bold: () => boolean;
  italic: () => boolean;
  underline: () => boolean;
  font_color: () => string;
  font_face: () => string;
  is_visible: () => boolean;
}
