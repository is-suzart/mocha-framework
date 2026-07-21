import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

export type TextEditorColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';

export type TextEditorSize = 'sm' | 'md' | 'lg';

export interface TextEditorProps {
  /** Initial markdown content */
  defaultValue?: string;
  /** Controlled markdown value */
  value?: string;
  /** Called with the latest Markdown string whenever the content changes */
  onChange?: (markdown: string) => void;
  placeholder?: string;
  color?: TextEditorColor;
  size?: TextEditorSize;
  /** Max characters (0 = unlimited) */
  maxLength?: number;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Allow fullscreen toggle */
  allowFullscreen?: boolean;
  className?: string;
  id?: string;
}

/* -----------------------------------------------------------------------
   Tiny markdown ↔ HTML bridge (no external parser needed for basic usage)
   ----------------------------------------------------------------------- */
function markdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Bold + italic combinations
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
      return `<pre><code>${code}</code></pre>`;
    })
    // Blockquote
    .replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // Horizontal rule
    .replace(/^(---|\*\*\*|___)$/gm, '<hr>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2" />')
    // Unordered list (simple, non-nested)
    .replace(/^[-*+]\s+(.+)$/gm, '<li>$1</li>')
    // Ordered list
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap loose <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');

  return `<p>${html}</p>`;
}

function htmlToMarkdown(html: string): string {
  return html
    // Headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
    // Bold
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    // Italic
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    // Underline (no standard md, use html)
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '$1')
    // Strikethrough
    .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
    // Code
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    // Blockquote
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) =>
      content.replace(/<p[^>]*>(.*?)<\/p>/gi, '> $1\n').trim())
    // Link
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Image
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
    // Lists
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<\/?[uo]l[^>]*>/gi, '')
    // Horizontal rule
    .replace(/<hr[^>]*\/?>/gi, '\n---\n')
    // Paragraphs and breaks
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    .replace(/<br[^>]*\/?>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    // Normalise excess whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/* -----------------------------------------------------------------------
   SVG icon helpers
   ----------------------------------------------------------------------- */
const Icon = ({ d, viewBox = '0 0 24 24', strokeLinecap = 'round' as const, strokeLinejoin = 'round' as const }: {
  d: string | string[];
  viewBox?: string;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap={strokeLinecap}
    strokeLinejoin={strokeLinejoin}
  >
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} />)
      : <path d={d} />
    }
  </svg>
);

/* -----------------------------------------------------------------------
   Toolbar button
   ----------------------------------------------------------------------- */
