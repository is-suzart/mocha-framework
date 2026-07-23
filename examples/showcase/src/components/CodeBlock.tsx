import React, { useState } from 'react';
import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const plainText = code.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container">
      <button className="code-copy-btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
      <pre className="code-block">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  );
}

export function RawCodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = document.querySelector('.code-block') as HTMLElement | null;
    if (el) {
      navigator.clipboard.writeText(el.textContent || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-container">
      <button className="code-copy-btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
      <pre className="code-block">
        <code>{children}</code>
      </pre>
    </div>
  );
}
