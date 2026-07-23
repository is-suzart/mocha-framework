import { useState, useEffect } from "react";
import { Pagination, PageSizeSelector } from '@mocha-ds/react';
import type { FormControlColor, FormControlSize, FormControlShape } from '@mocha-ds/react';
import { mockPorts } from '../data/demoData';

export default function PaginationPage() {
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationLimit, setPaginationLimit] = useState(5);
  const [paginationColor, setPaginationColor] = useState<FormControlColor>('mauve');
  const [paginationSize, setPaginationSize] = useState<FormControlSize>('md');
  const [paginationShape, setPaginationShape] = useState<FormControlShape>('rounded');
  const [paginationShowFirstLast, setPaginationShowFirstLast] = useState(true);
  const [paginationShowPrevNext, setPaginationShowPrevNext] = useState(true);
  const [paginationSiblingCount] = useState(1);
  const [paginationShowPageInput, setPaginationShowPageInput] = useState(true);

  useEffect(() => {
    const totalPages = Math.ceil(mockPorts.length / paginationLimit);
    if (paginationPage > totalPages) setPaginationPage(Math.max(totalPages, 1));
  }, [paginationLimit, paginationPage]);

  const totalPages = Math.ceil(mockPorts.length / paginationLimit);
  const paginatedData = mockPorts.slice((paginationPage - 1) * paginationLimit, paginationPage * paginationLimit);

  return (
    <section>
      <h2 className="section-title"><span>📄</span> Pagination & Page Size</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Pagination Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="pagination-limit">Items per Page</label>
              <select id="pagination-limit" value={paginationLimit} onChange={(e) => { setPaginationLimit(Number(e.target.value)); setPaginationPage(1); }}>
                <option value={3}>3 items</option>
                <option value={5}>5 items</option>
                <option value={8}>8 items</option>
                <option value={10}>10 items</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="pagination-color-select">Accent Color</label>
              <select id="pagination-color-select" value={paginationColor} onChange={(e) => setPaginationColor(e.target.value as FormControlColor)}>
                <option value="mauve">Mauve</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="pagination-size-select">Controls Size</label>
              <select id="pagination-size-select" value={paginationSize} onChange={(e) => setPaginationSize(e.target.value as FormControlSize)}>
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="pagination-shape-select">Controls Shape</label>
              <select id="pagination-shape-select" value={paginationShape} onChange={(e) => setPaginationShape(e.target.value as FormControlShape)}>
                <option value="square">Square</option>
                <option value="rounded">Rounded</option>
                <option value="pill">Pill</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="checkbox-label"><input type="checkbox" checked={paginationShowFirstLast} onChange={(e) => setPaginationShowFirstLast(e.target.checked)} />Show First/Last Buttons</label>
            <label className="checkbox-label"><input type="checkbox" checked={paginationShowPrevNext} onChange={(e) => setPaginationShowPrevNext(e.target.checked)} />Show Previous/Next Buttons</label>
            <label className="checkbox-label"><input type="checkbox" checked={paginationShowPageInput} onChange={(e) => setPaginationShowPageInput(e.target.checked)} />Show Page Number Input</label>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Portfolio Database (Paginated)</h3>
          <div className="preview-canvas" style={{ padding: '1.5rem', minHeight: '240px', alignItems: 'stretch', flexDirection: 'column', gap: '0.75rem', justifyContent: 'flex-start' }}>
            {paginatedData.map((port, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '8px', border: '1px solid var(--ctp-surface1)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ctp-text)' }}>{port.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>{port.category} • by {port.developer}</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>⭐ {port.stars}</span>
              </div>
            ))}
            {paginatedData.length === 0 && <p style={{ color: 'var(--ctp-subtext0)', textAlign: 'center' }}>No items to display</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <PageSizeSelector pageSize={paginationLimit} onPageSizeChange={setPaginationLimit} size={paginationSize} color={paginationColor} shape={paginationShape} />
            <Pagination currentPage={paginationPage} totalPages={totalPages} onPageChange={setPaginationPage} size={paginationSize} color={paginationColor} shape={paginationShape} siblingCount={paginationSiblingCount} showFirstLast={paginationShowFirstLast} showPrevNext={paginationShowPrevNext} showPageInput={paginationShowPageInput} />
          </div>
        </div>
      </div>
    </section>
  );
}
