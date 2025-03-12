import { getRequestConfig } from 'next-intl/server';


// 支持的语言列表
export const locales = ['zh', 'en'];
export const defaultLocale = 'zh';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = 'zh';

    return {
        locale,
        messages: (await import(`../messages/${locale}/common.json`)).default
    };
});