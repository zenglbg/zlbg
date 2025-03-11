import { getRequestConfig } from 'next-intl/server';


// 支持的语言列表
export const locales = ['zh', 'en'];
export const defaultLocale = 'zh';

// 获取消息文件
export async function getMessages(locale: string) {
  try {
    // 动态导入对应语言的消息文件
    const messages = (await import(`../messages/${locale}/common.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // 如果加载失败，返回默认语言的消息
    const defaultMessages = (await import(`../messages/${defaultLocale}/common.json`)).default;
    return defaultMessages;
  }
}
export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = 'zh';

    return {
        locale,
        messages: (await import(`../messages/${locale}/common.json`)).default
    };
});