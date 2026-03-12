'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { MouseEvent, useRef } from 'react';

interface ParallaxTiltProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number; // How strong the tilt is (default: 15)
    perspective?: number; // CSS perspective value (default: 1000)
}

export function ParallaxTilt({
    children,
    className = '',
    intensity = 15,
    perspective = 1000
}: ParallaxTiltProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        // Calculate mouse position relative to center of element (-0.5 to 0.5)
        // 0,0 is center
        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;

        const xPct = (mouseXRel / width) - 0.5;
        const yPct = (mouseYRel / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: perspective,
            }}
            className={`will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
}
