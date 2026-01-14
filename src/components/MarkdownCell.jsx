import React from 'react';

export default function MarkdownCell({
  children,
  className,
  style,
  valign,
  width,
  bg,
}) {
  const tdStyle = {
    ...(style || {}),
    ...(valign ? { verticalAlign: valign } : {}),
    ...(width ? { width } : {}),
    ...(bg ? { backgroundColor: bg } : {}),
  };

  return (
    <td className={className} style={tdStyle}>
      {children}
    </td>
  );
}
