import config from '../../configs/environment.configs';

export default (envType) => {
    const env = envType || process.env.NODE_ENV || 'production';
    const envConfig = config[env];
    const dbEnv = process.env.DB_ENV || 'production';

    return {
        testEnv: env !== 'production',
        env,
        domain: envConfig.domain,
        publicPath: envConfig.clientAppDir,
        port: envConfig.port,
        protocol: envConfig.protocol,
        dbEnv
    };
};
