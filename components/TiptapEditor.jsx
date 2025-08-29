"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Minus,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code,
  Type,
} from "lucide-react";

export default function TiptapEditor({
  content = "",
  onChange = () => {},
  placeholder = "Write something amazing...",
  className = "",
  uploadImage,
}) {
  const fileInput = useRef(null);

  const handleUpload =
    uploadImage ||
    (async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit.configure({ heading: { levels: [2] } }),
  //     Placeholder.configure({ placeholder }),
  //     Image.configure({ inline: true, allowBase64: true }),
  //     Link.configure({ openOnClick: false }),
  //   ],
  //   content,
  //   onUpdate: ({ editor }) => onChange(editor.getHTML()),
  //   immediatelyRender: false,
  // });

  // useEffect(() => {
  //   if (editor && content !== undefined && content !== editor.getHTML()) {
  //     editor.commands.setContent(content);
  //   }
  // }, [editor, content]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML();
      if (content !== newHtml) {
        onChange(newHtml);
      }
    },
    immediatelyRender: false, // Add this line
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHtml = editor.getHTML();
      if (content !== currentHtml) {
        // Critical fix: prevents update loops
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  const addImageByURL = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addImageFile = useCallback(
    async (file) => {
      if (!editor) return;
      try {
        const url = await handleUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e) {
        console.error("Image upload failed", e);
      }
    },
    [editor, handleUpload]
  );

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) addImageFile(file);
    e.target.value = "";
  };

  const handleDropPaste = useCallback(
    (e) => {
      const files =
        "dataTransfer" in e ? e.dataTransfer?.files : e.clipboardData?.files;
      if (!files || !editor) return;
      [...files].forEach((file) => {
        if (file.type.startsWith("image/")) {
          e.preventDefault();
          addImageFile(file);
        }
      });
    },
    [addImageFile, editor]
  );

  useEffect(() => {
    document.addEventListener("drop", handleDropPaste);
    document.addEventListener("paste", handleDropPaste);
    return () => {
      document.removeEventListener("drop", handleDropPaste);
      document.removeEventListener("paste", handleDropPaste);
    };
  }, [handleDropPaste]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl border border-white/20 w-full h-full flex flex-col">
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-white/50 backdrop-blur-sm border-b border-white/20 rounded-t-2xl flex-shrink-0">
        <ToolbarButton
          editor={editor}
          action="bold"
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          editor={editor}
          action="italic"
          icon={<Italic className="h-4 w-4" />}
        />
        <ToolbarButton
          editor={editor}
          action="underline"
          icon={<Underline className="h-4 w-4" />}
        />
        <Divider />
        <ToolbarButton
          editor={editor}
          action="heading"
          icon={<Heading2 className="h-4 w-4" />}
          options={{ level: 2 }}
        />
        <ToolbarButton
          editor={editor}
          action="bulletList"
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          editor={editor}
          action="orderedList"
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <Divider />
        <ToolbarButton
          editor={editor}
          action="blockquote"
          icon={<Quote className="h-4 w-4" />}
        />
        <ToolbarButton
          editor={editor}
          action="codeBlock"
          icon={<Code className="h-4 w-4" />}
        />
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100/50 transition-colors"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </button>
        <Divider />
        <button
          onClick={setLink}
          className={`p-2 rounded-lg ${
            editor.isActive("link")
              ? "bg-blue-100/50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100/50"
          } transition-colors`}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            const choice = window.prompt(
              "Enter image URL or leave empty to upload from computer:"
            );
            if (choice === null) return;
            if (choice.trim()) {
              editor.chain().focus().setImage({ src: choice }).run();
            } else {
              fileInput.current?.click();
            }
          }}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100/50 transition-colors"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <Divider />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-100/50 transition-colors ${
            !editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-100/50 transition-colors ${
            !editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex-1">
        <EditorContent
          editor={editor}
          className={`w-full h-full ${className}`}
        />

        <style jsx global>{`
          .ProseMirror {
            width: 100% !important;
            height: 100% !important;
            min-height: 400px !important;
            padding: 1.5rem !important;
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
            background-color: transparent;
            max-width: 100%;
          }

          .ProseMirror:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }

          .ProseMirror p.is-editor-empty:first-child::before {
            color: #9ca3af;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }

          .ProseMirror h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #111827;
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5rem;
            margin: 0.75rem 0;
          }

          .ProseMirror blockquote {
            border-left: 3px solid #3b82f6;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #111827;
            background-color: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
          }

          .ProseMirror pre {
            background-color: #f1f5f9;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
            font-family: monospace;
          }

          .ProseMirror code {
            background-color: #e2e8f0;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-family: monospace;
          }

          .ProseMirror a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
          }

          .ProseMirror a:hover {
            color: #2563eb;
            text-decoration: underline;
          }

          .ProseMirror hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 1.5rem 0;
          }

          .ProseMirror img {
            display: block;
            margin: 1.5rem auto;
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .ProseMirror ul li {
            position: relative;
            padding-left: 1.5rem;
          }

          .ProseMirror ul li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0.75em;
            width: 0.5em;
            height: 0.5em;
            border-radius: 50%;
            background-color: #3b82f6;
          }

          .ProseMirror ol {
            counter-reset: item;
          }

          .ProseMirror ol li {
            position: relative;
            padding-left: 1.5rem;
          }

          .ProseMirror ol li::before {
            content: counter(item) ".";
            counter-increment: item;
            position: absolute;
            left: 0;
            color: #3b82f6;
            font-weight: 500;
          }
        `}</style>
      </div>
    </div>
  );
}

function ToolbarButton({ editor, action, icon, options = {} }) {
  const isActive = editor.isActive(action, options);
  return (
    <button
      onClick={() =>
        editor.chain().focus()[`toggle${capitalize(action)}`](options).run()
      }
      className={`p-2 rounded-lg ${
        isActive
          ? "bg-blue-100/50 text-blue-600"
          : "text-gray-600 hover:bg-gray-100/50"
      } transition-colors`}
      title={capitalize(action)}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-gray-200 mx-1" />;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
