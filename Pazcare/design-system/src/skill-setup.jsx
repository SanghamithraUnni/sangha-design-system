import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './components.jsx';
import './assignment.css';
import instructions from '../../skills/sangha-ui/README.md?raw';

function inline(text) {
  return text.split(/(\x60[^\x60]+\x60|\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^)]+\))/g).map((part, i) => {
    if (part.startsWith('\x60')) return <code key={i}>{part.slice(1,-1)}</code>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
    return link ? <a key={i} href={link[2]}>{link[1]}</a> : part;
  });
}

function prose(block, key) {
  if (block.startsWith('# ')) return <h1 key={key}>{inline(block.slice(2))}</h1>;
  if (block.startsWith('## ')) return <h2 key={key}>{inline(block.slice(3))}</h2>;
  if (/^(?:- |\d+\. )/.test(block)) {
    const List = block.startsWith('- ') ? 'ul' : 'ol';
    return <List key={key}>{block.split('\n').map((line,i)=><li key={i}>{inline(line.replace(/^(?:- |\d+\. )/,''))}</li>)}</List>;
  }
  return <p key={key}>{inline(block)}</p>;
}

function SkillSetup() {
  return <div className="assignment"><header className="assignment-header"><a href="/">← Assignment home</a></header>
    <main className="skill-document">{instructions.split('\x60\x60\x60').map((part,i)=>i%2
      ? <pre key={i}><code>{part.slice(part.indexOf('\n')+1).trimEnd()}</code></pre>
      : part.trim().split(/\n\s*\n/).filter(Boolean).map((block,j)=>prose(block,`${i}-${j}`)))}</main>
  </div>;
}

createRoot(document.getElementById('root')).render(<SkillSetup />);
