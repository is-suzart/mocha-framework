import { useState } from "react";
import { DynamicForm, Button } from '@mocha-ds/react';
import type { FieldSchema, ButtonSize, ButtonShape, ButtonColor } from '@mocha-ds/react';
import { initialFormSchema } from '../data/demoData';
import { colors } from '../data/colors';

export default function DynamicFormPage() {
  const [formSchema, setFormSchema] = useState<FieldSchema[]>(initialFormSchema);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<Record<string, any> | null>(null);
  const [formConfigSize, setFormConfigSize] = useState<ButtonSize>('md');
  const [formConfigShape, setFormConfigShape] = useState<ButtonShape>('rounded');
  const [formConfigColor, setFormConfigColor] = useState<ButtonColor>('mauve');
  const [formBuilderTab, setFormBuilderTab] = useState<'builder' | 'json'>('builder');
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialFormSchema, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [newFieldId, setNewFieldId] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldSchema['type']>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldWidth, setNewFieldWidth] = useState<33 | 50 | 100>(100);
  const [newFieldOptionsString, setNewFieldOptionsString] = useState('');

  const handleAddNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldId.trim() || !newFieldLabel.trim()) return;
    if (formSchema.some(f => f.id === newFieldId)) return;
    let parsedOptions: { label: string; value: any }[] | undefined = undefined;
    if ((newFieldType === 'select' || newFieldType === 'radio') && newFieldOptionsString.trim()) {
      parsedOptions = newFieldOptionsString.split(',').map((opt, index) => {
        const parts = opt.split(':');
        return { label: (parts[0]?.trim() || `Option ${index + 1}`), value: (parts[1]?.trim() || parts[0]?.trim().toLowerCase()) };
      });
    }
    const field: FieldSchema = { id: newFieldId.trim(), label: newFieldLabel.trim(), type: newFieldType, placeholder: newFieldPlaceholder.trim() || undefined, required: newFieldRequired, width: newFieldWidth, options: parsedOptions };
    const updatedSchema = [...formSchema, field];
    setFormSchema(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));
    setNewFieldId(''); setNewFieldLabel(''); setNewFieldPlaceholder(''); setNewFieldRequired(false); setNewFieldWidth(100); setNewFieldOptionsString('');
  };

  const handleRemoveField = (id: string) => {
    const updatedSchema = formSchema.filter(f => f.id !== id);
    setFormSchema(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));
  };

  const handleJsonTextChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) { setFormSchema(parsed); setJsonError(null); }
      else setJsonError('Schema JSON must be an array of fields.');
    } catch (e: any) { setJsonError(e.message || 'Invalid JSON syntax'); }
  };

  const handleFormSubmit = (payload: Record<string, any>) => {
    setLastSubmitPayload(payload);
  };

  return (
    <section>
      <h2 className="section-title"><span>⚡</span> Dynamic Forms Component</h2>
      <div className="forms-playground-grid">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Schema Builder</h3>
          <div className="builder-tabs">
            <button className={`builder-tab-btn ${formBuilderTab === 'builder' ? 'active' : ''}`} onClick={() => setFormBuilderTab('builder')}>Interactive Builder</button>
            <button className={`builder-tab-btn ${formBuilderTab === 'json' ? 'active' : ''}`} onClick={() => setFormBuilderTab('json')}>Raw JSON Editor</button>
          </div>
          {formBuilderTab === 'builder' ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {formSchema.map(field => (
                  <div key={field.id} className="field-list-item">
                    <div className="field-list-details">
                      <span className="field-list-name">{field.label}</span>
                      <span className="field-list-meta">ID: {field.id} • Type: {field.type} {field.required ? '• Required' : ''}</span>
                    </div>
                    <Button variant="ghost" color="red" size="sm" onClick={() => handleRemoveField(field.id)}>✕</Button>
                  </div>
                ))}
              </div>
              <div className="builder-card-action">
                <form onSubmit={handleAddNewField} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Add New Field</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="control-group">
                      <label>Field ID</label>
                      <input type="text" value={newFieldId} onChange={(e) => setNewFieldId(e.target.value)} placeholder="e.g. phoneNumber" style={{ padding: '6px' }} />
                    </div>
                    <div className="control-group">
                      <label>Field Label</label>
                      <input type="text" value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} placeholder="e.g. Phone Number" style={{ padding: '6px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <div className="control-group">
                      <label>Type</label>
                      <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value as any)}>
                        <option value="text">Text</option><option value="email">Email</option><option value="number">Number</option>
                        <option value="select">Select</option><option value="radio">Radio</option><option value="switch">Switch</option>
                        <option value="slider">Slider</option><option value="textarea">Textarea</option>
                      </select>
                    </div>
                    <div className="control-group">
                      <label>Width %</label>
                      <select value={newFieldWidth} onChange={(e) => setNewFieldWidth(Number(e.target.value) as any)}>
                        <option value={33}>33%</option><option value={50}>50%</option><option value={100}>100%</option>
                      </select>
                    </div>
                    <div className="control-group">
                      <label>Placeholder</label>
                      <input type="text" value={newFieldPlaceholder} onChange={(e) => setNewFieldPlaceholder(e.target.value)} style={{ padding: '6px' }} />
                    </div>
                  </div>
                  {(newFieldType === 'select' || newFieldType === 'radio') && (
                    <div className="control-group">
                      <label>Options (label:value, ...)</label>
                      <input type="text" value={newFieldOptionsString} onChange={(e) => setNewFieldOptionsString(e.target.value)} placeholder="e.g. Option A:opt-a, Option B:opt-b" style={{ padding: '6px' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label className="checkbox-label"><input type="checkbox" checked={newFieldRequired} onChange={(e) => setNewFieldRequired(e.target.checked)} />Required</label>
                    <Button variant="filled" color="mauve" type="submit" size="sm">Add Field</Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div>
              <textarea className="schema-json-textarea" value={jsonText} onChange={(e) => handleJsonTextChange(e.target.value)} />
              {jsonError && <div className="schema-error-banner">{jsonError}</div>}
            </div>
          )}
        </div>
        <div className="playground-card playground-card--preview" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Form Preview</h3>
          <div style={{ padding: '1rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', minHeight: '180px' }}>
            <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} size={formConfigSize} shape={formConfigShape} color={formConfigColor} />
          </div>
          {lastSubmitPayload && (
            <div className="payload-canvas">
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Last Submit Payload</h4>
              <pre className="code-block" style={{ margin: 0, padding: '10px' }}><code style={{ color: 'var(--ctp-green)' }}>{JSON.stringify(lastSubmitPayload, null, 2)}</code></pre>
            </div>
          )}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--ctp-surface0)', paddingTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Form Style Configuration</h4>
        <div className="control-grid">
          <div className="control-group">
            <label>Color</label>
            <select value={formConfigColor} onChange={(e) => setFormConfigColor(e.target.value as ButtonColor)}>
              {colors.map(c => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Size</label>
            <select value={formConfigSize} onChange={(e) => setFormConfigSize(e.target.value as ButtonSize)}>
              <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
            </select>
          </div>
          <div className="control-group">
            <label>Shape</label>
            <select value={formConfigShape} onChange={(e) => setFormConfigShape(e.target.value as ButtonShape)}>
              <option value="square">Square</option><option value="rounded">Rounded</option><option value="pill">Pill</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
