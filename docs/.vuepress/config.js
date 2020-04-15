module.exports = {
  // base: '/whatsonaristocrats/',
  // https://github.com/vuejs/vuepress/issues/790#issuecomment-418107492
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#20272F' }],
    // ['link', { rel: 'stylesheet', href: `https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css`, async: true, }],
    ['link', { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700&family=Open+Sans:ital,wght@0,300;0,400;1,300;1,400&display=swap`, async: true, }],
    ['script', { src: "https://embed.small.chat/T3XD8S7D4G011CGXGFGF.js", async: true, defer: true }]
    ],
  plugins: [
    [
      '@vuepress/last-updated',
      {
        dateOptions:{
          hours12: false
        }
      }
    ],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: false
    }]
  ],
  themeConfig: {
    // extend: '@vuepress/theme-default',
    lastUpdated: true,
    search: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Privacy', link: '/privacy/' },
      { text: 'Github', link: 'https://github.com/voznik/whatsonaristocrats' },
    ],
    // sidebar: 'auto',
    displayAllHeaders: true // Default: false
  },
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US', // this will be set as the lang attribute on <html>
      title: 'WorryDon\'t Co.',
      description: 'Get information about what is on air from radio stations',
    },
    '/ru/': {
      lang: 'ru-RU',
      title: 'Что в єфире',
      description: 'Узнайте информацию о текущей песне на радио',
    },
  },
};
