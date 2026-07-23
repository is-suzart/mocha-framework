import { useState } from "react";
import { Accordion } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function AccordionPage() {
  const [accordionActiveValue, setAccordionActiveValue] = useState<string | string[]>('item-1');
  const [accordionVariant, setAccordionVariant] = useState<'default' | 'split'>('default');
  const [accordionColorMode, setAccordionColorMode] = useState<'none' | 'colored' | 'tonal'>('none');
  const [accordionAccent, setAccordionAccent] = useState<string>('mauve');
  const [accordionAllowMultiple, setAccordionAllowMultiple] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const handleAccordionMultipleChange = (multiple: boolean) => {
    setAccordionAllowMultiple(multiple);
    if (multiple) {
      setAccordionActiveValue(typeof accordionActiveValue === 'string' ? (accordionActiveValue ? [accordionActiveValue] : []) : (accordionActiveValue || []));
    } else {
      setAccordionActiveValue(Array.isArray(accordionActiveValue) ? (accordionActiveValue[0] || '') : (accordionActiveValue || ''));
    }
  };

  const getReactAccordionCode = () => `<span class="hl-tag">&lt;Accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>${accordionColorMode !== 'none' ? `\n  <span class="hl-attr">colorMode</span>=<span class="hl-str">"${accordionColorMode}"</span>` : ''}\n  <span class="hl-attr">accentColor</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">allowMultiple</span>=<span class="hl-str">{${accordionAllowMultiple}}</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">{activeItems}</span>\n  <span class="hl-attr">onValueChange</span>=<span class="hl-str">{setActiveItems}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Accordion.Item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Header&gt;</span>Primeiro Tópico<span class="hl-tag">&lt;/Accordion.Header&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Body&gt;</span>Conteúdo...<span class="hl-tag">&lt;/Accordion.Body&gt;</span>\n  <span class="hl-tag">&lt;/Accordion.Item&gt;</span>\n<span class="hl-tag">&lt;/Accordion&gt;</span>`;

  const getVueAccordionCode = () => `<span class="hl-tag">&lt;Accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>\n  <span class="hl-attr">accent-color</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">v-model</span>=<span class="hl-str">"activeItems"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;AccordionItem</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Primeiro Tópico"</span><span class="hl-tag">&gt;</span>Conteúdo...<span class="hl-tag">&lt;/AccordionItem&gt;</span>\n<span class="hl-tag">&lt;/Accordion&gt;</span>`;

  const getAngularAccordionCode = () => `<span class="hl-tag">&lt;accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>\n  <span class="hl-attr">accentColor</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">[(activeValues)]</span>=<span class="hl-str">"activeItems"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;accordion-item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Primeiro Tópico"</span><span class="hl-tag">&gt;</span>Conteúdo...<span class="hl-tag">&lt;/accordion-item&gt;</span>\n<span class="hl-tag">&lt;/accordion&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>🪗</span> Accordion & Collapse Component</h2>
      <div className="playground-section">
        <div className="demo-stage" style={{ width: '100%' }}>
          <h3 className="stage-title">Interactive Stage</h3>
          <div style={{ padding: '2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)' }}>
            <Accordion variant={accordionVariant} colorMode={accordionColorMode} accentColor={accordionAccent as any} allowMultiple={accordionAllowMultiple} value={accordionActiveValue} onValueChange={setAccordionActiveValue}>
              <Accordion.Item value="item-1">
                <Accordion.Header>✨ Introdução ao Catppuccin</Accordion.Header>
                <Accordion.Body>Catppuccin é um tema de cores comunitário super aconchegante e pastel que visa preencher a lacuna entre designs de alto contraste e designs opacos e monótonos.</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item value="item-2">
                <Accordion.Header>📦 Design System Multitecnologia</Accordion.Header>
                <Accordion.Body>Este design system foi construído em monorepo com pacotes especializados: CSS puro, React, Vue 3 e Angular.</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item value="item-3" disabled>
                <Accordion.Header>🔒 Funcionalidade Bloqueada (Desabilitado)</Accordion.Header>
                <Accordion.Body>Este painel está desabilitado e não pode ser aberto pelo usuário.</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item value="item-4">
                <Accordion.Header>🚀 Suporte a Animações Fluidas</Accordion.Header>
                <Accordion.Body>Usando CSS Grids de transição de linhas conseguimos animar o colapso e expansão a partir de altura 0 de forma nativa.</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">Accordion Customizer</h3>
          <div className="control-group">
            <label className="control-label">Layout Variant</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['default', 'split'] as const).map((v) => (
                <button key={v} onClick={() => setAccordionVariant(v)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: accordionVariant === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: accordionVariant === v ? 'var(--ctp-mauve)' : 'transparent', color: accordionVariant === v ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'capitalize' }}>{v}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Color Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['none', 'colored', 'tonal'] as const).map((m) => (
                <button key={m} onClick={() => setAccordionColorMode(m)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: accordionColorMode === m ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: accordionColorMode === m ? 'var(--ctp-mauve)' : 'transparent', color: accordionColorMode === m ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'capitalize' }}>{m}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Expansion Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleAccordionMultipleChange(false)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: !accordionAllowMultiple ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: !accordionAllowMultiple ? 'var(--ctp-mauve)' : 'transparent', color: !accordionAllowMultiple ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Single (Accordion)</button>
              <button onClick={() => handleAccordionMultipleChange(true)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: accordionAllowMultiple ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: accordionAllowMultiple ? 'var(--ctp-mauve)' : 'transparent', color: accordionAllowMultiple ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Multiple (Collapse)</button>
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Accent Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                <button key={c} onClick={() => setAccordionAccent(c)} title={c.charAt(0).toUpperCase() + c.slice(1)} style={{ height: '24px', borderRadius: '4px', border: accordionAccent === c ? '2px solid white' : '1px solid var(--ctp-surface1)', backgroundColor: `var(--ctp-${c})`, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '12px', border: '1px solid var(--ctp-surface1)', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', color: 'var(--ctp-subtext0)', fontSize: '0.8rem', lineHeight: '1.4' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--ctp-mauve)', marginBottom: '4px' }}>Active State:</div>
            <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto', color: 'var(--ctp-text)' }}>{JSON.stringify(accordionActiveValue)}</pre>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
          {['react', 'vue', 'angular'].map((tab) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as any)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)', borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab ? 'bold' : 'normal' }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>
        <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
          <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactAccordionCode() : activeTab === 'vue' ? getVueAccordionCode() : getAngularAccordionCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)', cursor: 'pointer' }}>Copy Code</button>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactAccordionCode() : activeTab === 'vue' ? getVueAccordionCode() : getAngularAccordionCode() }} /></pre>
        </div>
      </div>
    </section>
  );
}
