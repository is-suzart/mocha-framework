import { Alert } from '@mocha-ds/react';

export default function AlertPage() {
  return (
    <section>
      <h2 className="section-title"><span>⚠️</span> Alert Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Variants</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Alert variant="info" title="Information">This is an informational alert.</Alert>
            <Alert variant="success" title="Success">Operation completed successfully.</Alert>
            <Alert variant="warning" title="Warning">Please review before proceeding.</Alert>
            <Alert variant="error" title="Error">Something went wrong.</Alert>
          </div>
        </div>
        <div className="playground-card" style={{ marginTop: '16px' }}>
          <h3>Dismissible</h3>
          <Alert variant="info" title="Dismiss me" dismissible>Click the X to dismiss this alert.</Alert>
        </div>
      </div>
    </section>
  );
}
