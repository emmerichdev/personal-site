import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,  
  linkify: true,
  breaks: true,
  typographer: true,
});


export function renderMarkdown(markdown: string): string {
  return md.render(markdown || '');
}

