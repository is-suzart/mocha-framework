import { Card, Breadcrumb, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarGroup, ProgressBar, Alert } from '@mocha-ds/react';
import { EditIcon, DownloadIcon, PlusIcon, UserIcon, SparklesIcon, FolderIcon, MouseIcon, ArrowUpIcon, ArrowDownIcon, HelpIcon } from '@mocha-ds/react';

export default function TemplatePage() {
  return (
    <section className="template-page" style={{ padding: '0' }}>
      <div className="template-header">
        <div className="template-header-left">
          <Breadcrumb items={[{ label: 'Dashboard', href: '#' }, { label: 'Analytics', href: '#' }, { label: 'Overview', href: '#' }]} />
          <h1 className="template-title">Analytics Overview</h1>
        </div>
        <div className="template-header-right">
          <Badge color="green" variant="tonal" size="sm">Live</Badge>
          <Button variant="outline" color="mauve" size="sm"><EditIcon /> Edit</Button>
          <Button variant="outline" color="blue" size="sm"><DownloadIcon /> Export</Button>
          <Button variant="filled" color="mauve" size="sm"><PlusIcon /> New Report</Button>
        </div>
      </div>

      <div className="template-stats">
        {[{ icon: <UserIcon />, bg: 'var(--ctp-blue)', color: 'var(--ctp-blue)', label: 'Total Users', value: '24.8k', trend: '12.5%', up: true },
          { icon: <SparklesIcon />, bg: 'var(--ctp-green)', color: 'var(--ctp-green)', label: 'Revenue', value: '$48.2k', trend: '8.2%', up: true },
          { icon: <FolderIcon />, bg: 'var(--ctp-peach)', color: 'var(--ctp-peach)', label: 'Active Projects', value: '142', trend: '4.1%', up: true },
          { icon: <MouseIcon />, bg: 'var(--ctp-red)', color: 'var(--ctp-red)', label: 'Conversion', value: '3.24%', trend: '2.4%', up: false }
        ].map((stat, idx) => (
          <Card key={idx} variant="filled" className="template-stat-card">
            <div className="template-stat-icon" style={{ backgroundColor: `color-mix(in srgb, ${stat.bg} 15%, transparent)`, color: stat.color }}>{stat.icon}</div>
            <div className="template-stat-info">
              <span className="template-stat-label">{stat.label}</span>
              <span className="template-stat-value">{stat.value}</span>
              <span className="template-stat-trend" data-state={stat.up ? 'up' : 'down'}>{stat.up ? <ArrowUpIcon /> : <ArrowDownIcon />} {stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="template-content-grid">
        <div className="template-col-main">
          <Card variant="elevated" padding="lg">
            <Tabs defaultValue="overview" variant="underline">
              <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="traffic">Traffic</TabsTrigger><TabsTrigger value="reports">Reports</TabsTrigger></TabsList>
              <TabsContent value="overview" style={{ paddingTop: 'var(--ctp-space-md, 16px)' }}>
                <div className="template-section-header"><h3 className="template-section-title">Recent Transactions</h3><Badge color="mauve" variant="tonal" size="sm">14 new</Badge></div>
                <table className="template-table">
                  <thead><tr><th>Transaction</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {[{ name: 'Payment to Acme Corp', amount: '$2,400.00', date: 'Jul 15, 2026', status: 'green', label: 'Completed' }, { name: 'Refund — John Doe', amount: '$180.00', date: 'Jul 14, 2026', status: 'yellow', label: 'Pending' }, { name: 'Subscription — SaaS Co', amount: '$99.00', date: 'Jul 13, 2026', status: 'green', label: 'Completed' }, { name: 'Invoice #482 — Design Inc', amount: '$3,600.00', date: 'Jul 12, 2026', status: 'blue', label: 'Processing' }, { name: 'Withdrawal — ATM', amount: '$200.00', date: 'Jul 11, 2026', status: 'red', label: 'Failed' }].map((tx, i) => (
                      <tr key={i}><td><span className="template-tx-name">{tx.name}</span></td><td><strong>{tx.amount}</strong></td><td>{tx.date}</td><td><Badge color={tx.status as any} variant="tonal" size="sm">{tx.label}</Badge></td></tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="traffic"><div style={{ padding: '24px', textAlign: 'center', color: 'var(--ctp-subtext0)', fontStyle: 'italic' }}>Traffic analytics panel — chart placeholder</div></TabsContent>
              <TabsContent value="reports"><div style={{ padding: '24px', textAlign: 'center', color: 'var(--ctp-subtext0)', fontStyle: 'italic' }}>Generated reports list — placeholder</div></TabsContent>
            </Tabs>
          </Card>
        </div>
        <div className="template-col-side">
          <Card variant="elevated" className="template-side-card"><h3 className="template-section-title">Team</h3>
            <AvatarGroup size="md"><Avatar fallback="AM" /><Avatar fallback="JD" /><Avatar fallback="RK" /><Avatar fallback="LP" /><Avatar fallback="SC" /></AvatarGroup>
            <div style={{ marginTop: 'var(--ctp-space-sm, 8px)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge color="mauve" size="sm">Design</Badge><Badge color="blue" size="sm">Engineering</Badge><Badge color="green" size="sm">Product</Badge><Badge color="peach" size="sm">Marketing</Badge>
            </div>
          </Card>
          <Card variant="elevated" className="template-side-card"><h3 className="template-section-title">Project Progress</h3>
            <div className="template-progress-list">
              {[{ label: 'Design System', val: 85, color: 'mauve' }, { label: 'Frontend Migration', val: 62, color: 'blue' }, { label: 'Documentation', val: 40, color: 'yellow' }, { label: 'API Integration', val: 28, color: 'peach' }].map((p, i) => (
                <div key={i} className="template-progress-item"><div className="template-progress-header"><span>{p.label}</span><span className="template-progress-pct">{p.val}%</span></div><ProgressBar value={p.val} color={p.color as any} size="sm" /></div>
              ))}
            </div>
          </Card>
          <Card variant="elevated" className="template-side-card"><h3 className="template-section-title">Notifications</h3>
            <Alert variant="info" title="New feature">Dashboard layout powered by the Catppuccin Design System.</Alert>
            <Alert variant="warning" title="Scheduled Maintenance">Saturday, 2:00 AM — 4:00 AM UTC.</Alert>
          </Card>
          <div className="template-actions">
            <Button variant="filled" color="mauve" style={{ flex: 1 }}><SparklesIcon /> Upgrade Plan</Button>
            <Button variant="ghost" color="blue" style={{ flex: 1 }}><HelpIcon /> Documentation</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
