import { useState } from "react";
import { TextEditor } from '@mocha-ds/react';
import type { TextEditorColor, TextEditorSize } from '@mocha-ds/react';

export default function TextEditorPage() {
  const [editorColor, setEditorColor] = useState<TextEditorColor>('mauve');
  const [editorSize, setEditorSize] = useState<TextEditorSize>('md');
  const [editorMaxLength, setEditorMaxLength] = useState(0);
  const [editorReadOnly, setEditorReadOnly] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  return (
    <section className="showcase-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">✍️ Text Editor</h2>
          <p className="section-description">Editor de texto rico baseado em <strong>Tiptap</strong> + ProseMirror. Suporta importação e exportação nativa de <code>Markdown</code>.</p>
        </div>
      </div>
      <div className="playground-card">
        <div className="playground-controls">
          <div className="control-group">
            <label className="control-label">Cor de Destaque</label>
            <div className="control-row" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'] as TextEditorColor[]).map(c => (
                <button key={c} type="button" onClick={() => setEditorColor(c)} title={c} style={{ width: 22, height: 22, borderRadius: '50%', border: editorColor === c ? '2.5px solid var(--ctp-text)' : '2px solid transparent', background: `var(--ctp-${c})`, cursor: 'pointer', padding: 0, outline: 'none', boxShadow: editorColor === c ? '0 0 0 2px var(--ctp-base)' : 'none', transition: 'all 0.15s' }} />
              ))}
            </div>
          </div>
          <div className="control-group">
            <label className="control-label">Tamanho</label>
            <div className="control-row">
              {(['sm', 'md', 'lg'] as TextEditorSize[]).map(s => (
                <button key={s} type="button" className={`prop-btn ${editorSize === s ? 'active' : ''}`} onClick={() => setEditorSize(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <label className="control-label">Limite de Caracteres</label>
            <div className="control-row">
              {([0, 200, 500, 1000]).map(n => (
                <button key={n} type="button" className={`prop-btn ${editorMaxLength === n ? 'active' : ''}`} onClick={() => setEditorMaxLength(n)}>{n === 0 ? 'Ilimitado' : n}</button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <label className="control-label">Modo</label>
            <div className="control-row">
              <button type="button" className={`prop-btn ${!editorReadOnly ? 'active' : ''}`} onClick={() => setEditorReadOnly(false)}>Editável</button>
              <button type="button" className={`prop-btn ${editorReadOnly ? 'active' : ''}`} onClick={() => setEditorReadOnly(true)}>Read-only</button>
            </div>
          </div>
        </div>
        <div className="playground-preview" style={{ padding: '24px' }}>
          <TextEditor color={editorColor} size={editorSize} maxLength={editorMaxLength} readOnly={editorReadOnly} allowFullscreen={true} placeholder="Comece a escrever… (suporta **Markdown**)." defaultValue={`# Bem-vindo ao Catppuccin Text Editor\n\nEste é um editor **rico** baseado em [Tiptap](https://tiptap.dev).`} onChange={(md) => setEditorContent(md)} />
        </div>
      </div>
      {editorContent && (
        <div style={{ marginTop: 24, borderRadius: 12, border: '1.5px solid var(--ctp-surface1)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--ctp-mantle)', borderBottom: '1px solid var(--ctp-surface0)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)', display: 'flex', alignItems: 'center', gap: 8 }}><span>📄</span> Saída Markdown (onChange)</div>
          <pre style={{ margin: 0, padding: '16px 20px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--ctp-text)', background: 'var(--ctp-base)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{editorContent}</pre>
        </div>
      )}
      <div className="code-section" style={{ marginTop: 32 }}>
        <h3 className="code-section-title">Como usar</h3>
        <pre className="code-block" style={{ padding: '1rem', overflowX: 'auto' }}>
          <code dangerouslySetInnerHTML={{ __html: `<span class="hl-comment">// React</span>\n<span class="hl-tag">&lt;TextEditor</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${editorColor}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${editorSize}"</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{(markdown) =&gt; console.log(markdown)}</span>\n<span class="hl-tag">/&gt;</span>` }} />
        </pre>
      </div>
    </section>
  );
}
