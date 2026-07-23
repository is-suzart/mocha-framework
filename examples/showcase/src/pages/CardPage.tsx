import { useState } from "react";
import { Card, Tile, Button, Select, FormGroup } from '@mocha-ds/react';
import type { CardVariant, CardShape, CardPadding, CardAccentColor, CardAccentPosition } from '@mocha-ds/react';
import { colors } from '../data/colors';

export default function CardPage() {
  const [selectedTileId, setSelectedTileId] = useState<string>('t1');
  const [multiSelectedTileIds, setMultiSelectedTileIds] = useState<string[]>(['m1']);
  const [cardVariant, setCardVariant] = useState<CardVariant>('filled');
  const [cardShape, setCardShape] = useState<CardShape>('rounded');
  const [cardPadding, setCardPadding] = useState<CardPadding>('md');
  const [cardAccent, setCardAccent] = useState<CardAccentColor>('mauve');
  const [cardAccentPos, setCardAccentPos] = useState<CardAccentPosition>('top');
  const [cardInteractive, setCardInteractive] = useState<boolean>(true);

  return (
    <>
      <section>
        <h2 className="section-title"><span>🎴</span> Card Components Showcase</h2>
        <div className="playground-section">
          <div className="demo-stage">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              <div>
                <h3 className="stage-title">Card Variants</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <Card variant="filled" padding="md"><Card.Header title="Filled Variant" subtitle="Default cozy backdrop" /><Card.Body>This card has a solid background with a very subtle border and standard shadow.</Card.Body></Card>
                  <Card variant="elevated" padding="md"><Card.Header title="Elevated Variant" subtitle="Floating layer feel" /><Card.Body>This card utilizes a larger, softer box shadow to feel physically raised above the canvas.</Card.Body></Card>
                  <Card variant="outline" padding="md"><Card.Header title="Outline Variant" subtitle="Minimalist container" /><Card.Body>This card has a transparent background and a thin solid border outlining its edges.</Card.Body></Card>
                  <Card variant="flat" padding="md"><Card.Header title="Flat Variant" subtitle="No borders or shadows" /><Card.Body>This card sits flat on the page with a subtle surface background, no border, and no shadow.</Card.Body></Card>
                </div>
              </div>
              <div>
                <h3 className="stage-title">Accents & Colored Background Cards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <Card accentColor="mauve" accentPosition="top" isInteractive padding="md"><Card.Header title="Top Accent Mauve" subtitle="Hover to lift" /><Card.Body>Hovering on this interactive card scales it up gently and highlights the border with the Mauve color.</Card.Body></Card>
                  <Card accentColor="peach" accentPosition="left" isInteractive padding="md"><Card.Header title="Left Accent Peach" subtitle="Sidebar colored line" /><Card.Body>A thick Peach color bar on the left edge. Great for emphasizing card status or categories.</Card.Body></Card>
                  <Card variant="colored" accentColor="lavender" isInteractive padding="md"><Card.Header title="Colored Background" subtitle="Lavender Flavor" /><Card.Body>This card has the entire background colored using a Catppuccin accent color.</Card.Body></Card>
                </div>
              </div>
              <div>
                <h3 className="stage-title">Rich Content Card</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Card variant="elevated" isInteractive={cardInteractive} accentColor={cardAccent} accentPosition={cardAccentPos} shape={cardShape} padding={cardPadding} style={{ maxWidth: '440px', width: '100%' }}>
                    <Card.Header title="Catppuccin Palettes" subtitle="By CozyDevelopers • 4 hours ago" avatar={<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--ctp-mauve)', color: 'var(--ctp-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>CD</div>} />
                    <Card.Media style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--ctp-mauve), var(--ctp-blue))' }}><span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ctp-base)' }}>Visual Banner Area</span></Card.Media>
                    <Card.Body><p style={{ margin: 0 }}>Catppuccin is a community-driven, pastel theme designed to be easy on the eyes.</p></Card.Body>
                    <Card.Footer><Button variant="ghost" color="lavender" size="sm">Share</Button><Button variant="filled" color="mauve" size="sm">Explore</Button></Card.Footer>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="playground-controls">
            <h3 className="controls-title">Interactive Card Builder</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <FormGroup label="Card Variant"><Select value={cardVariant} onChange={(e) => setCardVariant(e.target.value as any)}><option value="filled">Filled</option><option value="elevated">Elevated</option><option value="outline">Outline</option><option value="flat">Flat</option><option value="colored">Colored Background</option></Select></FormGroup>
              <FormGroup label="Border Radius Shape"><Select value={cardShape} onChange={(e) => setCardShape(e.target.value as any)}><option value="square">Square</option><option value="rounded">Rounded</option><option value="pill">Pill</option></Select></FormGroup>
              <FormGroup label="Body Padding"><Select value={cardPadding} onChange={(e) => setCardPadding(e.target.value as any)}><option value="none">None</option><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></Select></FormGroup>
              <FormGroup label="Accent Color"><Select value={cardAccent} onChange={(e) => setCardAccent(e.target.value as any)}>{colors.map(c => <option key={c.variable} value={c.name.toLowerCase()}>{c.name}</option>)}</Select></FormGroup>
              <FormGroup label="Accent Position"><Select value={cardAccentPos} onChange={(e) => setCardAccentPos(e.target.value as any)}><option value="none">None</option><option value="top">Top Bar</option><option value="left">Left Bar</option></Select></FormGroup>
              <FormGroup label="Interaction Hover Effect"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={cardInteractive} onChange={(e) => setCardInteractive(e.target.checked)} /><span>Enable Hover Animation</span></label></FormGroup>
            </div>
          </div>
        </div>
      </section>
      <section style={{ marginTop: '3rem' }}>
        <h2 className="section-title"><span>🏁</span> Tile Components Showcase</h2>
        <div className="playground-section">
          <div className="demo-stage">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              <div>
                <h3 className="stage-title">Sizes & Shapes</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
                  <Tile size="sm" shape="square" title="Small Square" subtitle="8px padding" icon="⚙️" />
                  <Tile size="md" shape="rounded" title="Medium Rounded" subtitle="14px padding" icon="🚀" />
                  <Tile size="lg" shape="pill" title="Large Pill" subtitle="20px padding" icon="💎" />
                </div>
              </div>
              <div>
                <h3 className="stage-title">Layout Orientations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <Tile orientation="horizontal" title="Horizontal Layout" subtitle="Icon on left" icon="⚡" meta="Ctrl+S" />
                  <Tile orientation="vertical" title="Vertical Layout" subtitle="Stack elements" icon="📅" meta="Amanhã" />
                  <Tile orientation="vertical-center" title="Centered Layout" subtitle="Aligned center" icon="🔔" meta="2 novos" />
                </div>
              </div>
              <div>
                <h3 className="stage-title">Tonal, Indicators & Colored</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <Tile variant="tonal" color="green" indicator="left" icon="✅" title="Concluído" subtitle="Build passou" />
                  <Tile variant="tonal" color="yellow" indicator="top" icon="⚠️" title="Atenção" subtitle="CPU elevado" />
                  <Tile variant="colored" color="mauve" icon="🔮" title="Colored Tile" subtitle="Mauve bg" />
                  <Tile variant="colored" color="peach" icon="🍑" title="Colored Tile" subtitle="Peach bg" />
                </div>
              </div>
              <div>
                <h3 className="stage-title">Interactive Choice Selection</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>Radio Selection (Single)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Tile isInteractive isSelected={selectedTileId === 't1'} onClick={() => setSelectedTileId('t1')} title="Plano Padrão" subtitle="10 GB storage" meta="R$ 15/mês" icon={selectedTileId === 't1' ? '🟢' : '⚪'} />
                      <Tile isInteractive isSelected={selectedTileId === 't2'} onClick={() => setSelectedTileId('t2')} title="Plano Profissional" subtitle="100 GB + CDN" meta="R$ 49/mês" icon={selectedTileId === 't2' ? '🟢' : '⚪'} />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>Checkbox Selection (Multiple)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {['m1', 'm2'].map((id, index) => {
                        const isSelected = multiSelectedTileIds.includes(id);
                        return <Tile key={id} isInteractive isSelected={isSelected} onClick={() => setMultiSelectedTileIds(prev => isSelected ? prev.filter(i => i !== id) : [...prev, id])} title={index === 0 ? "Backup Diário" : "Suporte VIP"} subtitle={index === 0 ? "Envios automáticos" : "Atendimento imediato"} meta={index === 0 ? "+ R$ 10" : "+ R$ 25"} icon={isSelected ? '☑️' : '⏹️'} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="stage-title">Metrics Dashboard Layout</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <Tile variant="elevated" color="mauve" indicator="left" orientation="vertical" title="R$ 14.230" subtitle="Receita Mensal" icon="💰" />
                  <Tile variant="elevated" color="sky" indicator="left" orientation="vertical" title="24.5k" subtitle="Visitas Únicas" icon="👥" />
                  <Tile variant="elevated" color="green" indicator="left" orientation="vertical" title="99.98%" subtitle="Uptime API" icon="📈" />
                  <Tile variant="elevated" color="red" indicator="left" orientation="vertical" title="3" subtitle="Erros Pendentes" icon="🐞" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
