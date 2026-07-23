import { useState } from "react";
import { iconPaths } from '../data/icons';
import { iconList } from '../data/iconList';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function IconsPage() {
  const [iconSearch, setIconSearch] = useState('');
  const [iconSize, setIconSize] = useState(32);
  const [iconStroke, setIconStroke] = useState(1.5);
  const [iconColor, setIconColor] = useState<string>('mauve');
  const [iconHoverEffect, setIconHoverEffect] = useState<'none' | 'spin' | 'bounce' | 'scale' | 'wiggle' | 'pulse'>('none');
  const [selectedIconName, setSelectedIconName] = useState('CatIcon');
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular' | 'svg'>('react');

  const filteredIcons = iconList.filter(icon =>
    !iconSearch || icon.name.toLowerCase().includes(iconSearch.toLowerCase()) || icon.category.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const grouped = filteredIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = [];
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, typeof iconList>);

  const getReactIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` className="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    return `<span class="hl-tag">&lt;${selectedIconName}</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">{${iconSize}}</span>\n  <span class="hl-attr">strokeWidth</span>=<span class="hl-str">{${iconStroke}}</span>${colorProp}${classProp}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` class="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    return `<span class="hl-tag">&lt;Ctp${selectedIconName}</span>\n  <span class="hl-attr">:size</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">:stroke-width</span>=<span class="hl-str">"${iconStroke}"</span>${colorProp}${classProp}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` class="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    const kebabName = selectedIconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return `<span class="hl-tag">&lt;${kebabName}</span>\n  <span class="hl-attr">[size]</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">[strokeWidth]</span>=<span class="hl-str">"${iconStroke}"</span>${colorProp}${classProp}\n<span class="hl-tag">&gt;&lt;/${kebabName}&gt;</span>`;
  };

  const getSvgIconCode = () => {
    const strokeClass = iconHoverEffect !== 'none' ? ` icon--hover-${iconHoverEffect}` : '';
    const paths = iconPaths[selectedIconName] || '';
    const colorVal = iconColor === 'text' ? 'currentColor' : `var(--ctp-${iconColor})`;
    return `<span class="hl-tag">&lt;svg</span>\n  <span class="hl-attr">xmlns</span>=<span class="hl-str">"http://www.w3.org/2000/svg"</span>\n  <span class="hl-attr">width</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">height</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">viewBox</span>=<span class="hl-str">"0 0 24 24"</span>\n  <span class="hl-attr">fill</span>=<span class="hl-str">"none"</span>\n  <span class="hl-attr">stroke</span>=<span class="hl-str">"${colorVal}"</span>\n  <span class="hl-attr">stroke-width</span>=<span class="hl-str">"${iconStroke}"</span>\n  <span class="hl-attr">stroke-linecap</span>=<span class="hl-str">"round"</span>\n  <span class="hl-attr">stroke-linejoin</span>=<span class="hl-str">"round"</span>\n  <span class="hl-attr">class</span>=<span class="hl-str">"icon${strokeClass}"</span>\n<span class="hl-tag">&gt;</span>\n  ${paths.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '\n  ')}\n<span class="hl-tag">&lt;/svg&gt;</span>`;
  };

  const colorOptions = ['text', 'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'];

  const IconComponent = iconList.find(i => i.name === selectedIconName)?.component;

  return (
    <section>
      <h2 className="section-title"><span>✨</span> Icons Pack</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Icon Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="icon-size">Size: {iconSize}px</label>
              <input id="icon-size" type="range" min="16" max="64" value={iconSize} onChange={(e) => setIconSize(Number(e.target.value))} style={{ cursor: 'pointer', accentColor: 'var(--ctp-mauve)' }} />
            </div>
            <div className="control-group">
              <label htmlFor="icon-stroke">Stroke Width: {iconStroke}</label>
              <input id="icon-stroke" type="range" min="0.5" max="3" step="0.25" value={iconStroke} onChange={(e) => setIconStroke(Number(e.target.value))} style={{ cursor: 'pointer', accentColor: 'var(--ctp-mauve)' }} />
            </div>
            <div className="control-group">
              <label htmlFor="icon-color">Color</label>
              <select id="icon-color" value={iconColor} onChange={(e) => setIconColor(e.target.value)}>
                {colorOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="icon-hover">Hover Animation</label>
              <select id="icon-hover" value={iconHoverEffect} onChange={(e) => setIconHoverEffect(e.target.value as any)}>
                <option value="none">None</option>
                <option value="spin">Spin</option>
                <option value="bounce">Bounce</option>
                <option value="scale">Scale</option>
                <option value="wiggle">Wiggle</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="icon-search">Search Icons</label>
            <input id="icon-search" type="text" value={iconSearch} onChange={(e) => setIconSearch(e.target.value)} placeholder="Search by name or category..." />
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Icon Preview & Code</h3>
          <div className="preview-canvas" style={{ minHeight: '160px', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Selected: {selectedIconName}</span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[24, 32, 48].map(s => {
                  const Comp = IconComponent as any;
                  return Comp ? <Comp key={s} size={s} strokeWidth={iconStroke} color={iconColor !== 'text' ? iconColor : undefined} className={iconHoverEffect !== 'none' ? `icon--hover-${iconHoverEffect}` : ''} /> : null;
                })}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)' }}>24px / 32px / 48px sizes</span>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular', 'svg'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab === 'svg' ? 'SVG' : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => {
                const code = activeTab === 'react' ? getReactIconCode() : activeTab === 'vue' ? getVueIconCode() : activeTab === 'angular' ? getAngularIconCode() : getSvgIconCode();
                copyToClipboard(code.replace(/<[^>]*>/g, ''));
              }}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactIconCode() : activeTab === 'vue' ? getVueIconCode() : activeTab === 'angular' ? getAngularIconCode() : getSvgIconCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        {Object.entries(grouped).map(([category, icons]) => (
          <div key={category}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--ctp-mauve)' }}>{category}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
              {icons.map(icon => {
                const Comp = icon.component as any;
                return (
                  <div key={icon.name}
                    onClick={() => setSelectedIconName(icon.name)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px', cursor: 'pointer',
                      borderRadius: '8px', backgroundColor: selectedIconName === icon.name ? 'var(--ctp-surface0)' : 'transparent',
                      border: selectedIconName === icon.name ? '1px solid var(--ctp-mauve)' : '1px solid transparent',
                      transition: 'var(--ctp-transition)'
                    }}
                  >
                    {Comp ? <Comp size={24} strokeWidth={1.5} /> : null}
                    <span style={{ fontSize: '0.65rem', color: 'var(--ctp-subtext0)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{icon.name.replace('Icon', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
