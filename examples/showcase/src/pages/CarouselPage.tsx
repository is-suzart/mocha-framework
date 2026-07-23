import { Carousel } from '@mocha-ds/react';

export default function CarouselPage() {
  return (
    <section>
      <h2 className="section-title"><span>🎠</span> Carousel Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Auto-play Carousel</h3>
          <Carousel autoPlay autoPlayInterval={3000}>
            {[
              { color: 'var(--ctp-mauve)', label: 'Mauve' },
              { color: 'var(--ctp-blue)', label: 'Blue' },
              { color: 'var(--ctp-green)', label: 'Green' },
              { color: 'var(--ctp-peach)', label: 'Peach' },
            ].map((slide, i) => (
              <div key={i} style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: slide.color, borderRadius: 12, fontSize: '1.5rem', fontWeight: 700, color: 'var(--ctp-base)' }}>
                {slide.label}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--ctp-crust)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', marginTop: '16px' }}>
        Props: <code>showArrows</code>, <code>showDots</code>, <code>autoPlay</code>, <code>autoPlayInterval</code>.
        Navigation via keyboard, swipe, or dots.
      </div>
    </section>
  );
}
