export default defineNuxtConfig({
  app: {
    head: {
      title: 'WritePro',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
    }
  },
  buildModules: ['@nuxtjs/google-fonts'],
  css: ['@/assets/css/main.css'],
  googleFonts: {
    families: {
      Inter: true,
    }
  },
  modules: ['nuxt-icon'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})