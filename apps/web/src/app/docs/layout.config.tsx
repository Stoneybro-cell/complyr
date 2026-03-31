import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import React from 'react';
import { DocsLogo } from '@/components/docs/DocsLogo';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <DocsLogo />,
  },
  links: [
    {
      text: 'Back to App',
      url: '/',
      external: true,
      active: 'nested-url',
    },
  ],
};
