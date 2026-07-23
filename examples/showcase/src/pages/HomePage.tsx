import { colors } from '../data/colors';

export default function HomePage() {
  return (
    <div>
      <header className="showcase-header">
        <div>
          <h1 className="header-title" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            🐱 Welcome to Catppuccin Design System
          </h1>
          <div className="header-subtitle" style={{ fontSize: '0.85rem' }}>
            Explore cozy pastel-themed UI components for React, Vue, and Angular. Select a component from the sidebar to get started.
          </div>
        </div>
      </header>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐱</div>
        <p style={{ color: 'var(--ctp-subtext0)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Catppuccin is a community-driven pastel theme designed to be easy on the eyes. 
          This showcase demonstrates all available components across different variants, sizes, and flavors.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {colors.slice(0, 14).map(c => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `var(${c.variable})`, margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--ctp-subtext0)' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
