export const DEFAULT_LOCATION = {
  name: 'New Delhi',
  admin1: 'Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.2090,
};

export const WEATHER_CATEGORY = (code) => {
  if (code === 0) return 'clear';
  if ([1, 2].includes(code)) return 'partly';
  if (code === 3) return 'overcast';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'partly';
};

export const WEATHER_LABEL = {
  clear: 'Clear sky',
  partly: 'Partly cloudy',
  overcast: 'Overcast',
  fog: 'Fog',
  drizzle: 'Drizzle',
  rain: 'Rain',
  snow: 'Snow',
  storm: 'Thunderstorm',
};

export const cToF = (c) => (c * 9) / 5 + 32;
export const kmhToMph = (k) => k * 0.621371;
export const fmtTemp = (c, unit) => Math.round(unit === 'F' ? cToF(c) : c);
export const hhmm = (isoStr) => (isoStr ? isoStr.slice(11, 16) : '--:--');

export const hourLabel = (isoStr) => {
  const h = parseInt(isoStr.slice(11, 13), 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${suffix}`;
};

export const dayLabel = (isoStr, idx) => {
  if (idx === 0) return 'Today';
  const d = new Date(isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const compassLabel = (deg) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
};

export function skyGradient(isDay, category) {
  if (!isDay) {
    if (category === 'clear') return 'linear-gradient(180deg,#070D13 0%,#0D1B24 55%,#142B36 100%)';
    return 'linear-gradient(180deg,#0A141B 0%,#12232D 60%,#173039 100%)';
  }
  switch (category) {
    case 'clear': return 'linear-gradient(180deg,#1B3A46 0%,#2C5A63 45%,#D99A56 130%)';
    case 'partly': return 'linear-gradient(180deg,#16303B 0%,#274A55 55%,#4C7A7A 120%)';
    case 'overcast': return 'linear-gradient(180deg,#14252D 0%,#233F47 60%,#3A5A5C 120%)';
    case 'fog': return 'linear-gradient(180deg,#1A2C32 0%,#2B454B 60%,#46686A 120%)';
    case 'drizzle':
    case 'rain': return 'linear-gradient(180deg,#0F1F27 0%,#1D3640 55%,#2E4C52 120%)';
    case 'snow': return 'linear-gradient(180deg,#16262D 0%,#274347 55%,#5A7C7E 120%)';
    case 'storm': return 'linear-gradient(180deg,#0A1216 0%,#1A2229 55%,#2C333A 120%)';
    default: return 'linear-gradient(180deg,#0D1B24 0%,#142B36 100%)';
  }
}
