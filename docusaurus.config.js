// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sycamore Garden',
  tagline: 'The professional portfolio of Sam Sycamore, web developer and writer in the tech industry.',
  url: 'https://sycamore.garden',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/garden.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'samuelsycamore', // Usually your GitHub org/user name.
  projectName: 'docusaurus-garden', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Sycamore Garden',
        logo: {
          alt: 'Sycamore Garden',
          src: 'images/garden.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Portfolio',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/services', label: 'Services', position: 'left' },
          { to: '/about', label: 'About', position: 'left' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Sycamore Garden',
            items: [
              {
                label: 'Portfolio',
                to: '/portfolio/intro',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Services',
                to: '/services',
              },
              {
                label: 'About',
                to: '/about',
              },
            ],
          },
          {
            title: 'Social Media',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/tanoaksam',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/samuelsycamore',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/samuelsycamore',
              },
            ],
          },

        ],
        copyright: `Copyright © ${new Date().getFullYear()} Sam Sycamore. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
