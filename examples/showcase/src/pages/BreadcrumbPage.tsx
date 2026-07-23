import { Breadcrumb } from '@mocha-ds/react';

export default function BreadcrumbPage() {
  return (
    <section>
      <h2 className="section-title"><span>🍞</span> Breadcrumb Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Examples</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'var(--ctp-mantle)', borderRadius: '12px' }}>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Documentation', href: '/docs' }, { label: 'Components' }]} />
            <Breadcrumb items={[{ label: '🐱 Catppuccin', href: '/' }, { label: 'Design System', href: '/ds' }, { label: 'React' }]} />
          </div>
        </div>
      </div>
    </section>
  );
}
