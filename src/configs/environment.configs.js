export default {
    development: {
        port: 3010,
        protocol: 'http',
        domain: 'localhost',
        clientAppDir: '../public/static'
    },
    production: {
        port: 26140,
        protocol: 'https',
        domain: 'springcreeklds.firebaseapp.com',
        clientAppDir: '../public/static'
    },
    defaultPort: 3000
};
