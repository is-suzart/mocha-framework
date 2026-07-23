import { useState } from "react";
import { Steps, StepsSlider, Button } from '@mocha-ds/react';
import type { StepsVariant, StepsColor } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function StepsPage() {
  const [stepsCount, setStepsCount] = useState(4);
  const [stepsCurrent, setStepsCurrent] = useState(0);
  const [stepsVariant, setStepsVariant] = useState<StepsVariant>('timeline');
  const [stepsColor, setStepsColor] = useState<StepsColor>('mauve');
  const [stepsOrientation, setStepsOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardFlavor, setWizardFlavor] = useState('macchiato');
  const [wizardShippingName, setWizardShippingName] = useState('');
  const [wizardShippingAddress, setWizardShippingAddress] = useState('');
  const [wizardShippingCity, setWizardShippingCity] = useState('');
  const wizardLabels = ['Flavor Selection', 'Delivery Details', 'Receipt Summary'];
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const isWizardNextDisabled = () => wizardStep === 1 ? (!wizardShippingName.trim() || !wizardShippingAddress.trim() || !wizardShippingCity.trim()) : false;

  const resetWizard = () => { setWizardStep(0); setWizardFlavor('macchiato'); setWizardShippingName(''); setWizardShippingAddress(''); setWizardShippingCity(''); };

  const getReactStepsCode = () => {
    const props = [`stepsCount={${stepsCount}}`, `currentStep={${stepsCurrent}}`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;Steps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueStepsCode = () => {
    const props = [`:steps-count="${stepsCount}"`, `:current-step="${stepsCurrent}"`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;CtpSteps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularStepsCode = () => {
    const props = [`[stepsCount]="${stepsCount}"`, `[currentStep]="${stepsCurrent}"`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;steps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;&lt;/steps&gt;</span>`;
  };

  const getRawTextCode = () => {
    const code = activeTab === 'react' ? getReactStepsCode() : activeTab === 'vue' ? getVueStepsCode() : getAngularStepsCode();
    return code.replace(/<[^>]*>/g, '');
  };

  return (
    <section>
      <h2 className="section-title"><span>📈</span> Steps & Slider Component</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Steps Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="steps-count-select">Steps Count</label>
              <select id="steps-count-select" value={stepsCount} onChange={(e) => { setStepsCount(Number(e.target.value)); setStepsCurrent(0); }}>
                <option value={2}>2 Steps</option>
                <option value={3}>3 Steps</option>
                <option value={4}>4 Steps</option>
                <option value={5}>5 Steps</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="steps-variant-select">Variant</label>
              <select id="steps-variant-select" value={stepsVariant} onChange={(e) => setStepsVariant(e.target.value as StepsVariant)}>
                <option value="default">Default</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="steps-color-select">Color Accent</label>
              <select id="steps-color-select" value={stepsColor} onChange={(e) => setStepsColor(e.target.value as StepsColor)}>
                <option value="mauve">Mauve</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="peach">Peach</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="steps-orient-select">Orientation</label>
              <select id="steps-orient-select" value={stepsOrientation} onChange={(e) => setStepsOrientation(e.target.value as any)}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="steps-current-slider">Current Step: {stepsCurrent}</label>
              <input id="steps-current-slider" type="range" min="0" max={stepsCount - 1} value={stepsCurrent} onChange={(e) => setStepsCurrent(Number(e.target.value))} style={{ cursor: 'pointer', accentColor: `var(--ctp-${stepsColor})` }} />
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '180px' }}>
            <Steps stepsCount={stepsCount} currentStep={stepsCurrent} variant={stepsVariant} color={stepsColor} orientation={stepsOrientation} />
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => copyToClipboard(getRawTextCode())}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactStepsCode() : activeTab === 'vue' ? getVueStepsCode() : getAngularStepsCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ margin: '0 0 1.2rem 0' }}>✨ High-Fidelity Checkout Wizard & Slide Transition Showcase ✨</h3>
        <div style={{ background: 'var(--ctp-mantle)', borderRadius: '16px', border: '1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent)', maxWidth: '620px', margin: '0 auto', overflow: 'hidden', boxShadow: 'var(--ctp-shadow-lg)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--ctp-surface0)', backgroundColor: 'var(--ctp-crust)' }}>
            <Steps currentStep={wizardStep} stepsCount={3} variant="timeline" color={stepsColor} labels={wizardLabels} onChangeStep={setWizardStep} />
          </div>
          <div style={{ padding: '2rem', minHeight: '260px' }}>
            <StepsSlider currentStep={wizardStep}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ margin: 0 }}>Step 1: Choose Your Flavor</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>Select which cozy Catppuccin flavor theme is deployed onto your dashboard framework.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  {(['mocha', 'macchiato', 'frappe', 'latte'] as const).map(fl => (
                    <div key={fl} onClick={() => setWizardFlavor(fl)} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--ctp-crust)', border: `2px solid ${wizardFlavor === fl ? `var(--ctp-${stepsColor})` : 'transparent'}`, cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', transition: 'var(--ctp-transition)' }}>{fl.charAt(0).toUpperCase() + fl.slice(1)}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0 }}>Step 2: Shipping & Delivery Destinations</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>Fill in shipping address attributes to complete standard order transmission.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  <div className="control-group"><label style={{ fontSize: '0.78rem' }}>Recipient Name</label><input type="text" value={wizardShippingName} onChange={(e) => setWizardShippingName(e.target.value)} placeholder="e.g. John Doe" style={{ padding: '8px', fontSize: '0.85rem' }} /></div>
                  <div className="control-group"><label style={{ fontSize: '0.78rem' }}>Street Address</label><input type="text" value={wizardShippingAddress} onChange={(e) => setWizardShippingAddress(e.target.value)} placeholder="e.g. 123 Cozy Avenue" style={{ padding: '8px', fontSize: '0.85rem' }} /></div>
                  <div className="control-group"><label style={{ fontSize: '0.78rem' }}>City / Region</label><input type="text" value={wizardShippingCity} onChange={(e) => setWizardShippingCity(e.target.value)} placeholder="e.g. San Francisco" style={{ padding: '8px', fontSize: '0.85rem' }} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--ctp-green) 12%, transparent)', color: 'var(--ctp-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>✓</div>
                <h4 style={{ margin: 0, color: 'var(--ctp-green)' }}>Order Transmitted Successfully!</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: 1.5 }}>Thank you for choosing Catppuccin!</p>
                <div style={{ backgroundColor: 'var(--ctp-crust)', width: '100%', borderRadius: '8px', padding: '12px', border: '1px solid var(--ctp-surface0)', fontSize: '0.82rem', textAlign: 'left', marginTop: '8px' }}>
                  <div><strong>Flavor selected:</strong> {wizardFlavor}</div>
                  <div><strong>Deliver to:</strong> {wizardShippingName}</div>
                  <div><strong>Address:</strong> {wizardShippingAddress}, {wizardShippingCity}</div>
                </div>
              </div>
            </StepsSlider>
          </div>
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--ctp-surface0)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--ctp-crust)', gap: '12px' }}>
            {wizardStep < 2 ? (
              <>
                <Button variant="outline" disabled={wizardStep === 0} onClick={() => setWizardStep(s => Math.max(0, s - 1))}>Back</Button>
                <Button variant="filled" color={stepsColor} disabled={isWizardNextDisabled()} onClick={() => setWizardStep(s => Math.min(2, s + 1))}>{wizardStep === 1 ? 'Place Order' : 'Next Step'}</Button>
              </>
            ) : (
              <Button variant="tonal" color={stepsColor} onClick={resetWizard} style={{ width: '100%' }}>Restart Checkout Wizard</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
