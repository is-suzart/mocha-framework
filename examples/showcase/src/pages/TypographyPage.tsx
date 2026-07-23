import { useState } from "react";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  return (
    <section className="playground-section">
      <h2 className="section-title">
        <span>🔤</span> Typography & Text Helpers
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card card--filled card--rounded card--padding-md">
          <div className="card__header">
            <h3 className="card__title">Scale & Hierarchy</h3>
            <p className="card__subtitle">Default font sizes and heading modifiers using BEM</p>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1rem' }}>
              <h1 className="title title--h1">Heading 1 (.title--h1)</h1>
              <h2 className="title title--h2">Heading 2 (.title--h2)</h2>
              <h3 className="title title--h3">Heading 3 (.title--h3)</h3>
              <h4 className="title title--h4">Heading 4 (.title--h4)</h4>
              <h5 className="title title--h5">Heading 5 (.title--h5)</h5>
              <h6 className="title title--h6">Heading 6 (.title--h6)</h6>
            </div>
            <div>
              <p className="text text--lead">Lead paragraph (.text--lead) - Perfect for introductory copy with a slightly larger size.</p>
              <p className="text text--body">Body text (.text--body / default) - Standard paragraph text with comfortable reading line-height of 1.6.</p>
              <p className="text text--sm">Small text (.text--sm) - Excellent for captions, secondary descriptions or card footers.</p>
              <p className="text text--xs">Extra small text (.text--xs) - Ideal for labels, badges metadata or tiny details.</p>
            </div>
          </div>
        </div>

        <div className="card card--filled card--rounded card--padding-md">
          <div className="card__header">
            <h3 className="card__title">Font Weights</h3>
            <p className="card__subtitle">Cozy weight variants matching Outfit design token scales</p>
          </div>
          <div className="card__body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {['light', 'regular', 'medium', 'semibold', 'bold'].map((w) => (
              <div key={w}>
                <p className={`text text--${w}`} style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{w.charAt(0).toUpperCase() + w.slice(1)} {w === 'light' ? '300' : w === 'regular' ? '400' : w === 'medium' ? '500' : w === 'semibold' ? '600' : '700'}</p>
                <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--{w}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="card card--filled card--rounded card--padding-md">
          <div className="card__header">
            <h3 className="card__title">Solid Text Colors</h3>
            <p className="card__subtitle">Catppuccin colors mapped directly to typography modifiers</p>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender', 'text', 'subtext1', 'subtext0', 'overlay2'].map((c) => (
                <div key={c} style={{ display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: 'var(--ctp-mantle)', borderRadius: '6px', border: '1px solid var(--ctp-surface0)' }}>
                  <span className={`text text--bold text--${c}`} style={{ marginBottom: '4px', textTransform: 'capitalize' }}>{c}</span>
                  <code style={{ fontSize: '0.7rem', color: 'var(--ctp-overlay1)', overflow: 'hidden', textOverflow: 'ellipsis' }}>.text--{c}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card card--filled card--rounded card--padding-md">
          <div className="card__header">
            <h3 className="card__title">Gradient Title Gallery</h3>
            <p className="card__subtitle">Premium text gradients combining Catppuccin color pairings</p>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'Mauve & Blue', gradient: 'mauve-blue', colors: 'Mauve to Blue' },
                { name: 'Peach & Red', gradient: 'peach-red', colors: 'Peach to Red' },
                { name: 'Green & Teal', gradient: 'green-teal', colors: 'Green to Teal' },
                { name: 'Lavender & Pink', gradient: 'lavender-pink', colors: 'Lavender to Pink' },
                { name: 'Yellow & Peach', gradient: 'yellow-peach', colors: 'Yellow to Peach' },
                { name: 'Rosewater & Flamingo', gradient: 'rosewater-flamingo', colors: 'Rosewater to Flamingo' },
                { name: 'Sky & Blue', gradient: 'sky-blue', colors: 'Sky to Blue' }
              ].map((g) => (
                <div key={g.gradient} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px', border: '1px solid var(--ctp-surface1)', position: 'relative' }}>
                  <h2 className="title title--h2" data-gradient={g.gradient} style={{ marginBottom: '8px', fontSize: '1.8rem' }}>Catppuccin</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ctp-text)', fontWeight: 600 }}>{g.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)', marginBottom: '1rem' }}>{g.colors}</span>
                  <button className="btn btn--sm btn--outline btn--rounded" onClick={() => copyToClipboard(`class="title title--h1" data-gradient="${g.gradient}"`)} style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 10px' }}>Copy attribute code</button>
                </div>
              ))}
            </div>
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
          <button className="code-copy-btn" onClick={() => { copyToClipboard('<h1 className="title title--h1" data-gradient="mauve-blue">Catppuccin Gradient</h1>'); }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)', cursor: 'pointer' }}>Copy Code</button>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
            <code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? '<span class="hl-tag">&lt;h1</span> <span class="hl-attr">className</span>=<span class="hl-str">"title title--h1"</span> <span class="hl-attr">data-gradient</span>=<span class="hl-str">"mauve-blue"</span><span class="hl-tag">&gt;</span>Catppuccin Gradient<span class="hl-tag">&lt;/h1&gt;</span>' : '<span class="hl-tag">&lt;h1</span> <span class="hl-attr">class</span>=<span class="hl-str">"title title--h1"</span> <span class="hl-attr">data-gradient</span>=<span class="hl-str">"mauve-blue"</span><span class="hl-tag">&gt;</span>Catppuccin Gradient<span class="hl-tag">&lt;/h1&gt;</span>' }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
