import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import WeatherIcon from './components/WeatherIcon.jsx';
import SunArcGauge from './components/SunArcGauge.jsx';
import StatCard from './components/StatCard.jsx';
import {
  DEFAULT_LOCATION,
  WEATHER_CATEGORY,
  WEATHER_LABEL,
  fmtTemp,
  kmhToMph,
  hhmm,
  hourLabel,
  dayLabel,
  compassLabel,
  skyGradient,
} from './lib/weather.js';

export default function App() {
  const [unit, setUnit] = useState('C');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchWeather = useCallback(async (loc) => {
    setLoading(true);
    setError('');
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
        `&timezone=auto&forecast_days=8`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather service unavailable');
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      setError('Could not load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) fetchWeather(location);
  }, [location, fetchWeather]);

  const reverseGeocode = async (latitude, longitude) => {
    let name = 'Your location', admin1 = '', country = '';
    try {
      const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const d = await r.json();
      name = d.city || d.locality || 'Your location';
      admin1 = d.principalSubdivision || '';
      country = d.countryName || '';
    } catch (e) {
      // reverse geocoding is a nicety; fall back to generic label
    }
    return { name, admin1, country, latitude, longitude };
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocation(loc);
        setGeoLoading(false);
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
        const d = await r.json();
        setSuggestions(d.results || []);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectCity = (r) => {
    setLocation({ name: r.name, admin1: r.admin1, country: r.country, latitude: r.latitude, longitude: r.longitude });
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocation(loc);
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    );
  };

  const current = weather && weather.current;
  const category = current ? WEATHER_CATEGORY(current.weather_code) : 'clear';
  const isDay = current ? !!current.is_day : true;

  const hourlyWindow = useMemo(() => {
    if (!weather || !weather.hourly || !current) return [];
    const times = weather.hourly.time;
    const startIdx = times.findIndex((t) => t === current.time.slice(0, 13) + ':00');
    const from = startIdx >= 0 ? startIdx : 0;
    return times.slice(from, from + 24).map((t, i) => ({
      time: t,
      temp: weather.hourly.temperature_2m[from + i],
      code: weather.hourly.weather_code[from + i],
      pop: weather.hourly.precipitation_probability[from + i],
    }));
  }, [weather, current]);

  const daily = weather && weather.daily;

  return (
    <div className="min-h-screen w-full transition-all duration-700" style={{ background: skyGradient(isDay, category) }}>
      {!isDay && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-parchment"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 55}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="9" fill="#D99A56" />
              <circle cx="24" cy="24" r="16" stroke="#8A6A42" strokeWidth="1.5" fill="none" />
            </svg>
            <h1 className="font-display text-parchment text-2xl tracking-wide">WeatherApp</h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
                placeholder="Search city..."
                className="w-full bg-panel/80 backdrop-blur border border-brassdim/40 text-parchment placeholder-parchment/40 rounded-full px-4 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brass/60"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-panel border border-brassdim/40 rounded-xl overflow-hidden shadow-xl fade-in">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectCity(s)}
                      className="w-full text-left px-4 py-2 text-sm text-parchment hover:bg-panel2 transition-colors font-body"
                    >
                      {s.name}
                      <span className="text-parchment/50 ml-1">
                        {s.admin1 ? `, ${s.admin1}` : ''}{s.country ? `, ${s.country}` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={useGeolocation}
              title="Use my location"
              className="shrink-0 bg-panel/80 border border-brassdim/40 rounded-full p-2.5 text-brass hover:bg-panel2 transition-colors"
            >
              {geoLoading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#D99A56" strokeWidth="2" strokeDasharray="40" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#D99A56" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5" stroke="#D99A56" strokeWidth="2" />
                </svg>
              )}
            </button>

            <div className="shrink-0 flex bg-panel/80 border border-brassdim/40 rounded-full p-0.5 text-sm font-mono">
              <button
                onClick={() => setUnit('C')}
                className={`px-3 py-1.5 rounded-full transition-colors ${unit === 'C' ? 'bg-brass text-ink' : 'text-parchment/70'}`}
              >°C</button>
              <button
                onClick={() => setUnit('F')}
                className={`px-3 py-1.5 rounded-full transition-colors ${unit === 'F' ? 'bg-brass text-ink' : 'text-parchment/70'}`}
              >°F</button>
            </div>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#D99A56" strokeWidth="2" strokeDasharray="40" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-parchment/80 font-body mb-3">{error}</p>
            <button onClick={() => location && fetchWeather(location)} className="px-4 py-2 rounded-full bg-brass text-ink font-medium text-sm">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && weather && current && (
          <div className="fade-in space-y-6">
            <section className="bg-panel/60 backdrop-blur border border-brassdim/30 rounded-3xl p-6 sm:p-8 grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <p className="font-body text-parchment/60 text-sm mb-1">
                  {location.name}{location.admin1 ? `, ${location.admin1}` : ''}{location.country ? `, ${location.country}` : ''}
                </p>
                <div className="flex items-end gap-3">
                  <span className="font-display text-parchment text-7xl leading-none">{fmtTemp(current.temperature_2m, unit)}°</span>
                  <WeatherIcon category={category} isDay={isDay} size={56} />
                </div>
                <p className="font-body text-verdigris mt-1">{WEATHER_LABEL[category]}</p>
                <p className="font-mono text-parchment/50 text-xs mt-2">
                  Feels like {fmtTemp(current.apparent_temperature, unit)}°{unit}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <SunArcGauge
                  sunrise={daily.sunrise[0]}
                  sunset={daily.sunset[0]}
                  current={current.time}
                  isDay={isDay}
                />
                <p className="font-mono text-parchment/40 text-[11px] mt-1">sunrise — sunset</p>
              </div>
            </section>

            <section>
              <h2 className="font-body text-parchment/70 text-sm mb-2 tracking-wide uppercase">Next 24 hours</h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
                {hourlyWindow.map((h, i) => (
                  <div key={h.time} className="snap-x-child shrink-0 w-20 bg-panel/60 border border-brassdim/25 rounded-2xl px-3 py-3 flex flex-col items-center gap-1.5">
                    <span className="font-mono text-parchment/60 text-xs">{i === 0 ? 'Now' : hourLabel(h.time)}</span>
                    <WeatherIcon category={WEATHER_CATEGORY(h.code)} isDay={true} size={28} />
                    <span className="font-mono text-parchment text-sm">{fmtTemp(h.temp, unit)}°</span>
                    <span className="font-mono text-verdigris text-[10px]">{h.pop}%</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-panel/60 backdrop-blur border border-brassdim/30 rounded-3xl p-4 sm:p-6">
              <h2 className="font-body text-parchment/70 text-sm mb-3 tracking-wide uppercase">7-day forecast</h2>
              <div className="divide-y divide-brassdim/15">
                {daily.time.slice(0, 7).map((t, i) => {
                  const min = daily.temperature_2m_min[i];
                  const max = daily.temperature_2m_max[i];
                  const globalMin = Math.min(...daily.temperature_2m_min.slice(0, 7));
                  const globalMax = Math.max(...daily.temperature_2m_max.slice(0, 7));
                  const left = ((min - globalMin) / (globalMax - globalMin || 1)) * 100;
                  const width = ((max - min) / (globalMax - globalMin || 1)) * 100;
                  return (
                    <div key={t} className="flex items-center gap-4 py-2.5">
                      <span className="font-body text-parchment text-sm w-16 shrink-0">{dayLabel(t, i)}</span>
                      <WeatherIcon category={WEATHER_CATEGORY(daily.weather_code[i])} isDay={true} size={26} className="shrink-0" />
                      <span className="font-mono text-parchment/50 text-xs w-9 text-right shrink-0">{fmtTemp(min, unit)}°</span>
                      <div className="flex-1 h-1.5 bg-panel2 rounded-full relative overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-verdigris to-brass rounded-full"
                          style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                        />
                      </div>
                      <span className="font-mono text-parchment text-xs w-9 shrink-0">{fmtTemp(max, unit)}°</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Humidity" value={`${current.relative_humidity_2m}%`} sub="relative" />
              <StatCard
                label="Wind"
                value={`${Math.round(unit === 'F' ? kmhToMph(current.wind_speed_10m) : current.wind_speed_10m)} ${unit === 'F' ? 'mph' : 'km/h'}`}
                sub={compassLabel(current.wind_direction_10m)}
              />
              <StatCard label="Sunrise" value={hhmm(daily.sunrise[0])} sub="local time" />
              <StatCard label="Sunset" value={hhmm(daily.sunset[0])} sub="local time" />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
