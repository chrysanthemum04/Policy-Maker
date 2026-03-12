'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { InteractiveBackground } from '@/components/ui/InteractiveBackground';
import { ParallaxTilt } from '@/components/ui/ParallaxTilt';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <main className="relative min-h-screen text-[var(--foreground)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
      <InteractiveBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/30 group-hover:scale-105 transition-transform duration-300">
              ◆
            </div>
            <span className="text-xl font-bold tracking-tight">PolicyWave</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Simulate', 'Community', 'Experts'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-[var(--border)]" />
            <Link href="/login" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <button className="btn btn-primary text-sm px-5 py-2">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Living Gradient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 transition-colors duration-500" />
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.08] rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[var(--violet)] opacity-[0.08] rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        </div>

        <ParallaxTilt perspective={2000} intensity={10} className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Removed Beta Badge */}

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Understand policy.<br />
              <span className="text-gradient">Shape your future.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed">
              India&apos;s first comprehensive civic network. Simulate tax reforms, discuss bills with experts, and see the real impact of policy on your life.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <button className="btn btn-primary text-lg px-10 py-5 h-16 min-w-[200px] shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                  Get Started
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </ParallaxTilt>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-[var(--muted-foreground)]">Learn More</span>
          <ChevronDown className="w-6 h-6 animate-bounce text-[var(--muted-foreground)]" />
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Features that empower you
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            PolicyWave brings together cutting-edge simulation, expert insights, and a vibrant community to help you navigate India's policy landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "📊",
              title: "Policy Simulator",
              desc: "Calculate the exact impact of new tax regimes, GST changes, and subsidies on your income."
            },
            {
              icon: "💬",
              title: "Civic Community",
              desc: "Join high-quality discussions moderated by verified experts, not bots."
            },
            {
              icon: "🎓",
              title: "Expert Marketplace",
              desc: "Book 1:1 consultations with CAs, lawyers, and economists for personalized advice."
            }
          ].map((feature, i) => (
            <ParallaxTilt key={i} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group cursor-default h-full"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            </ParallaxTilt>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-[var(--muted-foreground)]">
            © 2026 PolicyWave. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="#" className="hover:text-[var(--foreground)]">Privacy</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Terms</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Contact</Link>
          </div>
        </div>
      </footer>
    </main >
  );
}
