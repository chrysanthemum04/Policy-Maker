"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-[102px] h-[36px] bg-[var(--secondary)] rounded-full animate-pulse" />
        );
    }

    return (
        <div className="flex items-center p-1 gap-1 bg-[var(--secondary)] border border-[var(--border)] rounded-full">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "light"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm scale-110"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                aria-label="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "system"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm scale-110"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                aria-label="System Mode"
            >
                <Monitor className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "dark"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm scale-110"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                aria-label="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
}
