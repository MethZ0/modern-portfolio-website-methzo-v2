/**
 * Decorative SVG vector components for visual enhancement
 * Used across the landing page for artistic flair
 */

export function FloatingCircle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
    </svg>
  );
}

export function AbstractBlob({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450Q159,406,99.5,356Q40,306,40,230.5Q40,155,86,98Q132,41,209,23Q286,5,347,52.5Q408,100,438,175Q468,250,440.5,320.5Z"
        fill="currentColor"
        opacity="0.03"
      />
    </svg>
  );
}

export function GridDots({ className = '' }: { className?: string }) {
  const dots = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * 24 + 12}
          cy={row * 24 + 12}
          r="1.5"
          fill="currentColor"
          opacity="0.15"
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 204 204" className={className} xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  );
}

export function WavyLine({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M0,30 Q150,0 300,30 Q450,60 600,30 Q750,0 900,30 Q1050,60 1200,30"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
    </svg>
  );
}

export function CrosshairMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="5" x2="20" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

export function DiagonalLines({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={i}
          x1={i * 25}
          y1="0"
          x2={i * 25 + 100}
          y2="200"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.08"
        />
      ))}
    </svg>
  );
}

export function ArrowVector({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 L50 10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M35 10 L50 10 L50 25" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function AbstractShape({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M150 20 L280 100 L240 260 L60 260 L20 100 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.1"
      />
      <path
        d="M150 60 L240 120 L210 230 L90 230 L60 120 Z"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.07"
      />
    </svg>
  );
}
