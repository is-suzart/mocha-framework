import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mocha-ds/react';
import type { TabsVariant, TabsOrientation, ButtonColor } from '@mocha-ds/react';
import { colors } from '../data/colors';

export default function TabsPage() {
  const [tabsActiveVal, setTabsActiveVal] = useState('general');
  const [tabsVariant, setTabsVariant] = useState<TabsVariant>('underline');
  const [tabsColor, setTabsColor] = useState<ButtonColor>('mauve');
  const [tabsSize, setTabsSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [tabsOrientation, setTabsOrientation] = useState<TabsOrientation>('horizontal');

  return (
    <section>
      <h2 className="section-title"><span>🗂️</span> Compound Tabs Layouts</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Tabs Styling Settings</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="tabs-variant-select">Visual Style</label>
              <select id="tabs-variant-select" value={tabsVariant} onChange={(e) => setTabsVariant(e.target.value as TabsVariant)}>
                <option value="default">Default Panel</option>
                <option value="underline">Underline Accent</option>
                <option value="pills">Pills Box</option>
                <option value="segmented">Segmented Block</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="tabs-color-select">Color Accent</label>
              <select id="tabs-color-select" value={tabsColor} onChange={(e) => setTabsColor(e.target.value as ButtonColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="tabs-size-select">Component Size</label>
              <select id="tabs-size-select" value={tabsSize} onChange={(e) => setTabsSize(e.target.value as any)}>
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="tabs-orient-select">Orientation</label>
              <select id="tabs-orient-select" value={tabsOrientation} onChange={(e) => setTabsOrientation(e.target.value as TabsOrientation)}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '260px', alignItems: 'stretch', justifyContent: 'stretch' }}>
            <Tabs value={tabsActiveVal} onValueChange={setTabsActiveVal} variant={tabsVariant} color={tabsColor} size={tabsSize} orientation={tabsOrientation} style={{ width: '100%', gap: '16px' }}>
              <TabsList>
                <TabsTrigger value="general">⚙️ General</TabsTrigger>
                <TabsTrigger value="themes">🎨 Themes</TabsTrigger>
                <TabsTrigger value="advanced">🚀 Advanced</TabsTrigger>
              </TabsList>
              <div style={{ padding: '1.2rem', flexGrow: 1, backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', minHeight: '120px' }}>
                <TabsContent value="general"><h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>General Settings</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>Configure default behaviors, workspace paths, and automatic backup routines.</p></TabsContent>
                <TabsContent value="themes"><h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>Theme Selector</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>Swap active palettes between light and dark variants.</p></TabsContent>
                <TabsContent value="advanced"><h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>Advanced Options</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>Inspect background worker threads and allocate memory sizes.</p></TabsContent>
              </div>
            </Tabs>
          </div>
          <div>
            <pre className="code-block" style={{ fontSize: '0.8rem' }}>
              <code>{`// React compound Tabs usage\n<Tabs value="${tabsActiveVal}" variant="${tabsVariant}" color="${tabsColor}" size="${tabsSize}" orientation="${tabsOrientation}">\n  <TabsList>\n    <TabsTrigger value="general">⚙️ General</TabsTrigger>\n    <TabsTrigger value="themes">🎨 Themes</TabsTrigger>\n    <TabsTrigger value="advanced">🚀 Advanced</TabsTrigger>\n  </TabsList>\n  <TabsContent value="general">...</TabsContent>\n</Tabs>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
