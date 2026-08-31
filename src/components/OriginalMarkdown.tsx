import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <mark className="source-keyword" key={`${part}-${index}`}>{part.slice(2, -2)}</mark>;
    }
    return part;
  });
}

export function OriginalMarkdown({ content }: { content: string }) {
  return (
    <div className="original-markdown">
      {content.split('\n').map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line || line === '---') return <div className="source-space" key={index} aria-hidden="true" />;
        if (line.startsWith('#### ')) return <h5 key={index}>{renderInline(line.slice(5))}</h5>;
        if (line.startsWith('### ')) return <h4 key={index}>{renderInline(line.slice(4))}</h4>;
        if (line.startsWith('## ')) return <h3 key={index}>{renderInline(line.slice(3))}</h3>;
        if (line.startsWith('# ')) return <h2 key={index}>{renderInline(line.slice(2))}</h2>;
        if (line.startsWith('> ')) return <blockquote key={index}>{renderInline(line.slice(2))}</blockquote>;
        if (/^【(?:问题|结论|背景|思路)/.test(line)) {
          return <p className="source-callout" key={index}>{renderInline(line)}</p>;
        }
        if (/^[-*]\s+/.test(line)) {
          return <p className="source-list-item" key={index}><span aria-hidden="true" />{renderInline(line.replace(/^[-*]\s+/, ''))}</p>;
        }
        if (/^\d+[.、]\s*/.test(line)) {
          return <p className="source-number-item" key={index}>{renderInline(line)}</p>;
        }
        if (line.startsWith('|')) return <p className="source-table-row" key={index}>{renderInline(line)}</p>;
        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
}
