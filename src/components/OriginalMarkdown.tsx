import type { ReactNode } from 'react';

type OriginalMarkdownProps = {
  content: string;
  resolveLink?: (href: string) => string;
  resolveImage?: (href: string) => string | undefined;
};

function sanitizeVisibleCopy(text: string) {
  return text
    .replace(/\bAIPM-Wiki\b/g, '本站')
    .replace(/本仓库/g, '本站');
}

function renderInline(text: string, resolveLink?: (href: string) => string): ReactNode[] {
  const parts = sanitizeVisibleCopy(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <mark className="source-keyword" key={`${part}-${index}`}>{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, rawHref] = link;
      const href = resolveLink?.(rawHref) ?? rawHref;
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} key={`${href}-${index}`} rel={external ? 'noreferrer' : undefined} target={external ? '_blank' : undefined}>
          {label}
        </a>
      );
    }
    return part;
  });
}

export function OriginalMarkdown({ content, resolveLink, resolveImage }: OriginalMarkdownProps) {
  return (
    <div className="original-markdown">
      {content.split('\n').map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line || line === '---') return <div className="source-space" key={index} aria-hidden="true" />;
        const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (image) {
          const source = resolveImage?.(image[2]);
          return source ? <img alt={image[1]} className="source-image" key={index} src={source} /> : null;
        }
        if (line.startsWith('#### ')) return <h5 key={index}>{renderInline(line.slice(5), resolveLink)}</h5>;
        if (line.startsWith('### ')) return <h4 key={index}>{renderInline(line.slice(4), resolveLink)}</h4>;
        if (line.startsWith('## ')) return <h3 key={index}>{renderInline(line.slice(3), resolveLink)}</h3>;
        if (line.startsWith('# ')) return <h2 key={index}>{renderInline(line.slice(2), resolveLink)}</h2>;
        if (line.startsWith('> ')) return <blockquote key={index}>{renderInline(line.slice(2), resolveLink)}</blockquote>;
        if (/^【(?:问题|结论|背景|思路)/.test(line)) {
          return <p className="source-callout" key={index}>{renderInline(line, resolveLink)}</p>;
        }
        if (/^[-*]\s+/.test(line)) {
          return <p className="source-list-item" key={index}><span aria-hidden="true" />{renderInline(line.replace(/^[-*]\s+/, ''), resolveLink)}</p>;
        }
        if (/^\d+[.、]\s*/.test(line)) {
          return <p className="source-number-item" key={index}>{renderInline(line, resolveLink)}</p>;
        }
        if (line.startsWith('|')) return <p className="source-table-row" key={index}>{renderInline(line, resolveLink)}</p>;
        return <p key={index}>{renderInline(line, resolveLink)}</p>;
      })}
    </div>
  );
}
