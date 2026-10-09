import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import fs from 'fs';
import gtmNoscriptPlugin from './plugins/gtm-noscript';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const versions: string[] = JSON.parse(fs.readFileSync('./versions.json', 'utf-8'));
// Skip non-release entries like "cloud" which are manually maintained versions
const latestVersion = versions.find(v => /^v\d+/.test(v)) ?? versions[0];

// Read quickStartDockerTag from _constants.md
const constantsFile = fs.readFileSync('./docs/_constants.md', 'utf-8');
const dockerTagMatch = constantsFile.match(/quickStartDockerTag:\s*['"]([^'"]+)['"]/);
const quickStartDockerTag = dockerTagMatch ? dockerTagMatch[1] : latestVersion;

// Where the announcement bar's link points. A version like "v1.0.0-rc1" is a real
// release tag; a train like "v0.18.x" never is (that release was tagged v0.18.0), so
// anything not shaped like an exact version links to the release list instead of a 404.
const releaseUrl = /^v\d+\.\d+\.\d+/.test(latestVersion)
  ? `https://github.com/wso2/agent-manager/releases/tag/amp%2F${latestVersion}`
  : 'https://github.com/wso2/agent-manager/releases';

// Pages whose path changed when the docs were reorganised into the
// Get Started / Concepts / Guides / Tutorials / References structure. The
// pre-reorganisation URLs are mapped forward to keep existing bookmarks and
// inbound links working.
const reorganizedPaths: [string, string][] = [
  ['overview/what-is-amp', 'get-started/what-is-amp'],
  ['getting-started/quick-start', 'get-started/quick-start'],
  ['getting-started/on-k3d', 'guides/on-k3d'],
  ['getting-started/create-your-first-agent', 'tutorials/create-your-first-agent'],
  ['components/amp-instrumentation', 'guides/amp-instrumentation'],
  ['administration/isolation-tiers/gvisor', 'guides/isolation-tiers/gvisor'],
  ['administration/isolation-tiers/kata', 'guides/isolation-tiers/kata'],
];

const config: Config = {
  title: 'WSO2 Agent Manager',
  tagline: 'Run, govern, observe, evaluate, and secure AI agents at scale',
  favicon: 'img/WSO2-Logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    // Disabled: on Docusaurus 3.10.2, v4:true pulls in the Rust-based Faster
    // bundler, which has a build-breaking MDX compilation bug when several
    // near-identical versioned docs are processed together (confirmed via
    // bisection against getting-started/on-a-vm.mdx's 5 version copies,
    // reproducible only with v4 enabled). Revisit once that's fixed upstream.
    v4: false,
  },

  // Set the production url of your site here
  url: 'https://wso2.com',
  // Set the /<baseUrl>/ pathname under which the site is served.
  // through to this GitHub Pages site.
  baseUrl: '/agent-platform/docs/',

  // Set true for GitHub pages deployment.
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wso2', // Usually your GitHub org/user name.
  projectName: 'docs-agent-platform', // Usually your repo name.

  onBrokenLinks: 'throw',

  customFields: {
    latestVersion,
    searchProvider: 'auto',
  },

  // CookiePro must load before GTM so it can categorize/block tracking
  // scripts pending consent;
  headTags: [
    {
      tagName: 'script',
      attributes: {
        src: 'https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js',
        type: 'text/javascript',
        charset: 'UTF-8',
        'data-domain-script': '486163bc-a8c5-40d8-b185-c707cc718a23',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'text/javascript',
      },
      innerHTML: 'function OptanonWrapper() { }',
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
          j.setAttributeNode(d.createAttribute('data-ot-ignore'));
          j.async = true;
          j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-PSTXMT');
      `,
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable mermaid for markdown files
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Enable mermaid theme
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    '@signalwire/docusaurus-plugin-llms-txt',
    [
      require.resolve('docusaurus-lunr-search'),
      {
        // Next is unreleased and noindexed; keep it out of search results too.
        excludeRoutes: ['next', 'next/**'],
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Send the /latest/ form of each pre-reorganisation URL to the
        // canonical page in one hop; the alias follows whatever is current.
        redirects: [
          ...reorganizedPaths.map(([from, to]) => ({
            from: `/latest/${from}`,
            to: `/${latestVersion}/${to}`,
          })),
          ...['next', 'cloud', latestVersion, 'latest'].map((alias) => ({
            from: `/${alias}`,
            to: `/${alias === 'latest' ? latestVersion : alias}/get-started/what-is-amp`,
          })),
        ],
        createRedirects(existingPath: string) {
          if (existingPath.includes(`/${latestVersion}/`)) {
            return [existingPath.replace(`/${latestVersion}/`, '/latest/')];
          }
          return undefined;
        },
      },
    ],
    gtmNoscriptPlugin,
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          // baseUrl already ends in /docs/ (see above), so mount the docs
          // plugin at that root instead of nesting another docs/ segment.
          routeBasePath: '/',
          lastVersion: latestVersion,
          versions: {
            current: {
              label: 'Next',
              banner: 'unreleased',
            },
            cloud: {
              label: 'Cloud',
              banner: 'none',
              path: 'cloud',
            },
            [latestVersion]: {
              label: latestVersion,
              path: latestVersion,
            },
          },
          sidebarPath: './sidebars.ts',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/wso2/docs-agent-platform/edit/main/',
        },
        blog: false, // Disable blog until we have content
        theme: {
          // Order matters: amp-theme.css layers the site theme over
          // custom.css and relies on loading second to win on equal
          // specificity. Do not reorder.
          customCss: [
            './src/css/custom.css',
            './src/css/amp-theme.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {

    // Replace with your project's social card
    // image: 'img/amp-social-card.png',
    announcementBar: {
      // Announce latestVersion (versions.json), NOT quickStartDockerTag. The latter is the
      // container image tag the quick-start guide pins, and it moves for reasons that have
      // nothing to do with a release: 271d85aaa retagged it to a ThunderID version, which
      // silently changed this banner to announce a "1.0.0" release of Agent Manager that
      // did not exist — and pointed "Explore what's new" at a tag that 404s.
      id: `release_${latestVersion.replace(/\./g, '_')}`,
      content:
        `🎉 WSO2 Agent Manager <a target="_blank" rel="noopener noreferrer" href="${releaseUrl}">${latestVersion}</a> has been released! Explore what's new. 🎉`,
      isCloseable: true,
    },

    algolia: {
      appId: 'HGUIB02S86',
      apiKey: '08ce042847a47babb4833e131c226e33',
      indexName: 'Docs-agent-platform Crawler',
      contextualSearch: false,
      searchParameters: {},
      askAi: {
        assistantId: 'X4ZuiOLg5WnL',
      }
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        href: `/${latestVersion}/get-started/what-is-amp`,
        alt: 'WSO2 Agent Manager Logo',
        src: 'img/WSO2 Agent Manager Logo_Black.svg',
        srcDark: 'img/WSO2 Agent Manager Logo_white.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/wso2/agent-manager',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Overview',
              to: `/${latestVersion}/get-started/what-is-amp`,
            },
            {
              label: 'Quick Start',
              to: `/${latestVersion}/get-started/quick-start`,
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/wso2/agent-manager/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/wso2/agent-manager/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wso2/agent-manager',
            },
            {
              label: 'WSO2',
              href: 'https://wso2.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WSO2 LLC. Licensed under Apache License 2.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
