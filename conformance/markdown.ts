/**
 * Markdown: only raw HTML in it is judged. Front matter, fenced code blocks and
 * inline code are blanked first (line breaks kept, so lines still match), so a
 * code sample about a class or a raw value is never a finding.
 */

const blank = (s: string) => s.replace(/[^\n]/g, ' ');

export function blankMarkdownCode(text: string): string {
  let out = text;

  // Front matter.
  const fm = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(out);
  if (fm) out = blank(fm[0]) + out.slice(fm[0].length);

  // Fenced blocks: ``` or ~~~, three or more, closed by the same character at least as long.
  const lines = out.split('\n');
  let fence: { char: string; size: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]!;
    const m = /^ {0,3}(`{3,}|~{3,})/.exec(l);
    if (fence) {
      if (m && m[1]![0] === fence.char && m[1]!.length >= fence.size && /^ {0,3}[`~]+\s*$/.test(l)) fence = null;
      lines[i] = blank(l);
    } else if (m) {
      fence = { char: m[1]![0]!, size: m[1]!.length };
      lines[i] = blank(l);
    }
  }
  out = lines.join('\n');

  // Inline code: a run of n backticks closed by a run of exactly n.
  let result = '';
  let i = 0;
  while (i < out.length) {
    if (out[i] !== '`') {
      result += out[i];
      i++;
      continue;
    }
    const run = /^`+/.exec(out.slice(i))![0];
    const close = new RegExp(`(?<!\`)${run}(?!\`)`, 'g');
    close.lastIndex = i + run.length;
    const m = close.exec(out);
    if (!m) {
      result += run;
      i += run.length;
      continue;
    }
    const end = m.index + run.length;
    result += blank(out.slice(i, end));
    i = end;
  }
  return result;
}
