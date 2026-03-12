"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function InteractiveBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}
        >
            {/* Mouse Follower Gradient */}
            <div
                className="absolute w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-15 transition-opacity duration-500 will-change-transform"
                style={{
                    background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.4)'
                        } 0%, transparent 60%)`,
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Ambient Floating Orbs */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-violet-500/20 blur-[130px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[130px] animate-float" style={{ animationDelay: "-4s" }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />
        </div>
    );
}
