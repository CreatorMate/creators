// https://nuxt.com/docs/api/configuration/nuxt-config
import {getModuleRoutes} from "./src/register-modules";
import type {NuxtPage} from "@nuxt/schema";

const moduleRoutes: NuxtPage[] = getModuleRoutes();
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  pages: true,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/color-mode', '@vueuse/nuxt', "@nuxtjs/supabase"],
  hooks: {
    'pages:extend' (pages) {
      pages.push(...moduleRoutes);
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: ['/callback', '/API/webhook', '/public/discovery', '/public/discovery/*', '/profile/*']
    },
    redirect: true
  },
  // oidc: {
    // defaultProvider: "auth0",
    // providers: {
    //   auth0: {
    //     audience: 'https://creatormate.eu.auth0.com/api/v2/',
    //     redirectUri: process.env.NUXT_OIDC_PROVIDERS_AUTH0_REDIRECT_URI,
    //     baseUrl: process.env.NUXT_OIDC_PROVIDERS_AUTH0_BASE_URL,
    //     clientId: process.env.NUXT_OIDC_PROVIDERS_AUTH0_CLIENT_ID,
    //     clientSecret: process.env.NUXT_OIDC_PROVIDERS_AUTH0_CLIENT_SECRET,
    //     scope: ['openid', 'offline_access', 'profile', 'email'],
    //     additionalTokenParameters: { // In case you need access to an API registered in Auth0
    //       audience: 'https://creatormate.eu.auth0.com/api/v2/',
    //     },
    //     additionalAuthParameters: { // In case you need access to an API registered in Auth0
    //       audience: 'https://creatormate.eu.auth0.com/api/v2/',
    //     },
    //     exposeIdToken: true,
    //     exposeAccessToken: true,
    //   },
    // },
  //   middleware: {
  //     globalMiddlewareEnabled: false,
  //   },
  // },
  colorMode: {
    classSuffix: ''
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'creatormate portal',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap'
        },
      ]
    }
  },
  runtimeConfig: {
    pages: [],
    public: {
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
      SUPABASE_URL: process.env.SUPABASE_URL
    },
  },
  image: {
    domains: ['https://mfouoyeneddsfujxfjci.supabase.co', 'https://s.gravatar.com'],
  },
  dir: {
    assets: './src/assets',
    layouts: './src/layouts',
    plugins: './src/plugins',
    middleware: './src/middleware',
    pages: './src/pages',
  },
  components: {
    dirs: [
      {
        path: './src/components',
        global: true
      }
    ],
  },
  serverHandlers: [
    {
      route: '/API', handler: './src/api/hono.ts', middleware: true
    }
  ],
  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '.localhost',
        '6407-2a02-a460-9614-0-31af-d4c1-5d9d-a33a.ngrok-free.app'  // Or use an environment variable
      ]
    }
  }
});