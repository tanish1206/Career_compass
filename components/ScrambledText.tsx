import React, { useEffect, useRef, useState } from 'react';

export interface ScrambledTextProps {
    radius?: number;
    duration?: number;
    speed?: number;
    scrambleChars?: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
    radius = 150,
    duration = 0.4,
    speed = 0.5,
    scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
    className = '',
    style = {},
    children
}) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [displayText, setDisplayText] = useState(String(children));
    const originalText = useRef(String(children));
    const activeIntervals = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const isScrambling = useRef<Set<number>>(new Set());

    useEffect(() => {
        originalText.current = String(children);
        setDisplayText(String(children));
    }, [children]);

    const scrambleChar = (charIndex: number) => {
        // Prevent multiple scrambles on the same character
        if (isScrambling.current.has(charIndex)) return;

        isScrambling.current.add(charIndex);

        // Clear any existing interval for this character
        const existingInterval = activeIntervals.current.get(charIndex);
        if (existingInterval) {
            clearInterval(existingInterval);
        }

        const chars = scrambleChars.split('');
        const iterations = Math.floor(duration * 20); // Increased from 10 to 20 for smoother effect
        let currentIteration = 0;

        const interval = setInterval(() => {
            setDisplayText(prev => {
                const textArray = prev.split('');
                if (charIndex < textArray.length) {
                    textArray[charIndex] = chars[Math.floor(Math.random() * chars.length)];
                }
                return textArray.join('');
            });

            currentIteration++;
            if (currentIteration >= iterations) {
                clearInterval(interval);
                activeIntervals.current.delete(charIndex);
                isScrambling.current.delete(charIndex);

                // Restore original character
                setDisplayText(prev => {
                    const textArray = prev.split('');
                    if (charIndex < originalText.current.length) {
                        textArray[charIndex] = originalText.current[charIndex];
                    }
                    return textArray.join('');
                });
            }
        }, 25); // Reduced from 50ms to 25ms for faster scrambling

        activeIntervals.current.set(charIndex, interval);
    };

    const handleMove = (e: React.PointerEvent) => {
        if (!rootRef.current) return;

        const text = originalText.current;
        const containerRect = rootRef.current.getBoundingClientRect();

        // Calculate approximate character positions
        const charWidth = containerRect.width / text.length;

        text.split('').forEach((char, index) => {
            // Skip spaces
            if (char === ' ') return;

            const charX = containerRect.left + (index * charWidth) + (charWidth / 2);
            const charY = containerRect.top + (containerRect.height / 2);

            const dx = e.clientX - charX;
            const dy = e.clientY - charY;
            const dist = Math.hypot(dx, dy);

            if (dist < radius) {
                scrambleChar(index);
            }
        });
    };

    useEffect(() => {
        return () => {
            // Cleanup all intervals on unmount
            activeIntervals.current.forEach(interval => clearInterval(interval));
            activeIntervals.current.clear();
            isScrambling.current.clear();
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className={`cursor-pointer select-none ${className}`}
            style={style}
            onPointerMove={handleMove}
        >
            <p className="font-mono">{displayText}</p>
        </div>
    );
};

export default ScrambledText;
