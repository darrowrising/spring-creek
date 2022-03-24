export default {
  development: {
    port: 3010,
    protocol: 'http',
    domain: 'localhost',
    analytics: 'UA-131499754-2',
    clientAppDir: '../public/static',
  },
  production: {
    port: 26140,
    protocol: 'https',
    domain: 'springcreeklds.firebaseapp.com',
    analytics: 'UA-131499754-1',
    clientAppDir: '../public/static',
  },
  defaultPort: 3000,
};
