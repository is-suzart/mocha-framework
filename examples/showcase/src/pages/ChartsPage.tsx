import { CtpLineChart, CtpAreaChart, CtpBarChart, CtpPieChart, CtpRadarChart } from '../charts';

export default function ChartsPage() {
  return (
    <section>
      <h2 className="section-title"><span>📊</span> Charts — Catppuccin × Recharts</h2>
      <div className="chart-stats">
        {[
          { label: 'Downloads', value: '284K', trend: '+18.4%', up: true },
          { label: 'GitHub Stars', value: '12.7K', trend: '+6.2%', up: true },
          { label: 'Contributors', value: '348', trend: '+11.5%', up: true },
          { label: 'Open Issues', value: '37', trend: '-14%', up: false },
        ].map((stat) => (
          <div key={stat.label} className="chart-stat">
            <div className="chart-stat__label">{stat.label}</div>
            <div className="chart-stat__value">{stat.value}</div>
            <div className={`chart-stat__trend chart-stat__trend--${stat.up ? 'up' : 'down'}`}>
              {stat.up ? '↑' : '↓'} {stat.trend} vs last month
            </div>
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card__header">
            <div>
              <h3 className="chart-card__name">Weekly Downloads</h3>
              <p className="chart-card__subtitle">npm package installs per week</p>
            </div>
            <div className="chart-card__badge">📈 Line</div>
          </div>
          <CtpLineChart xAxisKey="week" series={[{ key: 'react', label: 'React', colorIndex: 0 }, { key: 'vue', label: 'Vue', colorIndex: 1 }, { key: 'angular', label: 'Angular', colorIndex: 2 }]} data={[{ week: 'W1', react: 4800, vue: 3200, angular: 2100 }, { week: 'W2', react: 5200, vue: 3600, angular: 2400 }, { week: 'W3', react: 4900, vue: 3400, angular: 2600 }, { week: 'W4', react: 6100, vue: 4100, angular: 2900 }, { week: 'W5', react: 5800, vue: 4500, angular: 3100 }, { week: 'W6', react: 7200, vue: 4800, angular: 3400 }, { week: 'W7', react: 6900, vue: 5200, angular: 3700 }, { week: 'W8', react: 8100, vue: 5600, angular: 4000 }]} height={250} />
        </div>
        <div className="chart-card">
          <div className="chart-card__header">
            <div><h3 className="chart-card__name">Stars by Category</h3><p className="chart-card__subtitle">GitHub stars across Catppuccin ports</p></div>
            <div className="chart-card__badge">📊 Bar</div>
          </div>
          <CtpBarChart xAxisKey="name" series={[{ key: 'stars', label: 'Stars (k)' }]} rainbowMode data={[{ name: 'VS Code', stars: 4.8 }, { name: 'Nvim', stars: 3.5 }, { name: 'iTerm', stars: 2.8 }, { name: 'Discord', stars: 2.1 }, { name: 'Alacritty', stars: 1.6 }, { name: 'GitHub', stars: 2.5 }, { name: 'Spicetify', stars: 1.1 }]} height={250} showLegend={false} />
        </div>
        <div className="chart-card">
          <div className="chart-card__header">
            <div><h3 className="chart-card__name">Community Growth</h3><p className="chart-card__subtitle">Cumulative contributors over time</p></div>
            <div className="chart-card__badge">🌊 Area</div>
          </div>
          <CtpAreaChart xAxisKey="month" series={[{ key: 'members', label: 'Community Members', colorIndex: 3 }, { key: 'contributors', label: 'Contributors', colorIndex: 2 }]} data={[{ month: 'Jan', members: 1200, contributors: 42 }, { month: 'Feb', members: 1800, contributors: 68 }, { month: 'Mar', members: 2600, contributors: 95 }, { month: 'Apr', members: 3400, contributors: 134 }, { month: 'May', members: 4800, contributors: 178 }, { month: 'Jun', members: 6200, contributors: 223 }, { month: 'Jul', members: 7900, contributors: 271 }, { month: 'Aug', members: 9800, contributors: 320 }, { month: 'Sep', members: 11400, contributors: 348 }]} height={250} />
        </div>
        <div className="chart-card">
          <div className="chart-card__header">
            <div><h3 className="chart-card__name">Framework Scorecard</h3><p className="chart-card__subtitle">Catppuccin port quality by framework</p></div>
            <div className="chart-card__badge">🕸️ Radar</div>
          </div>
          <CtpRadarChart angleKey="criterion" series={[{ key: 'react', label: 'React', colorIndex: 0 }, { key: 'vue', label: 'Vue', colorIndex: 1 }, { key: 'angular', label: 'Angular', colorIndex: 2 }]} data={[{ criterion: 'Coverage', react: 95, vue: 88, angular: 82 }, { criterion: 'A11y', react: 90, vue: 85, angular: 88 }, { criterion: 'Perf', react: 92, vue: 94, angular: 86 }, { criterion: 'DX', react: 96, vue: 91, angular: 78 }, { criterion: 'Bundle', react: 85, vue: 92, angular: 74 }, { criterion: 'Docs', react: 94, vue: 87, angular: 90 }]} height={250} />
        </div>
        <div className="chart-card charts-grid--full">
          <div className="chart-card__header">
            <div><h3 className="chart-card__name">Flavor Popularity</h3><p className="chart-card__subtitle">Which Catppuccin flavor users love most</p></div>
            <div className="chart-card__badge">🍩 Donut</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
            <CtpPieChart donut height={280} data={[{ name: 'Macchiato', value: 38400 }, { name: 'Mocha', value: 29700 }, { name: 'Frappé', value: 18200 }, { name: 'Latte', value: 14600 }]} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ name: 'Macchiato', value: '38.4K', pct: '38%', colorIdx: 0 }, { name: 'Mocha', value: '29.7K', pct: '30%', colorIdx: 1 }, { name: 'Frappé', value: '18.2K', pct: '18%', colorIdx: 2 }, { name: 'Latte', value: '14.6K', pct: '15%', colorIdx: 3 }].map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ['var(--ctp-mauve)', 'var(--ctp-blue)', 'var(--ctp-green)', 'var(--ctp-peach)'][item.colorIdx], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ctp-text)' }}>{item.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)' }}>{item.value} downloads</div></div>
                  <div style={{ background: 'var(--ctp-surface1)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ctp-text)', fontVariantNumeric: 'tabular-nums' }}>{item.pct}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card charts-grid--full">
          <div className="chart-card__header">
            <div><h3 className="chart-card__name">Top Ports by Stars</h3><p className="chart-card__subtitle">GitHub stars across the Catppuccin ecosystem</p></div>
            <div className="chart-card__badge">↔️ Horizontal Bar</div>
          </div>
          <CtpBarChart xAxisKey="name" layout="vertical" series={[{ key: 'stars', label: 'Stars (k)' }]} rainbowMode showLegend={false} data={[{ name: 'VS Code', stars: 4800 }, { name: 'GitHub CSS', stars: 2500 }, { name: 'Neovim', stars: 3500 }, { name: 'Discord', stars: 2100 }, { name: 'Firefox', stars: 1600 }, { name: 'KDE Plasma', stars: 1700 }, { name: 'Alacritty', stars: 1200 }, { name: 'Spicetify', stars: 1100 }]} height={320} />
        </div>
      </div>
      <div style={{ marginTop: '24px', padding: '20px 24px', background: 'linear-gradient(135deg, color-mix(in srgb, var(--ctp-mauve) 10%, transparent), color-mix(in srgb, var(--ctp-blue) 8%, transparent))', border: '1px solid color-mix(in srgb, var(--ctp-mauve) 20%, transparent)', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>🎨</div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--ctp-text)', marginBottom: '6px', fontSize: '0.95rem' }}>Reactive Theme Colors</div>
          <div style={{ color: 'var(--ctp-subtext1)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            All charts read colors from <code style={{ background: 'var(--ctp-surface0)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>CSS custom properties</code> at runtime via a custom hook.
          </div>
        </div>
      </div>
    </section>
  );
}
