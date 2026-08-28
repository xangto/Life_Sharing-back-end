import TurndownService from 'turndown';

/**
 * HTML 字符串转 Markdown
 * @param html 原始HTML字符串
 * @returns markdown文本
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  const turndown = new TurndownService({
    headingStyle: 'atx', // 使用 # 标题
    bulletListMarker: '-', // 无序列表 -
    codeBlockStyle: 'fenced', // ``` 代码块
    emDelimiter: '*', // 斜体 *
    strongDelimiter: '**', // 加粗 **
  });

  // 可选：移除不需要转换的标签，比如 <div class="xxx"> 只保留内部文本
  // turndown.addRule('removeDiv', {
  //   filter: 'div',
  //   replacement: function (content) {
  //     return content;
  //   },
  // });

  return turndown.turndown(html);
}
