import { useState } from "react";
import { Modal, Overlay, Button } from '@mocha-ds/react';

export default function ModalPage() {
  const [isOpenSm, setIsOpenSm] = useState(false);
  const [isOpenMd, setIsOpenMd] = useState(false);
  const [isOpenLg, setIsOpenLg] = useState(false);
  const [isOpenNested1, setIsOpenNested1] = useState(false);
  const [isOpenNested2, setIsOpenNested2] = useState(false);
  const [isOpenNested3, setIsOpenNested3] = useState(false);
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Workspace Settings');
  const [modalHasCloseButton, setModalHasCloseButton] = useState(true);
  const [modalCloseOnEsc, setModalCloseOnEsc] = useState(true);
  const [modalCloseOnOverlay, setModalCloseOnOverlay] = useState(true);
  const [modalHasFooter, setModalHasFooter] = useState(true);

  const openStack: { name: string; size: string }[] = [];
  if (isOpenSm) openStack.push({ name: 'Small Modal', size: 'sm' });
  if (isOpenMd) openStack.push({ name: 'Medium Modal', size: 'md' });
  if (isOpenLg) openStack.push({ name: 'Large Modal', size: 'lg' });
  if (isOpenNested1) openStack.push({ name: 'Layer 1 Modal', size: 'lg' });
  if (isOpenNested2) openStack.push({ name: 'Layer 2 Modal', size: 'md' });
  if (isOpenNested3) openStack.push({ name: 'Layer 3 Modal', size: 'sm' });

  return (
    <section>
      <h2 className="section-title"><span>📦</span> Overlays & Modals Stacking</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Overlay Control Board</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Button variant="filled" color="blue" onClick={() => setIsOpenSm(true)}>Open Small Modal</Button>
            <Button variant="filled" color="mauve" onClick={() => setIsOpenMd(true)}>Open Medium Modal</Button>
            <Button variant="filled" color="lavender" onClick={() => setIsOpenLg(true)}>Open Large Modal</Button>
            <Button variant="tonal" color="pink" onClick={() => setCustomOverlayOpen(true)}>Open Custom Overlay</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--ctp-surface0)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Multi-level Modals Stacking</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
              Open nested overlays to observe z-index stacking. Each subsequent overlay increments its z-index relative to the parent.
            </p>
            <Button variant="filled" color="red" onClick={() => setIsOpenNested1(true)}>Launch Nesting Sequence</Button>
          </div>
          <div className="stacking-visualizer">
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Active Overlay Stack Visualizer</h3>
            {openStack.length === 0 ? (
              <p style={{ color: 'var(--ctp-subtext0)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>No active overlays open.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
                {openStack.map((item, index) => (
                  <div key={item.name} className="stack-item-indicator" style={{ backgroundColor: 'var(--ctp-surface0)', borderColor: 'var(--ctp-mauve)', color: 'var(--ctp-text)', borderLeftWidth: '4px', borderLeftStyle: 'solid' }}>
                    <span>{item.name} ({item.size})</span>
                    <span className="badge-zindex">z-index: {1001 + index}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Modal Attribute Customizer</h3>
          <div className="control-group">
            <label htmlFor="modal-title-input">Header Title Text</label>
            <input id="modal-title-input" type="text" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <label className="checkbox-label"><input type="checkbox" checked={modalHasCloseButton} onChange={(e) => setModalHasCloseButton(e.target.checked)} />Show Close Button in Header</label>
            <label className="checkbox-label"><input type="checkbox" checked={modalCloseOnOverlay} onChange={(e) => setModalCloseOnOverlay(e.target.checked)} />Dismiss on Backdrop / Overlay Click</label>
            <label className="checkbox-label"><input type="checkbox" checked={modalCloseOnEsc} onChange={(e) => setModalCloseOnEsc(e.target.checked)} />Dismiss on ESC Key Press</label>
            <label className="checkbox-label"><input type="checkbox" checked={modalHasFooter} onChange={(e) => setModalHasFooter(e.target.checked)} />Include Standard Action Footer</label>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpenSm} onClose={() => setIsOpenSm(false)} size="sm" title={modalTitle || undefined} showCloseButton={modalHasCloseButton} closeOnOverlayClick={modalCloseOnOverlay} closeOnEsc={modalCloseOnEsc} footer={modalHasFooter ? (<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenSm(false)}>Cancel</Button><Button variant="filled" color="mauve" onClick={() => setIsOpenSm(false)}>Save Changes</Button></div>) : undefined}>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>This is a <strong>Small (sm)</strong> Catppuccin modal.</p>
      </Modal>

      <Modal isOpen={isOpenMd} onClose={() => setIsOpenMd(false)} size="md" title={modalTitle || undefined} showCloseButton={modalHasCloseButton} closeOnOverlayClick={modalCloseOnOverlay} closeOnEsc={modalCloseOnEsc} footer={modalHasFooter ? (<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenMd(false)}>Cancel</Button><Button variant="filled" color="mauve" onClick={() => setIsOpenMd(false)}>Proceed</Button></div>) : undefined}>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>This is a <strong>Medium (md)</strong> standard modal.</p>
      </Modal>

      <Modal isOpen={isOpenLg} onClose={() => setIsOpenLg(false)} size="lg" title={modalTitle || undefined} showCloseButton={modalHasCloseButton} closeOnOverlayClick={modalCloseOnOverlay} closeOnEsc={modalCloseOnEsc} footer={modalHasFooter ? (<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenLg(false)}>Close</Button><Button variant="filled" color="mauve" onClick={() => setIsOpenLg(false)}>Save Changes</Button></div>) : undefined}>
        <h4 style={{ margin: '0 0 10px 0' }}>Spacious Canvas</h4>
        <p style={{ margin: '0', fontSize: '0.9rem', lineHeight: '1.5' }}>Large (lg) modals offer a wider viewport.</p>
      </Modal>

      <Modal isOpen={isOpenNested1} onClose={() => setIsOpenNested1(false)} size="lg" title="Layer 1: Stack Base" footer={<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenNested1(false)}>Close</Button></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>You have initialized the stacking hierarchy. Current overlay count is <strong>1</strong>.</p>
          <Button variant="filled" color="mauve" onClick={() => setIsOpenNested2(true)}>Push Layer 2 Modal</Button>
        </div>
      </Modal>

      <Modal isOpen={isOpenNested2} onClose={() => setIsOpenNested2(false)} size="md" title="Layer 2: Second Story" footer={<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenNested2(false)}>Go Back</Button><Button variant="filled" color="red" onClick={() => { setIsOpenNested2(false); setIsOpenNested1(false); }}>Close All</Button></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>This overlay rests directly above Layer 1.</p>
          <Button variant="filled" color="blue" onClick={() => setIsOpenNested3(true)}>Push Layer 3 Modal</Button>
        </div>
      </Modal>

      <Modal isOpen={isOpenNested3} onClose={() => setIsOpenNested3(false)} size="sm" title="Layer 3: Top Pinnacle" footer={<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}><Button variant="ghost" color="lavender" onClick={() => setIsOpenNested3(false)}>Close Layer 3</Button><Button variant="filled" color="red" onClick={() => { setIsOpenNested3(false); setIsOpenNested2(false); setIsOpenNested1(false); }}>Close All</Button></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>You have reached the maximum nest level in this demonstration!</p>
        </div>
      </Modal>

      <Overlay isOpen={customOverlayOpen} onClose={() => setCustomOverlayOpen(false)}>
        <div className="custom-overlay-card">
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--ctp-pink)' }}>✨ Raw Custom Overlay ✨</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--ctp-subtext1)' }}>This card is rendered directly within the raw <code>Overlay</code> portal.</p>
          <Button variant="filled" color="pink" onClick={() => setCustomOverlayOpen(false)}>Dismiss Overlay</Button>
        </div>
      </Overlay>
    </section>
  );
}
