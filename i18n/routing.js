import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'id'],
    defaultLocale: 'id'
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
