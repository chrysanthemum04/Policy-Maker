'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, MouseEvent } from 'react';

interface LiquidCardProps {
    step: string;
    title: string;
    description: string;
    icon: ReactNode;
    colorConfig: string;
    textColor: string;
    shadowColor: string;
    delay: number;
    slideDirection?: 'left' | 'right' | 'bottom';
}

export default function LiquidCard({
    step,
    title,
    description,
    icon,
    colorConfig,
    textColor,
    shadowColor,
    delay,
    slideDirection = 'bottom'
}: LiquidCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
    const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        // Mouse position for gradient
        mouseX.set(x);
        mouseY.set(y);

        // Tilt effect
        const rotateXValue = ((y - height / 2) / height) * -10; // Max tilt 10deg
        const rotateYValue = ((x - width / 2) / width) * 10;

        rotateX.set(rotateXValue);
        rotateY.set(rotateYValue);
    }

    function onMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        mouseX.set(-1000);
        mouseY.set(-1000);
    }

    const maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { transformStyle: 'preserve-3d' as const };

    const initialX = slideDirection === 'left' ? -100 : slideDirection === 'right' ? 100 : 0;
    const initialY = slideDirection === 'bottom' ? 80 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d"
            }}
            className="relative w-full h-full"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative h-full w-full rounded-3xl border border-white/10 bg-black dark:bg-black/40 backdrop-blur-xl p-8 transition-colors duration-500 overflow-hidden group"
            >
                {/* Liquid Border/Glow Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{ maskImage, WebkitMaskImage: maskImage }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${textColor.replace('text-', 'from-').replace('text-', 'to-')} opacity-20`} />
                </motion.div>

                {/* Ambient Moving Blob Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${colorConfig} opacity-40`}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            x: [0, -30, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl dark:bg-blue-500/30 bg-blue-500/10 opacity-40`}
                    />
                </div>

                <div className="relative z-10 flex flex-col h-full transform-gpu" style={{ transform: "translateZ(20px)" }}>
                    <div className={`text-7xl font-bold mb-6 ${textColor} opacity-80 tracking-tighter`} style={{ textShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                        {step}
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-16 h-16 rounded-2xl ${colorConfig} flex items-center justify-center text-white mb-6 ${shadowColor} shadow-lg`}
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {icon}
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-4 text-white" style={{ transform: "translateZ(25px)" }}>{title}</h3>

                    <p className="text-slate-300 leading-relaxed" style={{ transform: "translateZ(20px)" }}>
                        {description}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
