import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import React from 'react';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <img
          alt="COMPLYR Logo"
          className="h-6 w-auto block dark:hidden"
          src="/complyrlogo-dark.svg"
        />
        <img
          alt="COMPLYR Logo"
          className="h-6 w-auto hidden dark:block"
          src="/complyrlogo-light.svg"
        />
        <span className="font-bold uppercase tracking-tight text-lg">Complyr</span>
      </div>
    ),
  },
  links: [
    {
      text: 'Back to App',
      url: '/',
      active: 'nested-url',
    },
  ],
};
