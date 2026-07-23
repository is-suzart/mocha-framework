import { useState } from "react";
import { Grid } from '@mocha-ds/react';
import type { GridGap, GridAlign, GridValign } from '@mocha-ds/react';

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function GridPage() {
  const [gridGap, setGridGap] = useState<GridGap>(3);
  const [gridMobile, setGridMobile] = useState(false);
  const [gridMultiline, setGridMultiline] = useState(true);
  const [gridAlign, setGridAlign] = useState<GridAlign>('start');
  const [gridValign, setGridValign] = useState<GridValign>('start');
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactGridCode = () => {
    return `<span class="hl-tag">&lt;Grid</span>\n  <span class="hl-attr">gap</span>=<span class="hl-str">{${gridGap}}</span>\n  <span class="hl-attr">mobile</span>=<span class="hl-str">{${gridMobile}}</span>\n  <span class="hl-attr">multiline</span>=<span class="hl-str">{${gridMultiline}}</span>\n  <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span>\n  <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{12}</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">md</span>=<span class="hl-str">{4}</span> <span class="hl-attr">sm</span>=<span class="hl-str">{12}</span><span class="hl-tag">&gt;</span>1/3 no desk, 12/12 no mobile<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n<span class="hl-tag">&lt;/Grid&gt;</span>`;
  };

  const getVueGridCode = () => {
    return `<span class="hl-tag">&lt;CtpGrid</span> <span class="hl-attr">:gap</span>=<span class="hl-str">"${gridGap}"</span> <span class="hl-attr">:mobile</span>=<span class="hl-str">"${gridMobile}"</span> <span class="hl-attr">:multiline</span>=<span class="hl-str">"${gridMultiline}"</span> <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span> <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"12"</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n<span class="hl-tag">&lt;/CtpGrid&gt;</span>`;
  };

  const getAngularGridCode = () => {
    return `<span class="hl-tag">&lt;grid</span> <span class="hl-attr">[gap]</span>=<span class="hl-str">"${gridGap}"</span> <span class="hl-attr">[mobile]</span>=<span class="hl-str">"${gridMobile}"</span> <span class="hl-attr">[multiline]</span>=<span class="hl-str">"${gridMultiline}"</span> <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span> <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"12"</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/div&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/div&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/div&gt;</span>\n<span class="hl-tag">&lt;/grid&gt;</span>`;
  };

  return (
    <section className="playground-section">
      <h2 className="section-title"><span>📦</span> Flexbox Grid Component</h2>
      <div className="playground-panel">
        <div className="demo-stage" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 className="stage-title">Interactive Stage</h3>
          <div style={{ padding: '2rem', backgroundColor: 'var(--ctp-crust)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', overflow: 'hidden' }}>
            <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>1. Flex columns sharing space equally (Automatic Widths)</h4>
            <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
              <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>Auto-col A</Grid.Col>
              <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>Auto-col B</Grid.Col>
              <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>Auto-col C</Grid.Col>
            </Grid>

            <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>2. Column Span Spans (12-Columns grid base)</h4>
            <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
              <Grid.Col span={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>span-12 (100%)</Grid.Col>
              <Grid.Col span={8} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>span-8 (66.6%)</Grid.Col>
              <Grid.Col span={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>span-4 (33.3%)</Grid.Col>
              <Grid.Col span={6} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>span-6 (50%)</Grid.Col>
              <Grid.Col span={6} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>span-6 (50%)</Grid.Col>
            </Grid>

            <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>3. Offsets and Alignment</h4>
            <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
              <Grid.Col span={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-peach)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-peach)', fontWeight: 600 }}>Col 4</Grid.Col>
              <Grid.Col span={4} offset={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-peach)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-peach)', fontWeight: 600 }}>Col 4 Offset 4</Grid.Col>
            </Grid>

            <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>4. Responsive Stacking (md=4, sm=12)</h4>
            <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign}>
              <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>Col A (md-4 sm-12)</Grid.Col>
              <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>Col B (md-4 sm-12)</Grid.Col>
              <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>Col C (md-4 sm-12)</Grid.Col>
            </Grid>
          </div>
        </div>

        <div className="playground-controls">
          <h3 className="controls-title">Grid Customizer</h3>
          <div className="control-group">
            <label className="control-label">Gap Spacing Size</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {([0, 1, 2, 3, 4, 5] as const).map((g) => (
                <button key={g} onClick={() => setGridGap(g)} style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: gridGap === g ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: gridGap === g ? 'var(--ctp-mauve)' : 'transparent', color: gridGap === g ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold' }}>{g}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Align Columns (Justify Content)</label>
            <select value={gridAlign} onChange={(e) => setGridAlign(e.target.value as any)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', color: 'var(--ctp-text)', fontFamily: 'var(--ctp-font-family)', outline: 'none' }}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Vertical Align (Align Items)</label>
            <select value={gridValign} onChange={(e) => setGridValign(e.target.value as any)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', color: 'var(--ctp-text)', fontFamily: 'var(--ctp-font-family)', outline: 'none' }}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>
          <div className="control-group" style={{ marginTop: '1.5rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={gridMobile} onChange={(e) => setGridMobile(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Force Row layout on Mobile (mobile)</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.75rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={gridMultiline} onChange={(e) => setGridMultiline(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Enable Columns Wrapping (multiline)</span></label>
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
          <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactGridCode() : activeTab === 'vue' ? getVueGridCode() : getAngularGridCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)', cursor: 'pointer' }}>Copy Code</button>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
            <code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactGridCode() : activeTab === 'vue' ? getVueGridCode() : getAngularGridCode() }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
