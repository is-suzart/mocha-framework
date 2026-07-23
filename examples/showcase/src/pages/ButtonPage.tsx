import { useState } from "react";
import { Button } from '@mocha-ds/react';
import type { ButtonVariant, ButtonColor, ButtonSize, ButtonShape } from '@mocha-ds/react';
import { colors } from '../data/colors';
import { galleryItems, type GalleryItem } from '../data/demoData';

const HeartFillIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function ButtonPage() {
  const [buttonText, setButtonText] = useState('Click me');
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('filled');
  const [btnColor, setBtnColor] = useState<ButtonColor>('mauve');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnShape, setBtnShape] = useState<ButtonShape>('rounded');
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnLeftIcon, setBtnLeftIcon] = useState(false);
  const [btnRightIcon, setBtnRightIcon] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const handleGalleryClick = (item: GalleryItem) => {
    setButtonText(item.text);
    setBtnVariant(item.variant);
    setBtnColor(item.color);
    setBtnSize(item.size);
    setBtnShape(item.shape);
    setBtnIsLoading(item.isLoading);
    setBtnDisabled(item.disabled);
    setBtnLeftIcon(item.leftIcon);
    setBtnRightIcon(item.rightIcon);
  };

  const getReactBtnCode = () => {
    const props: string[] = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push('isLoading');
    if (btnDisabled) props.push('disabled');
    if (btnLeftIcon) props.push('leftIcon={<HeartFillIcon />}');
    if (btnRightIcon) props.push('rightIcon={<ArrowIcon />}');
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;Button</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>\n  ${buttonText}\n<span class="hl-tag">&lt;/Button&gt;</span>`;
  };

  const getVueBtnCode = () => {
    const props: string[] = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push(':is-loading="true"');
    if (btnDisabled) props.push(':disabled="true"');
    const iconTemplates: string[] = [];
    if (btnLeftIcon) iconTemplates.push('    <span class="hl-tag">&lt;template</span> <span class="hl-attr">#leftIcon</span><span class="hl-tag">&gt;</span><span class="hl-tag">&lt;HeartIcon</span> <span class="hl-tag">/&gt;</span><span class="hl-tag">&lt;/template&gt;</span>');
    if (btnRightIcon) iconTemplates.push('    <span class="hl-tag">&lt;template</span> <span class="hl-attr">#rightIcon</span><span class="hl-tag">&gt;</span><span class="hl-tag">&lt;ArrowIcon</span> <span class="hl-tag">/&gt;</span><span class="hl-tag">&lt;/template&gt;</span>');
    const slotsStr = iconTemplates.length > 0 ? `\n${iconTemplates.join('\n')}\n  ` : ` ${buttonText} `;
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;CtpButton</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${btnLeftIcon || btnRightIcon ? `\n  ${buttonText}\n` : ''}${slotsStr}<span class="hl-tag">&lt;/CtpButton&gt;</span>`;
  };

  const getAngularBtnCode = () => {
    const props: string[] = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push('[isLoading]="true"');
    if (btnDisabled) props.push('[disabled]="true"');
    const iconElements: string[] = [];
    if (btnLeftIcon) iconElements.push('  <span class="hl-tag">&lt;span</span> <span class="hl-attr">leftIcon</span><span class="hl-tag">&gt;</span>\u2764\uFE0F<span class="hl-tag">&lt;/span&gt;</span>');
    if (btnRightIcon) iconElements.push('  <span class="hl-tag">&lt;span</span> <span class="hl-attr">rightIcon</span><span class="hl-tag">&gt;</span>\u27A1\uFE0F<span class="hl-tag">&lt;/span&gt;</span>');
    const contentStr = iconElements.length > 0 ? `\n${iconElements.join('\n')}\n  ${buttonText}\n` : ` ${buttonText} `;
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;button</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${contentStr}<span class="hl-tag">&lt;/button&gt;</span>`;
  };

  const getRawTextCode = () => {
    const code = activeTab === 'react' ? getReactBtnCode() : activeTab === 'vue' ? getVueBtnCode() : getAngularBtnCode();
    return code.replace(/<[^>]*>/g, '');
  };

  return (
    <>
      <section>
        <h2 className="section-title">
          <span>\u26A1</span> Button Playground
        </h2>
        <div className="playground-section">
          <div className="playground-card">
            <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Configuration</h3>
            <div className="control-grid">
              <div className="control-group control-group--full">
                <label htmlFor="btn-label">Button Label</label>
                <input id="btn-label" type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
              </div>
              <div className="control-group">
                <label htmlFor="btn-variant">Variant</label>
                <select id="btn-variant" value={btnVariant} onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}>
                  <option value="filled">Filled</option>
                  <option value="tonal">Tonal</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="btn-color">Accent Color</label>
                <select id="btn-color" value={btnColor} onChange={(e) => setBtnColor(e.target.value as ButtonColor)}>
                  {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="btn-size">Size</label>
                <select id="btn-size" value={btnSize} onChange={(e) => setBtnSize(e.target.value as ButtonSize)}>
                  <option value="sm">Small (sm)</option>
                  <option value="md">Medium (md)</option>
                  <option value="lg">Large (lg)</option>
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="btn-shape">Shape</label>
                <select id="btn-shape" value={btnShape} onChange={(e) => setBtnShape(e.target.value as ButtonShape)}>
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label>States & Accessories</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <label className="checkbox-label"><input type="checkbox" checked={btnLeftIcon} onChange={(e) => setBtnLeftIcon(e.target.checked)} />Left Icon</label>
                <label className="checkbox-label"><input type="checkbox" checked={btnRightIcon} onChange={(e) => setBtnRightIcon(e.target.checked)} />Right Icon</label>
                <label className="checkbox-label"><input type="checkbox" checked={btnIsLoading} onChange={(e) => setBtnIsLoading(e.target.checked)} />Loading State</label>
                <label className="checkbox-label"><input type="checkbox" checked={btnDisabled} onChange={(e) => setBtnDisabled(e.target.checked)} />Disabled</label>
              </div>
            </div>
          </div>
          <div className="playground-card playground-card--preview">
            <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>
            <div className="preview-canvas">
              <Button
                variant={btnVariant} color={btnColor} size={btnSize} shape={btnShape}
                isLoading={btnIsLoading} disabled={btnDisabled}
                leftIcon={btnLeftIcon ? <HeartFillIcon /> : undefined}
                rightIcon={btnRightIcon ? <ArrowIcon /> : undefined}
              >
                {buttonText}
              </Button>
            </div>
            <div>
              <div className="tabs-header">
                {(['react', 'vue', 'angular'] as const).map((tab) => (
                  <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="code-container">
                <button className="code-copy-btn" onClick={() => copyToClipboard(getRawTextCode())}>Copy Code</button>
                <pre className="code-block">
                  <code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactBtnCode() : activeTab === 'vue' ? getVueBtnCode() : getAngularBtnCode() }} />
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title"><span>{'\u{1F4DA}'}</span> Preconfigured Gallery</h2>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div key={item.title} className="gallery-card" onClick={() => handleGalleryClick(item)}>
              <span className="gallery-card-title">{item.title}</span>
              <Button variant={item.variant} color={item.color} size={item.size} shape={item.shape} isLoading={item.isLoading} disabled={item.disabled} leftIcon={item.leftIcon ? <HeartFillIcon /> : undefined} rightIcon={item.rightIcon ? <ArrowIcon /> : undefined}>
                {item.text}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
