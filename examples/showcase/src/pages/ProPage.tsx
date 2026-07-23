import { useState } from "react";
import { DragDropProvider, ReorderableTabs, ReorderableTable, Kanban } from '@mocha-ds/react-pro';
import type { ReorderableColumn, KanbanColumn, KanbanItem } from '@mocha-ds/react-pro';
import { Button, Input, Select } from '@mocha-ds/react';
import type { Employee } from '../mockDatabase';
import { demoEmployees, initialKanbanColumns, initialKanbanItems } from '../data/kanbanData';
import { useLocation } from 'react-router-dom';

export default function ProPage() {
  const location = useLocation();
  const isKanban = location.pathname === '/kanban';

  const [proTableData, setProTableData] = useState<Employee[]>(demoEmployees);
  const [proTableColumns, setProTableColumns] = useState<ReorderableColumn<Employee>[]>([
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'email', header: 'E-mail' },
    { key: 'role', header: 'Cargo', sortable: true },
    { key: 'department', header: 'Depto' },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'salary', header: 'Salário', sortable: true, align: 'right' },
  ]);
  const [proTableColumnWidths, setProTableColumnWidths] = useState<Record<string, number>>({});
  const [proSortField, setProSortField] = useState('');
  const [proSortOrder, setProSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [proSelectedIds, setProSelectedIds] = useState<(string | number)[]>([]);

  const [kanbanColumns] = useState<KanbanColumn[]>(initialKanbanColumns);
  const [kanbanItems, setKanbanItems] = useState<KanbanItem[]>(initialKanbanItems);
  const [kanbanThemeColor, setKanbanThemeColor] = useState<string>('mauve');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardColumn, setNewCardColumn] = useState('todo');
  const [newCardTags, setNewCardTags] = useState('');

  const addNewCard = () => {
    if (!newCardTitle.trim()) return;
    const newId = `task-${Date.now()}`;
    const tagsArray = newCardTags.split(',').map(t => t.trim()).filter(Boolean);
    const newItem: KanbanItem = { id: newId, columnId: newCardColumn, title: newCardTitle.trim(), description: newCardDesc.trim() || undefined, tags: tagsArray.length > 0 ? tagsArray : undefined };
    setKanbanItems([...kanbanItems, newItem]);
    setNewCardTitle(''); setNewCardDesc(''); setNewCardTags('');
  };

  if (isKanban) {
    return (
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}><span>📋</span> Pro: Quadro Kanban Reordenável</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Cor Temática:</span>
            <Select value={kanbanThemeColor} onChange={(e) => setKanbanThemeColor(e.target.value)} size="sm" color="mauve" style={{ minWidth: '120px' }}>
              {['rosewater','flamingo','pink','mauve','red','maroon','peach','yellow','green','teal','sky','sapphire','blue','lavender'].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--ctp-surface0)' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--ctp-subtext1)' }}>🆕 Adicionar Novo Cartão de Tarefa</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Título</label><Input type="text" placeholder="e.g. Implementar testes" value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Descrição</label><Input type="text" placeholder="Detalhes da tarefa" value={newCardDesc} onChange={(e) => setNewCardDesc(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Coluna</label><Select value={newCardColumn} onChange={(e) => setNewCardColumn(e.target.value)} size="sm"><option value="backlog">Backlog</option><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></Select></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 150px' }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Tags (vírgula)</label><Input type="text" placeholder="Dev, Frontend" value={newCardTags} onChange={(e) => setNewCardTags(e.target.value)} /></div>
            <Button variant="filled" color="green" onClick={addNewCard} style={{ flexShrink: 0 }}>Adicionar</Button>
          </div>
        </div>
        <DragDropProvider apiKey="dev">
          <Kanban columns={kanbanColumns} items={kanbanItems} onItemsChange={(newItems) => setKanbanItems(newItems)} color={kanbanThemeColor as any} />
        </DragDropProvider>
        <div style={{ marginTop: '2rem' }}>
          <pre className="code-block" style={{ fontSize: '0.85rem' }}><code>{`import { DragDropProvider, Kanban } from '@mocha-ds/react-pro';

<DragDropProvider apiKey="sk_live_your_key">
  <Kanban
    columns={columns}
    items={items}
    onItemsChange={(newItems) => setItems(newItems)}
    color="${kanbanThemeColor}"
  />
</DragDropProvider>`}</code></pre>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="section-title"><span>⚡</span> Pro: Reorderable Tabs & Table</h2>
      <div className="playground-section">
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Drag to reorder tabs</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '260px', alignItems: 'stretch', justifyContent: 'stretch' }}>
            <DragDropProvider apiKey="dev">
              <ReorderableTabs defaultValue="projects" color="mauve" variant="pills" onOrderChange={(newOrder) => console.log('New tab order:', newOrder)}>
                <ReorderableTabs.List>
                  <ReorderableTabs.Trigger value="projects">📁 Projects</ReorderableTabs.Trigger>
                  <ReorderableTabs.Trigger value="settings">⚙️ Settings</ReorderableTabs.Trigger>
                  <ReorderableTabs.Trigger value="activity">📊 Activity</ReorderableTabs.Trigger>
                  <ReorderableTabs.Trigger value="team">👥 Team</ReorderableTabs.Trigger>
                </ReorderableTabs.List>
                <div style={{ padding: '1.2rem', flexGrow: 1, backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', minHeight: '120px' }}>
                  <ReorderableTabs.Content value="projects"><h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Projects</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>Drag the tab handles to reorder.</p></ReorderableTabs.Content>
                  <ReorderableTabs.Content value="settings"><h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Settings</h4><p style={{ margin: 0 }}>Pro feature: reorder tabs by dragging.</p></ReorderableTabs.Content>
                  <ReorderableTabs.Content value="activity"><h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Activity</h4><p style={{ margin: 0 }}>Monitor recent activity.</p></ReorderableTabs.Content>
                  <ReorderableTabs.Content value="team"><h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Team</h4><p style={{ margin: 0 }}>Manage team members.</p></ReorderableTabs.Content>
                </div>
              </ReorderableTabs>
            </DragDropProvider>
          </div>
        </div>
      </div>

      <hr style={{ margin: '2.5rem 0', border: 'none', borderTop: '1px solid var(--ctp-surface1)' }} />

      <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Reorderable Table (column reorder, row reorder, column resize)</h3>
      <div className="playground-section">
        <div className="playground-card playground-card--preview">
          <div className="preview-canvas" style={{ padding: '1.5rem', minHeight: '320px', alignItems: 'stretch', justifyContent: 'stretch' }}>
            <DragDropProvider apiKey="dev">
              <ReorderableTable<Employee> data={proTableData} columns={proTableColumns} rowKey={(r) => r.id} onRowOrderChange={(newData) => setProTableData(newData)} onColumnOrderChange={(newCols) => setProTableColumns(newCols)} onColumnResize={(key, w) => setProTableColumnWidths((prev) => ({ ...prev, [key]: w }))} columnWidths={proTableColumnWidths} sortField={proSortField} sortOrder={proSortOrder} onSort={(field, order) => { setProSortField(field); setProSortOrder(order); }} selectedRowIds={proSelectedIds} onSelectionChange={setProSelectedIds} size="md" color="mauve" />
            </DragDropProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
