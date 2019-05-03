import envConfig from '../configs/env';

const domain = window.location.hostname;

export default function envHandler() {
    return envConfig.find(item => item.domain === domain || item.host === domain);
}
