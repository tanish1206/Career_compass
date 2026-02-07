import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ children, className = '', hover = false, style }: CardProps) {
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 ${hover ? 'hover:bg-[var(--card-hover)] hover:border-blue-500/30 transition-all cursor-pointer' : ''
        } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
