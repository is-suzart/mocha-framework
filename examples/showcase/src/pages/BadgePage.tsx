import { useState } from "react";
import { Badge, SparklesIcon } from '@mocha-ds/react';
import type { BadgeVariant, BadgeSize, BadgeShape, BadgeColor } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function BadgePage() {
  const [badgeText, setBadgeText] = useState<string>('New Feature');
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>('filled');
  const [badgeSize, setBadgeSize] = useState<BadgeSize>('md');
  const [badgeShape, setBadgeShape] = useState<BadgeShape>('pill');
  const [badgeColor, setBadgeColor] = useState<BadgeColor>('mauve');
  const [badgeHasIcon, setBadgeHasIcon] = useState<boolean>(true);
  const [badgeDismissible, setBadgeDismissible] = useState<boolean>(false);
  const [demoTags, setDemoTags] = useState<string[]>(['TypeScript', 'React', 'Vue', 'Angular', 'CSS', 'Svelte']);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const removeTag = (tag: string) => setDemoTags(demoTags.filter(t => t !== tag));

  const getReactBadgeCode = () => `<span class="hl-tag">&lt;Badge</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>\n  ${badgeHasIcon ? '<span class="hl-attr">icon</span>=<span class="hl-str">{&lt;SparklesIcon /&gt;}</span>' : ''}\n  ${badgeDismissible ? '<span class="hl-attr">isDismissible</span>=<span class="hl-str">{true}</span>\n  <span class="hl-attr">onDismiss</span>=<span class="hl-str">{handleDismiss}</span>' : ''}\n<span class="hl-tag">&gt;</span>\n  <span class="hl-text">${badgeText}</span>\n<span class="hl-tag">&lt;/Badge&gt;</span>`;

  const getVueBadgeCode = () => `<span class="hl-tag">&lt;CtpBadge</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>\n${badgeDismissible ? '  <span class="hl-attr">:isDismissible</span>=<span class="hl-str">"true"</span>\n  <span class="hl-attr">@dismiss</span>=<span class="hl-str">"handleDismiss"</span>' : ''}\n<span class="hl-tag">&gt;</span>\n  ${badgeHasIcon ? '<span class="hl-tag">&lt;template</span> <span class="hl-attr">#icon</span><span class="hl-tag">&gt;</span>\u2728<span class="hl-tag">&lt;/template&gt;</span>\n  ' : ''}<span class="hl-text">${badgeText}</span>\n<span class="hl-tag">&lt;/CtpBadge&gt;</span>`;

  const getAngularBadgeCode = () => `<span class="hl-tag">&lt;badge</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>\n<span class="hl-tag">&gt;</span>\n  ${badgeHasIcon ? '<span class="hl-tag">&lt;span</span> <span class="hl-attr">icon</span><span class="hl-tag">&gt;</span>\u2728<span class="hl-tag">&lt;/span&gt;</span>\n  ' : ''}<span class="hl-text">${badgeText}</span>\n<span class="hl-tag">&lt;/badge&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>📇</span> Badges & Tags Components</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Badge Builder & Configurator</h3>
          <div className="control-grid">
            <div className="control-group"><label htmlFor="badge-text-input">Badge Text</label><input id="badge-text-input" type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} /></div>
            <div className="control-group">
              <label htmlFor="badge-variant-select">Variant</label>
              <select id="badge-variant-select" value={badgeVariant} onChange={(e) => setBadgeVariant(e.target.value as BadgeVariant)}>
                <option value="filled">Filled</option><option value="tonal">Tonal</option><option value="outline">Outline</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="badge-color-select">Color</label>
              <select id="badge-color-select" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value as BadgeColor)}>
                {['mauve', 'blue', 'green', 'red', 'peach', 'yellow', 'pink', 'teal', 'lavender', 'rosewater', 'maroon', 'sky', 'sapphire'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="badge-size-select">Size</label>
              <select id="badge-size-select" value={badgeSize} onChange={(e) => setBadgeSize(e.target.value as BadgeSize)}>
                <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="badge-shape-select">Shape</label>
              <select id="badge-shape-select" value={badgeShape} onChange={(e) => setBadgeShape(e.target.value as BadgeShape)}>
                <option value="square">Square</option><option value="rounded">Rounded</option><option value="pill">Pill</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <label className="checkbox-label"><input type="checkbox" checked={badgeHasIcon} onChange={(e) => setBadgeHasIcon(e.target.checked)} />Show Icon</label>
            <label className="checkbox-label"><input type="checkbox" checked={badgeDismissible} onChange={(e) => setBadgeDismissible(e.target.checked)} />Dismissible</label>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Live Preview</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '160px', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant={badgeVariant} size={badgeSize} shape={badgeShape} color={badgeColor} icon={badgeHasIcon ? <SparklesIcon size={14} /> : undefined} isDismissible={badgeDismissible} onDismiss={badgeDismissible ? () => {} : undefined}>{badgeText}</Badge>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {demoTags.map(tag => (
                <Badge key={tag} variant="tonal" color="mauve" size="sm" isDismissible onDismiss={() => removeTag(tag)}>{tag}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>)}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactBadgeCode() : activeTab === 'vue' ? getVueBadgeCode() : getAngularBadgeCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactBadgeCode() : activeTab === 'vue' ? getVueBadgeCode() : getAngularBadgeCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