interface ToolbarBtnProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarBtn: React.FC<ToolbarBtnProps> = ({ onClick, active, disabled, title, children }) => {
  const prefix = usePrefix();
  return (
    <button
      type="button"
      className={cnEl(prefix, 'editor', 'toolbar-btn')}
      data-state={active ? 'active' : undefined}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
};

/* -----------------------------------------------------------------------
   Main component
   ----------------------------------------------------------------------- */
export const TextEditor: React.FC<TextEditorProps> = ({
  defaultValue = '',
  value,
  onChange,
  placeholder = 'Start typing… (supports Markdown)',
  color = 'mauve',
  size = 'md',
  maxLength = 0,
  readOnly = false,
  allowFullscreen = true,
  className = '',
  id,
}) => {
  const prefix = usePrefix();
  const [viewMode, setViewMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [markdownText, setMarkdownText] = useState(defaultValue || value || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder }),
      ...(maxLength > 0
        ? [CharacterCount.configure({ limit: maxLength })]
        : [CharacterCount]),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Subscript,
      Superscript,
    ],
    content: markdownToHtml(defaultValue || value || ''),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const md = htmlToMarkdown(editor.getHTML());
      setMarkdownText(md);
      if (onChange) onChange(md);
    },
  });

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined && editor) {
      const currentMd = htmlToMarkdown(editor.getHTML());
      if (value !== currentMd) {
        editor.commands.setContent(markdownToHtml(value), false);
        setMarkdownText(value);
      }
    }
  }, [value, editor]);

  // Sync markdown textarea → editor when switching back to WYSIWYG
  const handleModeSwitch = (mode: 'wysiwyg' | 'markdown') => {
    if (mode === 'wysiwyg' && editor && viewMode === 'markdown') {
      editor.commands.setContent(markdownToHtml(markdownText), false);
    }
    if (mode === 'markdown' && editor && viewMode === 'wysiwyg') {
      setMarkdownText(htmlToMarkdown(editor.getHTML()));
    }
    setViewMode(mode);
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const md = e.target.value;
    setMarkdownText(md);
    if (onChange) onChange(md);
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const insertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const charCount = editor?.storage?.characterCount?.characters?.() ?? markdownText.length;
  const wordCount = editor?.storage?.characterCount?.words?.() ?? markdownText.split(/\s+/).filter(Boolean).length;

  const editorClass = cn(prefix, 'editor', [
    color,
    size,
    isFullscreen ? 'fullscreen' : undefined,
  ]) + (className ? ` ${className}` : '');

  if (!editor) return null;

  return (
    <div className={editorClass} id={id} role="region" aria-label="Rich text editor">
      {/* ---- Toolbar ---- */}
      {!readOnly && (
        <div className={cnEl(prefix, 'editor', 'toolbar')} role="toolbar" aria-label="Formatting toolbar">

          {/* Heading select */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <select
              className={cnEl(prefix, 'editor', 'toolbar-select')}
              value={
                editor.isActive('heading', { level: 1 }) ? 'h1' :
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                editor.isActive('heading', { level: 4 }) ? 'h4' : 'p'
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level: parseInt(val[1]) as 1|2|3|4 }).run();
              }}
              title="Text style"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Text formatting */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Icon d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Icon d="M19 4h-9M14 20H5M15 4 9 20" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <Icon d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Icon d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive('highlight')}
              title="Highlight"
            >
              <Icon d="m9 11-6 6v3h9l3-3M22 5.72l-4.57-4.56a1 1 0 0 0-1.41 0L7 10l7 7 7.58-7.56a1 1 0 0 0-.01-1.42z" />
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Text colour */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <input
              type="color"
              className={cnEl(prefix, 'editor', 'toolbar-color')}
              title="Text color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Sub / Superscript */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              active={editor.isActive('subscript')}
              title="Subscript"
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>A<sub>x</sub></span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              active={editor.isActive('superscript')}
              title="Superscript"
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>A<sup>x</sup></span>
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Alignment */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align left"
            >
              <Icon d="M3 6h18M3 12h12M3 18h15" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align center"
            >
              <Icon d="M3 6h18M6 12h12M4 18h16" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align right"
            >
              <Icon d="M3 6h18M9 12h12M6 18h15" />
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Lists */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet list"
            >
              <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Ordered list"
            >
              <Icon d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Block elements */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <Icon d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              title="Inline code"
            >
              <Icon d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              active={false}
              title="Horizontal rule"
            >
              <Icon d="M8 12h8M3 6h18M3 18h18" />
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Link */}
          <div className={cnEl(prefix, 'editor', 'toolbar-group')} style={{ position: 'relative' }}>
            <ToolbarBtn
              onClick={() => {
                const prev = editor.getAttributes('link').href || '';
                setLinkUrl(prev);
                setShowLinkInput((v) => !v);
              }}
              active={editor.isActive('link') || showLinkInput}
              title="Insert / Edit link"
            >
              <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </ToolbarBtn>
            {showLinkInput && (
              <div className={cnEl(prefix, 'editor', 'link-popup')}>
                <input
                  className={cnEl(prefix, 'editor', 'link-input')}
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
                  autoFocus
                />
                <button type="button" className={cnEl(prefix, 'editor', 'toolbar-btn')} data-state="active" onClick={setLink} title="Apply link">
                  <Icon d="M20 6 9 17l-5-5" />
                </button>
              </div>
            )}
          </div>

          {/* Table */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn onClick={insertTable} title="Insert table" active={editor.isActive('table')}>
              <Icon d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </ToolbarBtn>
          </div>

          <div className={cnEl(prefix, 'editor', 'toolbar-separator')} />

          {/* Undo / Redo */}
            <div className={cnEl(prefix, 'editor', 'toolbar-group')}>
            <ToolbarBtn
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Icon d="M3 7v6h6M3.13 13A9 9 0 1 0 5 5.68" />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Icon d="M21 7v6h-6M20.87 13A9 9 0 1 1 19 5.68" />
            </ToolbarBtn>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Fullscreen */}
          {allowFullscreen && (
            <ToolbarBtn
              onClick={() => setIsFullscreen((v) => !v)}
              active={isFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen
                ? <Icon d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                : <Icon d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              }
            </ToolbarBtn>
          )}
        </div>
      )}

      {/* ---- Content area ---- */}
      <div className={cnEl(prefix, 'editor', 'content')}>
        {viewMode === 'wysiwyg' ? (
          <>
            {/* Bubble menu (appears on text selection) */}
            <BubbleMenu editor={editor}>
              <div className={cnEl(prefix, 'editor', 'bubble-menu')}>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                  <Icon d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                  <Icon d="M19 4h-9M14 20H5M15 4 9 20" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                  <Icon d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
                  <Icon d="m9 11-6 6v3h9l3-3M22 5.72l-4.57-4.56a1 1 0 0 0-1.41 0L7 10l7 7 7.58-7.56a1 1 0 0 0-.01-1.42z" />
                </ToolbarBtn>
              </div>
            </BubbleMenu>

            <div className={cnEl(prefix, 'editor', 'prosemirror-wrapper')}>
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <textarea
            className={cnEl(prefix, 'editor', 'markdown')}
            value={markdownText}
            onChange={handleMarkdownChange}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label="Markdown source"
            spellCheck={false}
          />
        )}
      </div>

      {/* ---- Statusbar ---- */}
      <div className={cnEl(prefix, 'editor', 'statusbar')}>
        <div className={cnEl(prefix, 'editor', 'statusbar-left')}>
          <span className={cnEl(prefix, 'editor', 'statusbar-badge')}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {wordCount} words
          </span>
          <span>{charCount}{maxLength > 0 ? ` / ${maxLength}` : ''} chars</span>
        </div>
        <div className={cnEl(prefix, 'editor', 'statusbar-right')}>
          <button
            type="button"
            className={cnEl(prefix, 'editor', 'mode-btn')}
            data-state={viewMode === 'wysiwyg' ? 'active' : undefined}
            onClick={() => handleModeSwitch('wysiwyg')}
            title="Rich text mode"
          >
            Rich
          </button>
          <button
            type="button"
            className={cnEl(prefix, 'editor', 'mode-btn')}
            data-state={viewMode === 'markdown' ? 'active' : undefined}
            onClick={() => handleModeSwitch('markdown')}
            title="Markdown source mode"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8H3v8h3M18 8h3v8h-3M13 8l-3 8M10 8l3 8M7.5 12H10M13 12h2.5" />
            </svg>
            Markdown
          </button>
        </div>
      </div>
    </div>
  );
};

TextEditor.displayName = 'TextEditor';
