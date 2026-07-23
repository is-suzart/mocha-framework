import { useState, useEffect, useRef } from "react";
import { Stepper, Button } from '@mocha-ds/react';
import type { StepperOrientation, StepperVariant, ButtonColor } from '@mocha-ds/react';
import { colors } from '../data/colors';
import { demoSteps, stepContents } from '../data/demoData';

export default function StepperPage() {
  const [stepOrientation, setStepOrientation] = useState<StepperOrientation>('horizontal');
  const [stepVariant, setStepVariant] = useState<StepperVariant>('default');
  const [stepColor, setStepColor] = useState<ButtonColor>('mauve');
  const [currentStep, setCurrentStep] = useState(1);
  const prevStepRef = useRef(1);

  useEffect(() => { prevStepRef.current = currentStep; }, [currentStep]);
  const slideClass = currentStep >= prevStepRef.current ? 'stepper-panel--slide-in-right' : 'stepper-panel--slide-in-left';

  return (
    <section>
      <h2 className="section-title"><span>🚥</span> Stepper Playground</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: '0', fontSize: '1.2rem', color: `var(--ctp-${stepColor})` }}>Stepper Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="step-orientation">Orientation</label>
              <select id="step-orientation" value={stepOrientation} onChange={(e) => setStepOrientation(e.target.value as StepperOrientation)}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="step-variant">Node Style</label>
              <select id="step-variant" value={stepVariant} onChange={(e) => setStepVariant(e.target.value as StepperVariant)}>
                <option value="default">Numeric Numbers</option>
                <option value="dots">Minimal Dots</option>
                <option value="icon">Node Icons</option>
                <option value="labeled-icon">Labeled Icons</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="step-color">Active Accent Color</label>
              <select id="step-color" value={stepColor} onChange={(e) => setStepColor(e.target.value as ButtonColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="step-slider">Current Step: {currentStep + 1}</label>
              <input id="step-slider" type="range" min="0" max="3" value={currentStep} onChange={(e) => setCurrentStep(Number(e.target.value))} style={{ cursor: 'pointer', accentColor: `var(--ctp-${stepColor})` }} />
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '340px', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
            <Stepper steps={demoSteps} currentStep={currentStep} orientation={stepOrientation} variant={stepVariant} color={stepColor} />
            <div className="stepper-container" style={{ width: '100%' }}>
              <div key={currentStep} className={`playground-card ${slideClass}`} style={{ margin: 0, minHeight: '120px', justifyContent: 'center', backgroundColor: 'var(--ctp-crust)', borderStyle: 'dashed', padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: `var(--ctp-${stepColor})` }}>{stepContents[currentStep].title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>{stepContents[currentStep].details}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
              <Button variant="outline" color={stepColor} disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} style={{ flex: 1 }}>Back</Button>
              <Button variant="filled" color={stepColor} disabled={currentStep === 3} onClick={() => setCurrentStep(prev => prev + 1)} style={{ flex: 1 }}>Next Step</Button>
            </div>
          </div>
          <div>
            <div className="tabs-header"><button className="tab-btn active">React Code</button></div>
            <div className="code-container">
              <pre className="code-block">
                <code>{`// App.tsx\n<Stepper\n  steps={demoSteps}\n  currentStep={${currentStep}}\n  orientation="${stepOrientation}"\n  variant="${stepVariant}"\n  color="${stepColor}"\n/>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
