import { useState } from "react";
import { Shell, Grid } from '@mocha-ds/react';
import type { ShellLayout } from '@mocha-ds/react';

export default function ShellPage() {
  const [shellLayout, setShellLayout] = useState<ShellLayout>('header-first');
  const [shellSidebarCollapsed, setShellSidebarCollapsed] = useState(false);
  const [shellSidebarMini, setShellSidebarMini] = useState(false);
  const [shellSidebarMobileOpen, setShellSidebarMobileOpen] = useState(false);
  const [shellHeaderHeight] = useState('60px');
  const [shellSidebarWidth] = useState('240px');
  const [shellScrollable, setShellScrollable] = useState(true);

  return (
    <section className="playground-section">
      <h2 className="section-title"><span>💻</span> Layout Shell Component</h2>
      <div className="playground-section">
        <div className="demo-stage" style={{ width: '100%' }}>
          <div style={{ border: '1px solid var(--ctp-surface1)', borderRadius: '12px', overflow: 'hidden', height: '460px', position: 'relative' }}>
            <Shell layout={shellLayout} fullScreen={true} sidebarCollapsed={shellSidebarCollapsed} sidebarMini={shellSidebarMini} sidebarMobileOpen={shellSidebarMobileOpen} onBackdropClick={() => setShellSidebarMobileOpen(false)} headerHeight={shellHeaderHeight} sidebarWidth={shellSidebarWidth}>
              {shellLayout !== 'custom' && (
                <Shell.Header style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🐱</span>
                    <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>Catppuccin Shell Demo</span>
                  </div>
                </Shell.Header>
              )}
              {shellLayout !== 'simple' && shellLayout !== 'custom' && (
                <Shell.Sidebar style={{ padding: shellSidebarMini ? '1rem 0.5rem' : '1.5rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[{ icon: '🏠', label: 'Dashboard' }, { icon: '📊', label: 'Analytics' }, { icon: '👥', label: 'Team Members' }, { icon: '⚙️', label: 'Settings' }].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.8rem', borderRadius: '8px', backgroundColor: idx === 0 ? 'var(--ctp-surface0)' : 'transparent', color: idx === 0 ? 'var(--ctp-mauve)' : 'var(--ctp-text)', fontWeight: idx === 0 ? 'bold' : 'normal', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', justifyContent: shellSidebarMini ? 'center' : 'flex-start' }} title={item.label}><span style={{ fontSize: '1.1rem' }}>{item.icon}</span>{!shellSidebarMini && <span>{item.label}</span>}</div>
                    ))}
                  </div>
                </Shell.Sidebar>
              )}
              <Shell.Main>
                <Shell.Content scrollable={shellScrollable} style={{ padding: '1rem' }}>
                  <Grid><Grid.Col md={6} sm={12}><div style={{ padding: '1.5rem', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', border: '1px solid var(--ctp-surface0)' }}><h5 style={{ margin: '0 0 0.5rem 0' }}>Content Block A</h5><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext1)' }}>Content inside the Shell layout.</p></div></Grid.Col><Grid.Col md={6} sm={12}><div style={{ padding: '1.5rem', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', border: '1px solid var(--ctp-surface0)' }}><h5 style={{ margin: '0 0 0.5rem 0' }}>Content Block B</h5><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext1)' }}>Responsive grid columns.</p></div></Grid.Col></Grid>
                </Shell.Content>
              </Shell.Main>
            </Shell>
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">Shell Customizer</h3>
          <div className="control-group">
            <label className="control-label">Layout Preset</label>
            <select value={shellLayout} onChange={(e) => setShellLayout(e.target.value as ShellLayout)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', color: 'var(--ctp-text)', fontFamily: 'var(--ctp-font-family)', outline: 'none' }}>
              <option value="header-first">Header First</option>
              <option value="sidebar-first">Sidebar First</option>
              <option value="simple">Simple (No Sidebar)</option>
              <option value="custom">Custom Layout</option>
            </select>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={shellSidebarCollapsed} onChange={(e) => setShellSidebarCollapsed(e.target.checked)} /><span>Sidebar Collapsed</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.75rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={shellSidebarMini} onChange={(e) => setShellSidebarMini(e.target.checked)} /><span>Sidebar Mini Mode</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.75rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={shellScrollable} onChange={(e) => setShellScrollable(e.target.checked)} /><span>Content Scrollable</span></label>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <pre className="code-block" style={{ padding: '1rem' }}>
          <code>{`import { Shell } from '@mocha-ds/react';

<Shell layout="${shellLayout}">
  <Shell.Header>Header content</Shell.Header>
  <Shell.Sidebar>Sidebar navigation</Shell.Sidebar>
  <Shell.Main>
    <Shell.Content scrollable={${shellScrollable}}>
      Main content area
    </Shell.Content>
  </Shell.Main>
</Shell>`}</code>
        </pre>
      </div>
    </section>
  );
}
