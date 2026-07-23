import { Skeleton } from '@mocha-ds/react';

export default function SkeletonPage() {
  return (
    <section>
      <h2 className="section-title"><span>💀</span> Skeleton Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Preview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', background: 'var(--ctp-mantle)', borderRadius: '12px' }}>
            <Skeleton variant="text" size="lg" width="60%" />
            <Skeleton variant="text" size="md" width="80%" />
            <Skeleton variant="text" size="sm" width="40%" />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
              <Skeleton variant="circle" size="xl" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton variant="text" size="md" width="50%" />
                <Skeleton variant="text" size="sm" width="70%" />
              </div>
            </div>
            <Skeleton variant="rect" size="xl" />
            <Skeleton count={3} gap="8px" variant="text" size="sm" />
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--ctp-crust)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', marginTop: '16px' }}>
        Variants: <code>text</code>, <code>circle</code>, <code>rect</code>. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>, <code>xl</code>.
        Use <code>count</code> for repeated skeletons, <code>animated=false</code> to disable shimmer.
      </div>
    </section>
  );
}
