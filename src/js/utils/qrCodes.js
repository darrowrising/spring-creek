import { GAEvent } from '../components/analytics/Analytics';

export function handleURLParams(search) {
  const paramString = search || document?.location?.search;

  if (paramString) {
    const paramArray = paramString.split('?')[1].split('&');
    paramArray.forEach((item) => {
      const arr = item.split('=');
      const key = arr[0] === 'qr' ? 'QR Code' : arr[0];

      GAEvent({
        category: 'Params',
        action: `${key} | ${arr[1]}`,
        label: `Param ${key} ${arr[1]}`,
      });
    });

    return paramString.includes('qr');
  }

  return false;
}
