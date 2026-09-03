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

function tableCells(line: string) {
  const escapedPipe = '\uE000';
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .replace(/\\\|/g, escapedPipe)
    .split('|')
    .map((cell) => cell.replaceAll(escapedPipe, '|').trim());
}

function isTableDivider(line: string) {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function tableAlignment(divider: string) {
  return tableCells(divider).map((cell) => {
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
    if (cell.endsWith(':')) return 'right';
    return 'left';
  });
}

export function OriginalMarkdown({ content, resolveLink, resolveImage }: OriginalMarkdownProps) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const nextLine = lines[index + 1]?.trim() ?? '';

    if (line.startsWith('|') && nextLine.startsWith('|') && isTableDivider(nextLine)) {
      const headers = tableCells(line);
      const alignments = tableAlignment(nextLine);
      const rows: string[][] = [];
      let rowIndex = index + 2;
      while (rowIndex < lines.length && lines[rowIndex].trim().startsWith('|')) {
        rows.push(tableCells(lines[rowIndex]));
        rowIndex += 1;
      }

      blocks.push(
        <div className="source-table-wrap" key={`table-${index}`}>
          <table className="source-table">
            <thead>
              <tr>
                {headers.map((cell, cellIndex) => (
                  <th className={`source-table__${alignments[cellIndex] ?? 'left'}`} key={cellIndex} scope="col">
                    {renderInline(cell, resolveLink)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, bodyRowIndex) => (
                <tr key={bodyRowIndex}>
                  {headers.map((_, cellIndex) => (
                    <td className={`source-table__${alignments[cellIndex] ?? 'left'}`} key={cellIndex}>
                      {renderInline(row[cellIndex] ?? '', resolveLink)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      index = rowIndex - 1;
      continue;
    }

    if (!line || line === '---') {
      blocks.push(<div className="source-space" key={index} aria-hidden="true" />);
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const source = resolveImage?.(image[2]);
      if (source) blocks.push(<img alt={image[1]} className="source-image" key={index} src={source} />);
      continue;
    }

    if (line.startsWith('#### ')) blocks.push(<h5 key={index}>{renderInline(line.slice(5), resolveLink)}</h5>);
    else if (line.startsWith('### ')) blocks.push(<h4 key={index}>{renderInline(line.slice(4), resolveLink)}</h4>);
    else if (line.startsWith('## ')) blocks.push(<h3 key={index}>{renderInline(line.slice(3), resolveLink)}</h3>);
    else if (line.startsWith('# ')) blocks.push(<h2 key={index}>{renderInline(line.slice(2), resolveLink)}</h2>);
    else if (line.startsWith('> ')) blocks.push(<blockquote key={index}>{renderInline(line.slice(2), resolveLink)}</blockquote>);
    else if (/^【(?:问题|结论|背景|思路)/.test(line)) {
      blocks.push(<p className="source-callout" key={index}>{renderInline(line, resolveLink)}</p>);
    } else if (/^[-*]\s+/.test(line)) {
      blocks.push(<p className="source-list-item" key={index}><span aria-hidden="true" />{renderInline(line.replace(/^[-*]\s+/, ''), resolveLink)}</p>);
    } else if (/^\d+[.、]\s*/.test(line)) {
      blocks.push(<p className="source-number-item" key={index}>{renderInline(line, resolveLink)}</p>);
    } else {
      blocks.push(<p key={index}>{renderInline(line, resolveLink)}</p>);
    }
  }

  return (
    <div className="original-markdown">
      {blocks}
    </div>
  );
}
