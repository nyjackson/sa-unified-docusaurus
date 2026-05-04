import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'S & A Unified Knowledge Hub',
  tagline: 'Onboarding, Engineering & Operations Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'es'],
    localeConfigs: {
      en: {label: 'English'},
      ru: {label: 'Русский'},
      es: {label: 'Español'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'pathname:///admin/', // edit, not working
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  // Mermaid Theme and Markdown Support
  themes: ['@docusaurus/theme-mermaid', [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // Only search docs
        indexBlog: false,
        indexPages: false,
        indexDocs: true,
        // Default language of your site
        language: ["en"],
        // Highlights the search terms on the page when clicked
        highlightSearchTermsOnTargetPage: true,
      }),
    ],],
  markdown: {
    mermaid: true,
  },
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    // Mermaid configuration (optional: customize theme here)
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
    navbar: {
      title: 'S & A Unified Knowledge',
      logo: {
        alt: 'S & A Unified Logo',
        src: 'img/SAULogo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documents',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'Editor Login',
          href: 'pathname:///admin/',
          position:'right',
          className: 'button button--secondary nav-button'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Document Index',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Company Website',
              href: 'https://saunifiedhomecare.com/',
            },
            {
              label: 'Client Eligibility Tool',
              href: 'https://eligibility.saunified.com/login',
            },
             {
              label: 'Document Scanning Portal',
              href: 'https://scan.saunified.com/',
            },
            {
              label: 'In-Service Caregiver Training Tool',
              href: 'https://inservicecare.com/login'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} S & A Unified Home Care, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
