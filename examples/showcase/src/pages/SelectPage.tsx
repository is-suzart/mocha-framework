import { useState } from "react";
import { MultiSelect, TreeSelect } from '@mocha-ds/react';
import type { FormControlColor, FormControlSize, FormControlShape } from '@mocha-ds/react';
import { colors } from '../data/colors';
import { selectTechOptions, selectTreeData } from '../data/demoData';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function SelectPage() {
  const [selectAccent, setSelectAccent] = useState<FormControlColor>('mauve');
  const [selectSize, setSelectSize] = useState<FormControlSize>('md');
  const [selectShape, setSelectShape] = useState<FormControlShape>('rounded');
  const [selectSearchable, setSelectSearchable] = useState(true);
  const [selectMultipleTree, setSelectMultipleTree] = useState(false);
  const [selectValueMulti, setSelectValueMulti] = useState<string[]>(['react', 'ts']);
  const [selectValueTreeSingle, setSelectValueTreeSingle] = useState<string>('showcase');
  const [selectValueTreeMulti, setSelectValueTreeMulti] = useState<string[]>(['showcase', 'react-pkg']);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactSelectCode = () => `<span class="hl-tag">&lt;MultiSelect</span>\n  <span class="hl-attr">options</span>=<span class="hl-str">{options}</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">{selectedValues}</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{setSelectedValues}</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span>\n  <span class="hl-attr">searchable</span>=<span class="hl-str">{${selectSearchable}}</span>\n<span class="hl-tag">/&gt;</span>`;
  const getVueSelectCode = () => `<span class="hl-tag">&lt;CtpMultiSelect</span> <span class="hl-attr">:options</span>=<span class="hl-str">"options"</span> <span class="hl-attr">v-model</span>=<span class="hl-str">"selectedValues"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span> <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span> <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span> <span class="hl-tag">/&gt;</span>`;
  const getAngularSelectCode = () => `<span class="hl-tag">&lt;multi-select</span> <span class="hl-attr">[options]</span>=<span class="hl-str">"options"</span> <span class="hl-attr">[(value)]</span>=<span class="hl-str">"selectedValues"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span> <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span> <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span><span class="hl-tag">&gt;&lt;/multi-select&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>🔍</span> Advanced Select Components</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>Select Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="select-accent-picker">Accent Flavor</label>
              <select id="select-accent-picker" value={selectAccent} onChange={(e) => setSelectAccent(e.target.value as FormControlColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="select-size-picker">Controls Size</label>
              <select id="select-size-picker" value={selectSize} onChange={(e) => setSelectSize(e.target.value as FormControlSize)}>
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="select-shape-picker">Controls Shape</label>
              <select id="select-shape-picker" value={selectShape} onChange={(e) => setSelectShape(e.target.value as FormControlShape)}>
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="pill">Pill</option>
              </select>
            </div>
            <div className="control-group">
              <label className="checkbox-label" style={{ marginTop: '22px' }}><input type="checkbox" checked={selectSearchable} onChange={(e) => setSelectSearchable(e.target.checked)} />Enable MultiSelect Search</label>
            </div>
          </div>
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--ctp-surface0)', paddingTop: '12px' }}>
            <label>TreeSelect Behaviors</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <label className="checkbox-label"><input type="checkbox" checked={selectMultipleTree} onChange={(e) => { setSelectMultipleTree(e.target.checked); setSelectValueTreeSingle(''); setSelectValueTreeMulti(['showcase']); }} />Enable Tree Multiple Selection</label>
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Canvas Previews</h3>
          <div className="preview-canvas" style={{ minHeight: '260px', flexDirection: 'column', gap: '20px', padding: '1.5rem', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--ctp-subtext0)', fontWeight: 600 }}>MultiSelect Dropdown:</span>
              <MultiSelect options={selectTechOptions} value={selectValueMulti} onChange={setSelectValueMulti} color={selectAccent} size={selectSize} shape={selectShape} searchable={selectSearchable} placeholder="Escolha tecnologias..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--ctp-subtext0)', fontWeight: 600 }}>TreeSelect Dropdown:</span>
              <TreeSelect data={selectTreeData} multiple={selectMultipleTree} value={selectValueTreeSingle} onChange={setSelectValueTreeSingle} multipleValue={selectValueTreeMulti} onChangeMultiple={setSelectValueTreeMulti} color={selectAccent} size={selectSize} shape={selectShape} placeholder="Escolha arquivos..." />
            </div>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactSelectCode() : activeTab === 'vue' ? getVueSelectCode() : getAngularSelectCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactSelectCode() : activeTab === 'vue' ? getVueSelectCode() : getAngularSelectCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="payload-canvas">
          <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${selectAccent})` }}>MultiSelect Selected Keys</h4>
          <pre className="code-block" style={{ margin: 0, padding: '10px' }}><code style={{ color: 'var(--ctp-green)' }}>{JSON.stringify(selectValueMulti, null, 2)}</code></pre>
        </div>
        <div className="payload-canvas">
          <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${selectAccent})` }}>TreeSelect Selected Keys</h4>
          <pre className="code-block" style={{ margin: 0, padding: '10px' }}><code style={{ color: 'var(--ctp-green)' }}>{selectMultipleTree ? JSON.stringify(selectValueTreeMulti, null, 2) : JSON.stringify(selectValueTreeSingle, null, 2)}</code></pre>
        </div>
      </div>
    </section>
  );
}
