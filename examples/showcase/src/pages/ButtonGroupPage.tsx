import { useState } from "react";
import { ButtonGroup, ButtonGroupItem } from '@mocha-ds/react';
import type { ButtonGroupOrientation, ButtonGroupVariant, ButtonVariant, ButtonColor, ButtonShape, ButtonGroupSelectionMode } from '@mocha-ds/react';
import { colors } from '../data/colors';

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function ButtonGroupPage() {
  const [groupOrientation, setGroupOrientation] = useState<ButtonGroupOrientation>('horizontal');
  const [groupLayoutVariant, setGroupLayoutVariant] = useState<ButtonGroupVariant>('filled');
  const [groupVariant, setGroupVariant] = useState<ButtonVariant>('filled');
  const [groupColor, setGroupColor] = useState<ButtonColor>('mauve');
  const [groupShape, setGroupShape] = useState<ButtonShape>('rounded');
  const [groupCount, setGroupCount] = useState(3);
  const [groupSelectionMode, setGroupSelectionMode] = useState<ButtonGroupSelectionMode>('none');
  const [groupSingleValue, setGroupSingleValue] = useState<string>('opt1');
  const [groupMultiValue, setGroupMultiValue] = useState<string[]>(['opt1', 'opt2']);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactButtonGroupCode = () => {
    const props: string[] = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') {
      props.push(`selectionMode="${groupSelectionMode}"`);
      if (groupSelectionMode === 'single') { props.push('value={selectedValue}'); props.push('onChange={setSelectedValue}'); }
      else { props.push('value={selectedValues}'); props.push('onChange={setSelectedValues}'); }
    }
    const btnProps: string[] = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);
    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;Button</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/Button&gt;</span>`;
    }
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;ButtonGroup</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/ButtonGroup&gt;</span>`;
  };

  const getVueButtonGroupCode = () => {
    const props: string[] = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') { props.push(`selectionMode="${groupSelectionMode}"`); props.push('v-model="value"'); }
    const btnProps: string[] = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);
    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;CtpButton</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/CtpButton&gt;</span>`;
    }
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;CtpButtonGroup</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/CtpButtonGroup&gt;</span>`;
  };

  const getAngularButtonGroupCode = () => {
    const props: string[] = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') { props.push(`selectionMode="${groupSelectionMode}"`); props.push('[(value)]="value"'); }
    const btnProps: string[] = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);
    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;button</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/button&gt;</span>`;
    }
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;button-group</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/button-group&gt;</span>`;
  };

  const getRawTextCode = () => {
    const code = activeTab === 'react' ? getReactButtonGroupCode() : activeTab === 'vue' ? getVueButtonGroupCode() : getAngularButtonGroupCode();
    return code.replace(/<[^>]*>/g, '');
  };

  return (
    <section>
      <h2 className="section-title"><span>{'\u{1F5C2}\uFE0F'}</span> Button Group Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Group Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="group-orientation">Orientation</label>
              <select id="group-orientation" value={groupOrientation} onChange={(e) => setGroupOrientation(e.target.value as ButtonGroupOrientation)}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-count">Number of Buttons</label>
              <select id="group-count" value={groupCount} onChange={(e) => setGroupCount(Number(e.target.value))}>
                <option value={2}>2 Buttons</option>
                <option value={3}>3 Buttons</option>
                <option value={4}>4 Buttons</option>
                <option value={5}>5 Buttons</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-variant">Buttons Variant</label>
              <select id="group-variant" value={groupVariant} onChange={(e) => setGroupVariant(e.target.value as ButtonVariant)}>
                <option value="filled">Filled</option>
                <option value="tonal">Tonal</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-color">Accent Color</label>
              <select id="group-color" value={groupColor} onChange={(e) => setGroupColor(e.target.value as ButtonColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-shape">Buttons Shape</label>
              <select id="group-shape" value={groupShape} onChange={(e) => setGroupShape(e.target.value as ButtonShape)}>
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="pill">Pill</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-layout-variant">Group Style</label>
              <select id="group-layout-variant" value={groupLayoutVariant} onChange={(e) => setGroupLayoutVariant(e.target.value as ButtonGroupVariant)}>
                <option value="filled">Filled</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="group-selection-mode">Selection Mode</label>
              <select id="group-selection-mode" value={groupSelectionMode} onChange={(e) => setGroupSelectionMode(e.target.value as ButtonGroupSelectionMode)}>
                <option value="none">None (Standard Group)</option>
                <option value="single">Single Select (Radio Group)</option>
                <option value="multiple">Multiple Select (Checkbox Group)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Group Preview</h3>
          <div className="preview-canvas" style={{ padding: '2.5rem', minHeight: '220px', flexDirection: 'column', gap: '1.5rem' }}>
            <ButtonGroup variant={groupLayoutVariant} shape={groupShape} orientation={groupOrientation} selectionMode={groupSelectionMode}
              value={groupSelectionMode === 'single' ? groupSingleValue : groupMultiValue}
              onChange={(val) => { if (groupSelectionMode === 'single') setGroupSingleValue(val); else setGroupMultiValue(val); }}>
              {Array.from({ length: groupCount }).map((_, index) => (
                <ButtonGroupItem key={index} value={`opt${index + 1}`} variant={groupVariant} color={groupColor} shape={groupShape}>
                  Option {index + 1}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
            {groupSelectionMode !== 'none' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)', fontFamily: 'monospace' }}>
                Selected Value: {groupSelectionMode === 'single' ? groupSingleValue : JSON.stringify(groupMultiValue)}
              </div>
            )}
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => copyToClipboard(getRawTextCode())}>Copy Code</button>
              <pre className="code-block">
                <code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactButtonGroupCode() : activeTab === 'vue' ? getVueButtonGroupCode() : getAngularButtonGroupCode() }} />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
