// import { useEditor, EditorContent } from '@tiptap/react';
// import Bold from '@tiptap/extension-bold'
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'
// import Image from '@tiptap/extension-image'
// import Table from '@tiptap/extension-table'


// const TiptapEditor = () => {
//   const editor = useEditor({
//     extensions: [
//       Document,Paragraph, Text, Bold,Image,Table
//     ],
//     content: '<p>Hello World! 🌍</p>', // Initial content
//     shouldRerenderOnTransaction: true,
//     immediatelyRender: true,
//   });

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div>
//      <div className="control-group">
//         <div className="button-group">
//           <button
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={editor.isActive('bold') ? 'is-active' : ''}
//           >
//             Toggle bold
//           </button>
//           <button onClick={() => editor.chain().focus().setBold().run()} disabled={editor.isActive('bold')}>
//             Set bold
//           </button>
//           <button onClick={() => editor.chain().focus().unsetBold().run()} disabled={!editor.isActive('bold')}>
//             Unset bold
//           </button>
//         </div>
//       </div>
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// export default TiptapEditor;
import  { useMemo, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";


import { Extension } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";

import Emoji, { emojis } from "@tiptap/extension-emoji";
import FileHandler from "@tiptap/extension-file-handler";

import {Table }from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";


import TableOfContents, {
  getHierarchicalIndexes,
} from "@tiptap/extension-table-of-contents";

import UniqueID from "@tiptap/extension-unique-id";

// NOTE: you must install this for images:
// npm i @tiptap/extension-image
import ImageWithsize from "./Imagewithsize";
import Suggestion from "@tiptap/suggestion";


/**
 * Minimal custom “text color” extension using TextStyle.
 * No extra packages required.
 */
const TextColor = Extension.create({
  name: "textColor",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => element.style?.color?.replace(/['"]/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.color) return {};
              return { style: `color: ${attributes.color}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { color }).run();
        },
      unsetColor:
        () =>
        ({ chain }) => {
          // remove just the color attribute, keep other textStyle attrs if you add them later
          return chain().setMark("textStyle", { color: null }).removeEmptyTextStyle?.().run();
        },
    };
  },
});

function safeUUID() {
  // crypto.randomUUID is available in modern browsers
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

const DEFAULT_EMOJI_PICK = ["😀", "😂", "😍", "🤝", "🔥", "✅", "✨", "🚀", "💡", "📌"];

function TiptapEditor({
  initialContent = `<p></p>`,
  onChange,
}) {
  const [tocAnchors, setTocAnchors] = useState([]);
  const [htmlPreview, setHtmlPreview] = useState("");
  const [jsonPreview, setJsonPreview] = useState(null);
  const [imgWidth, setImgWidth] = useState("");
const [imgHeight, setImgHeight] = useState("");


  const extensions = useMemo(
    () => [
      // StarterKit includes many basics, but we disable the marks we provide custom controls for.
      StarterKit.configure({
        bold: false,
        italic: false,
      }),

      // Marks / formatting
      Bold,
      Italic,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      TextColor,

      Subscript,
      Superscript,

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        linkOnPaste: true,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),

      // Tables
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      // Images
    ImageWithsize.configure({
  inline: false,
  allowBase64: true,
}),

      // Emoji
      Emoji.configure({
        emojis, // built-in list
      }),

      // File drop/paste handler (use it to insert images on drop/paste)
      FileHandler.configure({
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        onPaste: (editor, files /*, htmlContent */) => {
          files.forEach((file) => {
            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();
            reader.onload = () => {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "image",
                  attrs: { src: reader.result, alt: file.name },
                })
                .run();
            };
            reader.readAsDataURL(file);
          });
        },
        onDrop: (editor, files, pos) => {
          files.forEach((file) => {
            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();
            reader.onload = () => {
              editor
                .chain()
                .focus()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: { src: reader.result, alt: file.name },
                })
                .run();
            };
            reader.readAsDataURL(file);
          });
        },
      }),

      // Unique IDs (useful for tracking blocks; can help with TOC anchors too)
      UniqueID.configure({
        types: ["heading", "paragraph", "image"],
        generateID: ({ node }) => `${node.type.name}-${safeUUID()}`,
      }),

      // Table of Contents (side panel)
      TableOfContents.configure({
        anchorTypes: ["heading"],
        getIndex: getHierarchicalIndexes,
        onUpdate: (anchors) => {
          setTocAnchors(anchors);
        },
      }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class: "blog-editor__prosemirror",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      setHtmlPreview(html);
      setJsonPreview(json);
      onChange?.({ html, json });
    },
    immediatelyRender: true,
  });

  useEffect(() => {
    if (!editor) return;
    if (typeof initialContent === "string" && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  // ---------- Toolbar actions ----------
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return; // cancelled

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImageByUrl = () => {
    const url = window.prompt("Image URL", "");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setHeading = (level) => {
    if (level === 0) editor.chain().focus().setParagraph().run();
    else editor.chain().focus().toggleHeading({ level }).run();
  };

  const scrollToAnchor = (anchor) => {
    // anchor.pos is in the ToC anchor object structure from the docs
    editor.chain().focus().setTextSelection(anchor.pos).scrollIntoView().run();
  };

  const applyAlignment = (alignValue) => {
    const chain = editor.chain().focus();
    if (editor.isActive("image")) {
      chain.updateAttributes("image", { textAlign: alignValue }).run();
      return;
    }
    chain.setTextAlign(alignValue).run();
  };
  

  // Small helper
  const btnClass = (active, disabled = false) =>
    [
      "blog-editor__btn",
      active ? "is-active" : "",
      disabled ? "is-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

  const canUndo = editor.can().chain().focus().undo().run();
  const canRedo = editor.can().chain().focus().redo().run();

  return (
    <div className="blog-editor">
      <div className="blog-editor__layout">
        {/* TOC Sidebar */}
        <aside className="blog-editor__toc">
          <div className="blog-editor__toc-title">Table of Contents</div>

          {tocAnchors?.length ? (
            <ul className="blog-editor__toc-list">
              {tocAnchors.map((a) => (
                <li
                  key={a.id}
                  className={[
                    "blog-editor__toc-item",
                    a.isActive ? "is-active" : "",
                  ].join(" ")}
                  style={{ paddingLeft: `${(a.level - 1) * 12}px` }}
                >
                  <button
                    type="button"
                    className="blog-editor__toc-link"
                    onClick={() => scrollToAnchor(a)}
                    title={a.textContent}
                  >
                    {a.itemIndex ? `${a.itemIndex}. ` : ""}
                    {a.textContent || "Untitled"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="blog-editor__toc-empty">
              Add headings (H1/H2/H3) to generate a TOC.
            </div>
          )}
        </aside>

        {/* Editor Area */}
        <main className="blog-editor__main">
          {/* Top toolbar */}
          <div className="blog-editor__toolbar">
            <div className="blog-editor__toolbar-group">
              <select
                className="blog-editor__select"
                value={
                  editor.isActive("heading", { level: 1 })
                    ? "h1"
                    : editor.isActive("heading", { level: 2 })
                    ? "h2"
                    : editor.isActive("heading", { level: 3 })
                    ? "h3"
                    : "p"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "p") setHeading(0);
                  if (v === "h1") setHeading(1);
                  if (v === "h2") setHeading(2);
                  if (v === "h3") setHeading(3);
                }}
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(editor.isActive("bold"))}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                Bold
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("italic"))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                Italic
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("underline"))}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                Underline
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("highlight"))}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
              >
                Highlight
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(editor.isActive("subscript"))}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
              >
                Sub
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("superscript"))}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
              >
                Super
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(editor.isActive("link"))}
                onClick={setLink}
              >
                Link
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("link"))}
                disabled={!editor.isActive("link")}
                onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
              >
                Unlink
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(editor.isActive({ textAlign: "left" }))}
                onClick={() => applyAlignment("left")}
              >
                Left
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive({ textAlign: "center" }))}
                onClick={() => applyAlignment("center")}
              >
                Center
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive({ textAlign: "right" }))}
                onClick={() => applyAlignment("right")}
              >
                Right
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive({ textAlign: "justify" }))}
                onClick={() => applyAlignment("justify")}
              >
                Justify
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(editor.isActive("bulletList"))}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                • List
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("orderedList"))}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                1. List
              </button>
              <button
                type="button"
                className={btnClass(editor.isActive("blockquote"))}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                Quote
              </button>
              <button
                type="button"
                className={btnClass(false)}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                HR
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <label className="blog-editor__color">
                <span>Color</span>
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  title="Text color"
                />
              </label>
              <button
                type="button"
                className={btnClass(false)}
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Reset
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button type="button" className={btnClass(false)} onClick={addImageByUrl}>
                Image URL
              </button>

              {editor.isActive("image") && (
  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
    <input
      value={imgWidth}
      onChange={(e) => setImgWidth(e.target.value)}
      placeholder="Width (e.g. 600 or 60%)"
      style={{ padding: 6 }}
    />
    <input
      value={imgHeight}
      onChange={(e) => setImgHeight(e.target.value)}
      placeholder="Height (e.g. 400)"
      style={{ padding: 6 }}
    />
    <button
      onClick={() =>
        editor.chain().focus().setImageSize({ width: imgWidth, height: imgHeight }).run()
      }
    >
      Apply
    </button>
    <button onClick={() => editor.chain().focus().clearImageSize().run()}>
      Reset
    </button>
  </div>
)}


              <div className="blog-editor__emoji">
                <span className="blog-editor__emoji-label">Emoji</span>
                <div className="blog-editor__emoji-row">
                  {DEFAULT_EMOJI_PICK.map((em) => (
                    <button
                      key={em}
                      type="button"
                      className="blog-editor__emoji-btn"
                      onClick={() => editor.chain().focus().insertContent(em).run()}
                      title={`Insert ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(false, !canUndo)}
                disabled={!canUndo}
                onClick={() => editor.chain().focus().undo().run()}
              >
                Undo
              </button>
              <button
                type="button"
                className={btnClass(false, !canRedo)}
                disabled={!canRedo}
                onClick={() => editor.chain().focus().redo().run()}
              >
                Redo
              </button>
            </div>
          </div>

          {/* Table toolbar */}
          <div className="blog-editor__toolbar blog-editor__toolbar--secondary">
            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(false)}
                onClick={() =>
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                }
              >
                Insert Table
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete Table
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              >
                +Col Before
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                +Col After
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                -Col
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().addRowBefore().run()}
              >
                +Row Before
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                +Row After
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                -Row
              </button>
            </div>

            <div className="blog-editor__toolbar-group">
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Header Row
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().mergeCells().run()}
              >
                Merge
              </button>
              <button
                type="button"
                className={btnClass(false, !editor.isActive("table"))}
                disabled={!editor.isActive("table")}
                onClick={() => editor.chain().focus().splitCell().run()}
              >
                Split
              </button>
            </div>
          </div>

          {/* Bubble menu for quick inline formatting */}
          <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }} className="blog-editor__bubble">
            <button
              type="button"
              className={btnClass(editor.isActive("bold"))}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </button>
            <button
              type="button"
              className={btnClass(editor.isActive("italic"))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </button>
            <button
              type="button"
              className={btnClass(editor.isActive("underline"))}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              U
            </button>
            <button type="button" className={btnClass(editor.isActive("link"))} onClick={setLink}>
              🔗
            </button>
          </BubbleMenu>

          {/* Floating menu for block-level actions */}
          <FloatingMenu editor={editor} tippyOptions={{ duration: 150 }} className="blog-editor__floating">
            <button type="button" className={btnClass(false)} onClick={() => setHeading(2)}>
              H2
            </button>
            <button
              type="button"
              className={btnClass(false)}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </button>
            <button type="button" className={btnClass(false)} onClick={addImageByUrl}>
              Image
            </button>
          </FloatingMenu>

          {/* Actual editor */}
          <div className="blog-editor__paper">
            <div className="blog-editor__hint">
              Tip: paste or drag & drop images directly into the editor.
            </div>
            <EditorContent editor={editor} />
          </div>

          {/* Preview */}
          {/* <div className="blog-editor__preview">
            <div className="blog-editor__preview-col">
              <div className="blog-editor__preview-title">HTML</div>
              <pre className="blog-editor__pre">{htmlPreview}</pre>
            </div>
            <div className="blog-editor__preview-col">
              <div className="blog-editor__preview-title">JSON</div>
              <pre className="blog-editor__pre">
                {jsonPreview ? JSON.stringify(jsonPreview, null, 2) : ""}
              </pre>
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}


export default TiptapEditor;