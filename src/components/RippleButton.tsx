import { useRef, useState } from 'react';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function RippleButton({
  children,
  className = '',
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const idRef = useRef(0);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = ++idRef.current;

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      600
    );

    onClick?.(e);
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden active:scale-95 transition-all duration-300 ${className}`}
    >
      <span className="relative z-10 flex w-full items-center justify-center gap-2">
        {children}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            animation: 'ripple 0.6s ease-out',
          }}
        />
      ))}
    </button>
  );
}
