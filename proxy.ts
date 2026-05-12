import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/locales';

const handle = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export default handle;
export const proxy = handle;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
