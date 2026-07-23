import React from 'react';

interface PlaygroundPageProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  codeSnippets?: { label: string; language: string; code: string }[];
}

export function PlaygroundPage({ title, children, controls }: PlaygroundPageProps) {
  return (
    <div>
      <h2 className="section-title">
        <span>⚡</span> {title}
      </h2>
      <div className="playground-section">
        {controls && (
          <div className="playground-card">
            {controls}
          </div>
        )}
        {children && (
          <div className="playground-card playground-card--preview">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
