export default function WeatherIcon({ category, isDay = true, size = 40, className = '' }) {
  const stroke = '#F5EFE3';
  const brass = '#D99A56';
  const verd = '#5FB3AE';
  const common = { width: size, height: size, viewBox: '0 0 48 48', className, fill: 'none' };

  if (category === 'clear' && !isDay) {
    return (
      <svg {...common}>
        <path d="M31 8a16 16 0 1 0 9 29 13 13 0 0 1-9-29Z" fill={brass} opacity="0.9" />
      </svg>
    );
  }
  if (category === 'clear') {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="9" fill={brass} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="24" y1="4" x2="24" y2="10"
            stroke={brass} strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
      </svg>
    );
  }
  if (category === 'partly') {
    return (
      <svg {...common}>
        <circle cx="18" cy="16" r="7" fill={brass} opacity="0.9" />
        <path d="M14 30a9 9 0 0 1 8-13.9A11 11 0 0 1 33 24h1a6 6 0 0 1 0 12H16a8 8 0 0 1-2-6Z" fill={stroke} opacity="0.9" />
      </svg>
    );
  }
  if (category === 'overcast' || category === 'fog') {
    return (
      <svg {...common}>
        <path d="M12 28a9 9 0 0 1 8-13.9A11 11 0 0 1 31 22h1a6 6 0 0 1 0 12H14a7 7 0 0 1-2-6Z" fill={stroke} opacity="0.85" />
        {category === 'fog' && [0, 1, 2].map((i) => (
          <line key={i} x1="10" y1={38 + i * 3} x2="38" y2={38 + i * 3} stroke={verd} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        ))}
      </svg>
    );
  }
  if (category === 'drizzle' || category === 'rain') {
    return (
      <svg {...common}>
        <path d="M12 24a9 9 0 0 1 8-13.9A11 11 0 0 1 31 18h1a6 6 0 0 1 0 12H14a7 7 0 0 1-2-6Z" fill={stroke} opacity="0.9" />
        {[16, 24, 32].map((x, i) => (
          <line key={i} x1={x} y1="34" x2={x - 3} y2="42" stroke={verd} strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </svg>
    );
  }
  if (category === 'snow') {
    return (
      <svg {...common}>
        <path d="M12 22a9 9 0 0 1 8-13.9A11 11 0 0 1 31 16h1a6 6 0 0 1 0 12H14a7 7 0 0 1-2-6Z" fill={stroke} opacity="0.9" />
        {[17, 24, 31].map((x, i) => (
          <g key={i} stroke={verd} strokeWidth="1.6" strokeLinecap="round">
            <line x1={x} y1="34" x2={x} y2="42" />
            <line x1={x - 3} y1="35.5" x2={x + 3} y2="40.5" />
            <line x1={x - 3} y1="40.5" x2={x + 3} y2="35.5" />
          </g>
        ))}
      </svg>
    );
  }
  if (category === 'storm') {
    return (
      <svg {...common}>
        <path d="M12 20a9 9 0 0 1 8-13.9A11 11 0 0 1 31 14h1a6 6 0 0 1 0 12H14a7 7 0 0 1-2-6Z" fill={stroke} opacity="0.9" />
        <path d="M25 26l-6 10h5l-3 8 9-12h-5l3-6Z" fill={brass} />
      </svg>
    );
  }
  return null;
}
