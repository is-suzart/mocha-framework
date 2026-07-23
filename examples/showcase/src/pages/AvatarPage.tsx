import { Avatar, AvatarGroup } from '@mocha-ds/react';

export default function AvatarPage() {
  return (
    <section>
      <h2 className="section-title"><span>👤</span> Avatar Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Individual Avatars</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar src="https://i.pravatar.cc/64?img=1" size="sm" />
            <Avatar src="https://i.pravatar.cc/64?img=2" size="md" />
            <Avatar src="https://i.pravatar.cc/64?img=3" size="lg" />
            <Avatar src="https://i.pravatar.cc/64?img=4" size="xl" />
            <Avatar fallback="John Doe" size="md" />
            <Avatar fallback="A" size="md" />
          </div>
        </div>
        <div className="playground-card" style={{ marginTop: '16px' }}>
          <h3>Avatar Group</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <AvatarGroup max={4}>
              <Avatar src="https://i.pravatar.cc/64?img=5" />
              <Avatar src="https://i.pravatar.cc/64?img=6" />
              <Avatar src="https://i.pravatar.cc/64?img=7" />
              <Avatar src="https://i.pravatar.cc/64?img=8" />
              <Avatar src="https://i.pravatar.cc/64?img=9" />
            </AvatarGroup>
            <AvatarGroup size="lg" max={3}>
              <Avatar fallback="Alice" />
              <Avatar fallback="Bob" />
              <Avatar fallback="Charlie" />
              <Avatar fallback="Diana" />
              <Avatar fallback="Eve" />
            </AvatarGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
