import { useState, useEffect, useMemo } from "react";
import { Table, Column, Pagination, PageSizeSelector, Button, Input, Select, Modal, FormGroup, TreeTable, TreeColumn } from '@mocha-ds/react';
import { SearchIcon, DownloadIcon, PlusIcon, EditIcon, TrashIcon, EyeIcon } from '@mocha-ds/react';
import type { Employee } from '../mockDatabase';
import { fetchDataFromServer, addEmployee, updateEmployee, deleteEmployee, deleteMultipleEmployees, getFullLocalDatabase, getFilterMetadata } from '../mockDatabase';
import type { FormControlColor, FormControlSize } from '@mocha-ds/react';
import { initialFilesData, FileNode } from '../mockFilesDatabase';

export default function TablePage() {
  const [tableSubTab, setTableSubTab] = useState<'standard' | 'tree'>('standard');
  const [tableMode, setTableMode] = useState<'client' | 'server'>('server');
  const [tableData, setTableData] = useState<Employee[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatus, setTableStatus] = useState('All');
  const [tableRole, setTableRole] = useState('All');
  const [tableSortField, setTableSortField] = useState('name');
  const [tableSortOrder, setTableSortOrder] = useState<'asc' | 'desc' | ''>('asc');
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(5);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [tableTotalItems, setTableTotalItems] = useState(0);
  const [tableIsLoading, setTableIsLoading] = useState(false);
  const [selectedTableIds, setSelectedTableIds] = useState<(string | number)[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({ id: true, name: true, email: true, role: true, department: true, status: true, salary: true, joinedDate: true });
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [tableColor, setTableColor] = useState<FormControlColor>('mauve');
  const [tableSize, setTableSize] = useState<FormControlSize>('md');
  const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Software Engineer');
  const [newEmpStatus, setNewEmpStatus] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [newEmpSalary, setNewEmpSalary] = useState('5000');
  const [newEmpJoinedDate, setNewEmpJoinedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Tree table states
  const [treeSearch, setTreeSearch] = useState('');
  const [treeSelectedIds, setTreeSelectedIds] = useState<(string | number)[]>([]);
  const [treeExpandedIds, setTreeExpandedIds] = useState<(string | number)[]>([]);
  const [treeSortField, setTreeSortField] = useState<string>('name');
  const [treeSortOrder, setTreeSortOrder] = useState<'asc' | 'desc' | ''>('asc');
  const [treeColor, setTreeColor] = useState<FormControlColor>('mauve');
  const [treeSize, setTreeSize] = useState<FormControlSize>('md');
  const [treeCascade, setTreeCascade] = useState(true);

  const treeColumns = useMemo<TreeColumn<FileNode>[]>(() => [
    { key: 'name', header: 'Nome', sortable: true, render: (row: FileNode, value: any, _depth: number, isExpanded: boolean) => { let icon = '📄'; if (row.type === 'Diretório') icon = isExpanded ? '📂' : '📁'; return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '1.1rem' }}>{icon}</span><span style={{ fontWeight: row.type === 'Diretório' ? 600 : 400 }}>{value}</span></span>; } },
    { key: 'type', header: 'Tipo', render: (row: FileNode, value: any) => <span style={{ fontSize: '0.85rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: row.type === 'Diretório' ? 'var(--ctp-surface1)' : 'var(--ctp-surface0)', color: row.type === 'Diretório' ? 'var(--ctp-teal)' : 'var(--ctp-text)' }}>{value}</span> },
    { key: 'size', header: 'Tamanho', sortable: true, align: 'right', sortValue: (row: FileNode) => row.sizeBytes, render: (_row: FileNode, value: any) => <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--ctp-subtext1)' }}>{value}</span> },
    { key: 'updatedAt', header: 'Última Modificação', sortable: true, align: 'center', render: (_row: FileNode, value: any) => value ? <span style={{ color: 'var(--ctp-subtext0)', fontSize: '0.85rem' }}>{new Date(value).toLocaleDateString('pt-BR')}</span> : '-' }
  ], []);

  useEffect(() => { setTablePage(1); }, [tableSearch, tableStatus, tableRole]);

  useEffect(() => {
    let active = true;
    const fetchWrapper = async () => {
      if (tableMode === 'server') {
        setTableIsLoading(true);
        try {
          const res = await fetchDataFromServer({ search: tableSearch, status: tableStatus, role: tableRole, sortField: tableSortField, sortOrder: tableSortOrder, page: tablePage, limit: tableLimit });
          if (!active) return;
          setTableData(res.data); setTableTotalPages(res.pagination.totalPages); setTableTotalItems(res.pagination.total);
        } catch (err) { console.error(err); } finally { if (active) setTableIsLoading(false); }
      } else {
        setTableIsLoading(true);
        setTimeout(() => {
          if (!active) return;
          const fullData = getFullLocalDatabase();
          const filtered = fullData.filter(item => {
            const s = !tableSearch || item.name.toLowerCase().includes(tableSearch.toLowerCase()) || item.email.toLowerCase().includes(tableSearch.toLowerCase()) || item.role.toLowerCase().includes(tableSearch.toLowerCase()) || item.id.toLowerCase().includes(tableSearch.toLowerCase());
            return s && (tableStatus === 'All' || item.status === tableStatus) && (tableRole === 'All' || item.role === tableRole);
          });
          if (tableSortField && tableSortOrder) filtered.sort((a, b) => { let va = (a as any)[tableSortField], vb = (b as any)[tableSortField]; if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); } return va < vb ? (tableSortOrder === 'asc' ? -1 : 1) : va > vb ? (tableSortOrder === 'asc' ? 1 : -1) : 0; });
          const total = filtered.length;
          setTableData(filtered.slice((tablePage - 1) * tableLimit, tablePage * tableLimit));
          setTableTotalPages(Math.ceil(total / tableLimit) || 1); setTableTotalItems(total); setTableIsLoading(false);
        }, 120);
      }
    };
    fetchWrapper();
    return () => { active = false; };
  }, [tableMode, tableSearch, tableStatus, tableRole, tableSortField, tableSortOrder, tablePage, tableLimit, tableRefreshTrigger]);

  const handleTableSort = (field: string, order: 'asc' | 'desc' | '') => { setTableSortField(field); setTableSortOrder(order); };
  const handleTableCellEdit = async (rowId: string | number, columnKey: string, newValue: any) => { await updateEmployee(String(rowId), { [columnKey]: newValue }); setTableRefreshTrigger(prev => prev + 1); };
  const handleTableDeleteRow = async (rowId: string | number) => { await deleteEmployee(String(rowId)); setSelectedTableIds(prev => prev.filter(id => id !== rowId)); setTableRefreshTrigger(prev => prev + 1); };
  const handleTableDeleteMultiple = async () => { await deleteMultipleEmployees(selectedTableIds.map(String)); setSelectedTableIds([]); setTableRefreshTrigger(prev => prev + 1); };
  const handleTableAddRow = async (e: React.FormEvent) => { e.preventDefault(); await addEmployee({ name: newEmpName, email: newEmpEmail, role: newEmpRole, status: newEmpStatus, salary: Number(newEmpSalary), joinedDate: newEmpJoinedDate }); setNewEmpName(''); setNewEmpEmail(''); setShowAddModal(false); setTableRefreshTrigger(prev => prev + 1); };

  const exportTableToCSV = () => {
    const fullData = getFullLocalDatabase();
    const filtered = fullData.filter(item => (!tableSearch || item.name.toLowerCase().includes(tableSearch.toLowerCase()) || item.email.toLowerCase().includes(tableSearch.toLowerCase())) && (tableStatus === 'All' || item.status === tableStatus) && (tableRole === 'All' || item.role === tableRole));
    const csv = "data:text/csv;charset=utf-8," + ['ID,Nome,Email,Cargo,Departamento,Status,Salario,Data de Admissao', ...filtered.map(item => [item.id, `"${item.name}"`, item.email, `"${item.role}"`, `"${item.department}"`, item.status, item.salary, item.joinedDate].join(','))].join('\n');
    const link = document.createElement('a'); link.href = encodeURI(csv); link.download = `funcionarios_${new Date().toISOString().split('T')[0]}.csv`; link.click();
  };

  return (
    <section>
      <h2 className="section-title"><span>📊</span> Data Table Dinâmica</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className={`mode-btn ${tableSubTab === 'standard' ? 'active' : ''}`} onClick={() => setTableSubTab('standard')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: tableSubTab === 'standard' ? 'var(--ctp-surface0)' : 'transparent', color: 'var(--ctp-text)' }}>Standard Table</button>
        <button className={`mode-btn ${tableSubTab === 'tree' ? 'active' : ''}`} onClick={() => setTableSubTab('tree')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: tableSubTab === 'tree' ? 'var(--ctp-surface0)' : 'transparent', color: 'var(--ctp-text)' }}>Tree Table</button>
      </div>

      {tableSubTab === 'standard' ? (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px 12px 0 0' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="mode-selector">
                <button className={`mode-btn ${tableMode === 'client' ? 'active' : ''}`} onClick={() => setTableMode('client')}>Client</button>
                <button className={`mode-btn ${tableMode === 'server' ? 'active' : ''}`} onClick={() => setTableMode('server')}>Server Mock</button>
              </div>
              <Select value={tableColor} onChange={(e) => setTableColor(e.target.value as any)} size="sm" style={{ minWidth: '120px' }}>
                <option value="mauve">Mauve</option><option value="blue">Blue</option><option value="green">Green</option><option value="red">Red</option>
              </Select>
              <Select value={tableSize} onChange={(e) => setTableSize(e.target.value as any)} size="sm" style={{ minWidth: '130px' }}>
                <option value="sm">Pequeno (sm)</option><option value="md">Médio (md)</option><option value="lg">Grande (lg)</option>
              </Select>
              <Button type="button" variant="tonal" color={tableColor} size="sm" leftIcon={<EyeIcon size={14} />} onClick={() => setShowColumnDropdown(!showColumnDropdown)} style={{ position: 'relative' }}>
                Colunas
                {showColumnDropdown && (
                  <div className="popover-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 50 }}>
                    <div className="popover-header">Exibir Colunas</div>
                    {Object.keys(visibleColumns).map(colKey => (
                      <label key={colKey} className="column-checkbox-label" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={visibleColumns[colKey]} onChange={(e) => setVisibleColumns({ ...visibleColumns, [colKey]: e.target.checked })} />
                        {colKey === 'id' ? 'ID' : colKey === 'name' ? 'Nome' : colKey === 'email' ? 'E-mail' : colKey === 'role' ? 'Cargo' : colKey === 'department' ? 'Departamento' : colKey === 'status' ? 'Status' : colKey === 'salary' ? 'Salário' : 'Admissão'}
                      </label>
                    ))}
                  </div>
                )}
              </Button>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filters-left">
              <div className="search-input-wrapper"><span className="search-icon"><SearchIcon size={14} /></span><Input type="text" placeholder="Buscar funcionário..." className="search-input" value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} size={tableSize} color={tableColor} /></div>
              <Select value={tableStatus} onChange={(e) => setTableStatus(e.target.value)} size={tableSize} color={tableColor} style={{ width: '160px' }}><option value="All">Todos os Status</option><option value="Active">Ativos</option><option value="Inactive">Inativos</option><option value="Pending">Pendentes</option></Select>
              <Select value={tableRole} onChange={(e) => setTableRole(e.target.value)} size={tableSize} color={tableColor} style={{ width: '160px' }}><option value="All">Todos os Cargos</option>{getFilterMetadata().roles.map(r => <option key={r} value={r}>{r}</option>)}</Select>
            </div>
            <div className="filters-right">
              <Button type="button" variant="tonal" color={tableColor} size={tableSize} leftIcon={<DownloadIcon size={14} />} onClick={exportTableToCSV}>Exportar CSV</Button>
              <Button type="button" variant="filled" color={tableColor} size={tableSize} leftIcon={<PlusIcon size={14} />} onClick={() => setShowAddModal(true)}>Novo Funcionário</Button>
            </div>
          </div>

          {selectedTableIds.length > 0 && (
            <div className="bulk-actions-inline">
              <div className="bulk-actions-inline-left"><span>{selectedTableIds.length} selecionados</span></div>
              <div className="bulk-actions-inline-right">
                <button type="button" className="bulk-actions-btn bulk-actions-btn--danger" onClick={handleTableDeleteMultiple} title="Excluir"><TrashIcon size={14} /></button>
                <button type="button" className="bulk-actions-btn" onClick={() => setSelectedTableIds([])} title="Cancelar">✕</button>
              </div>
            </div>
          )}

          <div className="table-wrapper">
            <Table<Employee> data={tableData} columns={([{ key: 'id', header: 'ID', sortable: true }, { key: 'name', header: 'Nome', sortable: true }, { key: 'email', header: 'E-mail', sortable: true }, { key: 'role', header: 'Cargo', sortable: true, editable: true }, { key: 'department', header: 'Departamento' }, { key: 'status', header: 'Status', sortable: true, render: (_: Employee, value: any) => <span className={`table-badge table-badge--${(value as string).toLowerCase()}`}><span className="badge-dot" />{value === 'Active' ? 'Ativo' : value === 'Inactive' ? 'Inativo' : 'Pendente'}</span> }, { key: 'salary', header: 'Salário', sortable: true, editable: true, align: 'right' as const, render: (_: Employee, value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value)) }, { key: 'joinedDate', header: 'Admissão', sortable: true, render: (_: Employee, value: any) => String(value).split('-').reverse().join('/') }, { key: 'actions', header: 'Ações', align: 'center' as const, render: (row: Employee) => <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}><button type="button" className="table-action-btn" onClick={() => {}}><EditIcon size={14} /></button><button type="button" className="table-action-btn table-action-btn--danger" onClick={() => handleTableDeleteRow(row.id)}><TrashIcon size={14} /></button></div> }] as Column<Employee>[]).filter(col => col.key === 'actions' || visibleColumns[col.key])} rowKey={(row) => row.id} sortField={tableSortField} sortOrder={tableSortOrder} onSort={handleTableSort} selectedRowIds={selectedTableIds} onSelectionChange={setSelectedTableIds} onCellEdit={handleTableCellEdit} isLoading={tableIsLoading} size={tableSize} color={tableColor} emptyState="Nenhum funcionário encontrado." />
          </div>

          <div className="pagination-bar" style={{ borderTop: '1px solid var(--ctp-surface2)' }}>
            <div className="pagination-left">
              <PageSizeSelector pageSize={tableLimit} onPageSizeChange={setTableLimit} size={tableSize} color={tableColor} />
              <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>Total: <strong>{tableTotalItems}</strong></span>
            </div>
            <Pagination currentPage={tablePage} totalPages={tableTotalPages} onPageChange={setTablePage} size={tableSize} color={tableColor} showFirstLast showPrevNext />
          </div>
        </div>
      ) : (
        <>
          <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Button type="button" variant="tonal" color={treeColor} size="sm" onClick={() => { const allIds: (string | number)[] = []; const addIds = (nodes: FileNode[]) => { nodes.forEach(node => { if (node.children) { allIds.push(node.id); addIds(node.children); } }); }; addIds(initialFilesData); setTreeExpandedIds(allIds); }}>📂 Expandir Tudo</Button>
                <Button type="button" variant="ghost" color={treeColor} size="sm" onClick={() => setTreeExpandedIds([])}>📁 Colapsar Tudo</Button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}><input type="checkbox" checked={treeCascade} onChange={(e) => setTreeCascade(e.target.checked)} />Seleção em Cascata</label>
                <Select value={treeColor} onChange={(e) => setTreeColor(e.target.value as any)} size="sm"><option value="mauve">Mauve</option><option value="blue">Blue</option><option value="green">Green</option></Select>
                <Select value={treeSize} onChange={(e) => setTreeSize(e.target.value as any)} size="sm"><option value="sm">Pequeno</option><option value="md">Médio</option><option value="lg">Grande</option></Select>
              </div>
            </div>
          </div>
          <div className="glass-panel">
            <div className="filter-bar" style={{ borderBottom: '1px solid var(--ctp-surface0)' }}><div className="search-input-wrapper" style={{ width: '100%', maxWidth: '400px' }}><span className="search-icon"><SearchIcon size={14} /></span><Input type="text" placeholder="Buscar pasta ou arquivo..." value={treeSearch} onChange={(e) => setTreeSearch(e.target.value)} size={treeSize} color={treeColor} /></div></div>
            <div style={{ padding: '1rem' }}>
              <TreeTable<FileNode> data={initialFilesData} columns={treeColumns} rowKey={(row) => row.id} childrenKey="children" sortField={treeSortField} sortOrder={treeSortOrder} onSort={(field, order) => { setTreeSortField(field); setTreeSortOrder(order); }} expandedRowIds={treeExpandedIds} onExpandedRowsChange={setTreeExpandedIds} selectedRowIds={treeSelectedIds} onSelectionChange={setTreeSelectedIds} cascadeSelection={treeCascade} size={treeSize} color={treeColor} globalFilter={treeSearch} globalFilterFields={['name', 'type', 'size']} />
            </div>
          </div>
        </>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" title="Cadastrar Novo Funcionário" footer={<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setShowAddModal(false)}>Cancelar</Button><Button variant="filled" color="green" onClick={handleTableAddRow}>Cadastrar</Button></div>}>
        <form onSubmit={handleTableAddRow} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <FormGroup label="Nome Completo" required><Input type="text" placeholder="Ex: Ana Maria Silva" value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)} required /></FormGroup>
          <FormGroup label="E-mail" required><Input type="email" placeholder="Ex: ana.silva@empresa.com" value={newEmpEmail} onChange={(e) => setNewEmpEmail(e.target.value)} required /></FormGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup label="Cargo"><Select value={newEmpRole} onChange={(e) => setNewEmpRole(e.target.value)}>{getFilterMetadata().roles.map(r => <option key={r} value={r}>{r}</option>)}</Select></FormGroup>
            <FormGroup label="Status"><Select value={newEmpStatus} onChange={(e) => setNewEmpStatus(e.target.value as any)}><option value="Active">Ativo</option><option value="Inactive">Inativo</option><option value="Pending">Pendente</option></Select></FormGroup>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup label="Salário Mensal (R$)"><Input type="number" min="1000" placeholder="Ex: 5000" value={newEmpSalary} onChange={(e) => setNewEmpSalary(e.target.value)} /></FormGroup>
            <FormGroup label="Data de Admissão"><Input type="date" value={newEmpJoinedDate} onChange={(e) => setNewEmpJoinedDate(e.target.value)} /></FormGroup>
          </div>
        </form>
      </Modal>
    </section>
  );
}
