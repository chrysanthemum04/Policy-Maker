'use client';

import { motion, useTransform, useScroll, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import LiquidCard from './LiquidCard';
import { Zap, Users, Shield } from 'lucide-react';

const items = [
    {
        step: "01",
        title: "Simulate",
        description: "Enter your income, city, and profession. See how Budget 2026, GST changes, and subsidies affect you.",
        icon: <Zap className="w-8 h-8" />,
        colorConfig: "bg-[#ba7b34]",
        textColor: "text-[#ba7b34]",
        shadowColor: "shadow-[#ba7b34]/30",
        glowHex: "#ba7b34",
        delay: 0
    },
    {
        step: "02",
        title: "Discuss",
        description: "Join verified expert-moderated discussions. Ask CAs, lawyers, and economists directly.",
        icon: <Users className="w-8 h-8" />,
        colorConfig: "bg-[var(--primary)]",
        textColor: "text-[var(--primary)]",
        shadowColor: "shadow-[var(--primary)]/30",
        glowHex: "#5187e4", // Royal Blue
        delay: 0
    },
    {
        step: "03",
        title: "Act",
        description: "Download personalized action plans. Optimize your taxes, claim benefits, and stay compliant.",
        icon: <Shield className="w-8 h-8" />,
        colorConfig: "bg-[#d7191f]",
        textColor: "text-[#d7191f]",
        shadowColor: "shadow-[#d7191f]/30",
        glowHex: "#d7191f",
        delay: 0
    }
];

const CarouselItem = ({ item, index, scrollYProgress }: { item: any, index: number, scrollYProgress: MotionValue<number> }) => {
    // Peak times when each card should be centered
    const peaks = [0.3, 0.55, 0.8];
    const peak = peaks[index];
    const start = peak - 0.12;
    const end = peak + 0.12;

    const scale = useTransform(
        scrollYProgress,
        [start, peak, end],
        [0.75, 1.45, 0.75]
    );

    const opacity = useTransform(
        scrollYProgress,
        [start, peak, end],
        [0.5, 1, 0.5]
    );

    const zIndex = useTransform(
        scrollYProgress,
        [start, peak, end],
        [0, 10, 0]
    );

    const glowColor = item.glowHex || '#ffffff';

    // Sleek border that highlights on active
    const borderOpacity = useTransform(
        scrollYProgress,
        [start, peak, end],
        [0.2, 1, 0.2]
    );

    return (
        <motion.div
            style={{
                scale,
                opacity,
                zIndex,
                borderColor: `${glowColor}`,
                borderWidth: '2px',
                borderStyle: 'solid'
            }}
            className="w-[70vw] md:w-[24vw] h-[50vh] shrink-0 rounded-3xl"
        >
            <motion.div
                style={{ opacity: borderOpacity }}
                className="absolute inset-0 rounded-3xl pointer-events-none"
                initial={false}
            >
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        border: `2px solid ${glowColor}`,
                        boxShadow: `inset 0 0 20px ${glowColor}40`
                    }}
                />
            </motion.div>
            <div className="w-full h-full">
                <LiquidCard {...item} />
            </div>
        </motion.div>
    );
};

export default function HorizontalScrollCarousel() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Smooth x transform - center each card at its peak time
    // Peak times: 0.3 (Card1), 0.55 (Card2), 0.8 (Card3)
    // Balanced values to keep cards visible while centering at peak
    const x = useTransform(
        scrollYProgress,
        [0, 0.15, 0.3, 0.42, 0.55, 0.67, 0.8, 0.9, 1],
        ["0%", "-3%", "-12%", "-20%", "-28%", "-38%", "-48%", "-54%", "-58%"]
    );

    return (
        <section ref={targetRef} className="relative h-[700vh] bg-[var(--background)]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-24 px-12 md:px-24">
                    {/* Intro Text */}
                    <div className="w-[80vw] md:w-[40vw] shrink-0 flex flex-col justify-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--foreground)]">
                            Three Steps to<br />Policy Clarity
                        </h2>
                        <p className="text-[var(--muted-foreground)] text-xl md:text-2xl max-w-md">
                            Scroll to see how PolicyWave takes you from confusion to confidence in minutes.
                        </p>
                    </div>

                    {/* The Cards */}
                    {items.map((item, i) => (
                        <CarouselItem
                            key={i}
                            item={item}
                            index={i}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
