const config = require('../config');

module.exports = (envType) => {
    const env = envType || process.env.NODE_ENV || 'production';
    const envConfig = config.env[env];

    return {
        testEnv: env !== 'production',
        env,
        domain: envConfig.domain,
        publicPath: envConfig.clientAppDir,
        port: envConfig.port,
        protocol: envConfig.protocol
    };
};
