import Image from "@tiptap/extension-image";

const ImageWithsize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      textAlign: {
        default: null,
        parseHTML: (element) => {
          const dataAlign = element.getAttribute("data-align");
          if (dataAlign) return dataAlign;

          const floatValue = element.style?.float;
          if (floatValue === "left" || floatValue === "right") return floatValue;

          const alignAttr = element.getAttribute("align");
          if (alignAttr) return alignAttr;

          const styleAlign = element.style?.textAlign;
          if (styleAlign) return styleAlign;

          return null;
        },
        renderHTML: (attrs) => {
          if (!attrs.textAlign) return {};
          return { "data-align": attrs.textAlign };
        },
      },

      width: {
        default: null,
        parseHTML: (element) => element.style.width || null,
        renderHTML: (attrs) => {
          if (!attrs.width) return {};
          const value = String(attrs.width);
          const width = /^\d+$/.test(value) ? `${value}px` : value;
          return { style: `width: ${width};` };
        },
      },

      height: {
        default: null,
        parseHTML: (element) => element.style.height || null,
        renderHTML: (attrs) => {
          if (!attrs.height) return {};
          const value = String(attrs.height);
          const height = /^\d+$/.test(value) ? `${value}px` : value;
          return { style: `height: ${height};` };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      setImageSize:
        ({ width = null, height = null } = {}) =>
        ({ commands }) => {
          return commands.updateAttributes("image", {
            width: width || null,
            height: height || null,
          });
        },

      clearImageSize:
        () =>
        ({ commands }) => {
          return commands.updateAttributes("image", { width: null, height: null });
        },
    };
  },
});

export default ImageWithsize;
