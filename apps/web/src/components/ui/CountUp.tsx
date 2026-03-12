'use client';

import { useInView, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
    value: string | number;
    duration?: number;
    className?: string;
}

export function CountUp({ value, duration = 1.5, className }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inViewRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(inViewRef, { once: false, margin: "-10px" });

    // Extract numerical part and suffix
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const prefix = typeof value === 'string' && value.includes('₹') ? '₹' : '';
    const suffix = typeof value === 'string' ? value.replace(/[^%MLK]/g, '') : '';

    useEffect(() => {
        if (!ref.current) return;

        if (isInView) {
            const controls = animate(0, numericValue, {
                duration: duration,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = `${prefix}${latest.toFixed(value.toString().includes('.') ? 1 : 0)}${suffix}`;
                    }
                }
            });
            return () => controls.stop();
        } else {
            if (ref.current) {
                ref.current.textContent = `${prefix}0${suffix}`;
            }
        }
    }, [isInView, numericValue, duration, prefix, suffix, value]);

    return <span ref={inViewRef} className={className}><span ref={ref}></span></span>;
}
