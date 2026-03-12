'use client';

import { motion } from 'framer-motion';
import { Calculator, Briefcase, Wheat, GraduationCap, Heart, Building2, Truck, ShoppingBag, UtensilsCrossed, Home, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const simulatorTemplates = [
    {
        id: 'income-tax',
        title: 'Income Tax Calculator',
        description: 'Compare old vs new tax regime. See your exact tax liability.',
        icon: Calculator,
        color: '#0244c8',
        popular: true
    },
    {
        id: 'gst-business',
        title: 'GST for Business',
        description: 'Calculate GST impact on your business operations.',
        icon: Briefcase,
        color: '#5187e4'
    },
    {
        id: 'farmer-subsidy',
        title: 'Farm Subsidies',
        description: 'Check eligibility for PM-KISAN, MSP benefits & more.',
        icon: Wheat,
        color: '#ba7b34',
        popular: true
    },
    {
        id: 'student-loans',
        title: 'Education Benefits',
        description: 'Scholarships, education loans & tax deductions.',
        icon: GraduationCap,
        color: '#fbcf0c'
    },
    {
        id: 'healthcare',
        title: 'Healthcare Savings',
        description: 'Section 80D, Ayushman Bharat eligibility.',
        icon: Heart,
        color: '#d7191f'
    },
    {
        id: 'startup',
        title: 'Startup Tax Benefits',
        description: 'Corporate tax, ESOP taxation & startup exemptions.',
        icon: Building2,
        color: '#0244c8'
    },
    {
        id: 'transport',
        title: 'Transport & Fuel',
        description: 'Fuel subsidy, EV incentives & road tax.',
        icon: Truck,
        color: '#ba7b34'
    },
    {
        id: 'ecommerce',
        title: 'E-commerce Seller',
        description: 'GST on online sales, TDS on marketplace.',
        icon: ShoppingBag,
        color: '#5187e4'
    },
    {
        id: 'restaurant',
        title: 'Restaurant Owner',
        description: 'GST on food services, FSSAI compliance.',
        icon: UtensilsCrossed,
        color: '#d7191f'
    },
    {
        id: 'real-estate',
        title: 'Property & Capital Gains',
        description: 'Home loan benefits, capital gains tax.',
        icon: Home,
        color: '#0244c8'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function SimulatorPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-[#ba7b34]" />
                    <span className="text-sm font-medium text-[#ba7b34]">Policy Simulator</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Simulate Your Policy Impact
                </h1>
                <p className="text-[var(--muted-foreground)]">
                    Choose a scenario to see how government policies affect your finances.
                </p>
            </motion.div>

            {/* Template Grid */}
            <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
                {simulatorTemplates.map((template, i) => (
                    <motion.div
                        key={template.id}
                        variants={itemVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={`/dashboard/simulator/${template.id}`}>
                            <div
                                className="relative glass-card p-6 cursor-pointer group h-full overflow-hidden border-[var(--border)] hover:border-opacity-50 transition-all"
                                style={{ borderColor: `${template.color}30` }}
                            >
                                {/* Hover glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 50% 100%, ${template.color}15 0%, transparent 70%)` }}
                                />

                                {template.popular && (
                                    <div
                                        className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-lg"
                                        style={{ backgroundColor: template.color }}
                                    >
                                        🔥 Popular
                                    </div>
                                )}

                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform"
                                    style={{
                                        backgroundColor: template.color,
                                        boxShadow: `0 8px 20px -8px ${template.color}60`
                                    }}
                                >
                                    <template.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                                    {template.title}
                                </h3>

                                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                                    {template.description}
                                </p>

                                <div className="flex items-center font-medium text-sm" style={{ color: template.color }}>
                                    Start simulation
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Custom Scenario CTA */}
            <motion.div
                variants={itemVariants}
                className="glass-card p-6 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ba7b34]/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-[#ba7b34]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--foreground)]">Don't see your scenario?</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">Create a custom policy simulation.</p>
                    </div>
                </div>
                <Link href="/dashboard/simulator/custom">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary px-6 py-2.5"
                    >
                        Create Custom
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
