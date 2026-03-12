'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Lock, Palette, Globe, CreditCard, Shield, ChevronRight, Moon, Sun, Check, Mail, Smartphone, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        newsletter: true,
        policyUpdates: true,
        communityDigest: false
    });
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, color: '#0244c8' },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: '#ba7b34' },
        { id: 'security', label: 'Security', icon: Lock, color: '#d7191f' },
        { id: 'appearance', label: 'Appearance', icon: Palette, color: '#5187e4' },
        { id: 'billing', label: 'Billing', icon: CreditCard, color: '#22c55e' },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-6 h-6 text-[#5187e4]" />
                    <span className="text-sm font-medium text-[#5187e4]">Account Settings</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </motion.div>

            {/* Settings Grid */}
            <div className="grid lg:grid-cols-[240px_1fr] gap-6">
                {/* Tabs Sidebar */}
                <motion.div variants={itemVariants} className="glass-card p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                    ? 'text-white shadow-lg'
                                    : 'text-[var(--foreground)] hover:bg-[var(--muted)]/30'
                                    }`}
                                style={activeTab === tab.id ? { backgroundColor: tab.color } : {}}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div variants={itemVariants} className="glass-card p-6">
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Profile Information</h2>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0244c8] to-[#5187e4] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {user?.fullName?.[0] || 'U'}
                                </div>
                                <div>
                                    <button className="px-4 py-2 rounded-xl bg-[#0244c8] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                                        Upload Photo
                                    </button>
                                    <p className="text-xs text-[var(--muted-foreground)] mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.fullName || ''}
                                        className="glass-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="glass-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+91 98765 43210"
                                        className="glass-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Location</label>
                                    <select className="glass-input">
                                        <option>Maharashtra</option>
                                        <option>Karnataka</option>
                                        <option>Delhi</option>
                                        <option>Tamil Nadu</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Profession</label>
                                    <select className="glass-input">
                                        <option>Salaried Employee</option>
                                        <option>Business Owner</option>
                                        <option>Freelancer</option>
                                        <option>Student</option>
                                        <option>Farmer</option>
                                        <option>Retired</option>
                                    </select>
                                </div>
                            </div>

                            <button className="btn btn-primary px-6 py-2.5">Save Changes</button>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div variants={itemVariants} className="glass-card p-6">
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                {[
                                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
                                    { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS', icon: Smartphone },
                                    { key: 'newsletter', label: 'Weekly Newsletter', desc: 'Policy news digest', icon: Mail },
                                    { key: 'policyUpdates', label: 'Policy Updates', desc: 'New policy announcements', icon: Globe },
                                    { key: 'communityDigest', label: 'Community Digest', desc: 'Top discussions summary', icon: User }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#ba7b34]/20 flex items-center justify-center">
                                                <item.icon className="w-5 h-5 text-[#ba7b34]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">{item.label}</p>
                                                <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={`w-12 h-7 rounded-full transition-all ${notifications[item.key as keyof typeof notifications]
                                                ? 'bg-[#22c55e]'
                                                : 'bg-[var(--muted)]'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Security Settings</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#d7191f]/20 flex items-center justify-center">
                                                <Lock className="w-5 h-5 text-[#d7191f]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">Change Password</p>
                                                <p className="text-sm text-[var(--muted-foreground)]">Last changed 30 days ago</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#0244c8]/20 flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-[#0244c8]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">Two-Factor Authentication</p>
                                                <p className="text-sm text-[#22c55e]">Enabled</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#5187e4]/20 flex items-center justify-center">
                                                <Smartphone className="w-5 h-5 text-[#5187e4]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--foreground)]">Active Sessions</p>
                                                <p className="text-sm text-[var(--muted-foreground)]">3 devices logged in</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 border-[#d7191f]/30">
                                <h3 className="text-lg font-bold text-[#d7191f] mb-4">Danger Zone</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-[var(--foreground)]">Delete Account</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Permanently delete your account and all data</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl border border-[#d7191f] text-[#d7191f] text-sm font-medium hover:bg-[#d7191f]/10 transition-colors">
                                        <Trash2 className="w-4 h-4 inline-block mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <motion.div variants={itemVariants} className="glass-card p-6">
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Appearance</h2>

                            <div className="mb-8">
                                <label className="block font-medium text-[var(--foreground)] mb-4">Theme</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { key: 'light', label: 'Light', icon: Sun },
                                        { key: 'dark', label: 'Dark', icon: Moon },
                                        { key: 'system', label: 'System', icon: Settings }
                                    ].map((option) => (
                                        <button
                                            key={option.key}
                                            onClick={() => setTheme(option.key as any)}
                                            className={`p-4 rounded-xl border-2 transition-all ${theme === option.key
                                                ? 'border-[#0244c8] bg-[#0244c8]/10'
                                                : 'border-[var(--border)] hover:border-[var(--primary)]/30'
                                                }`}
                                        >
                                            <option.icon className={`w-8 h-8 mx-auto mb-2 ${theme === option.key ? 'text-[#0244c8]' : 'text-[var(--muted-foreground)]'}`} />
                                            <p className={`text-sm font-medium ${theme === option.key ? 'text-[#0244c8]' : 'text-[var(--foreground)]'}`}>{option.label}</p>
                                            {theme === option.key && (
                                                <Check className="w-4 h-4 text-[#0244c8] mx-auto mt-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-[var(--foreground)] mb-4">Language</label>
                                <select className="glass-input max-w-xs">
                                    <option>English</option>
                                    <option>हिन्दी (Hindi)</option>
                                    <option>தமிழ் (Tamil)</option>
                                    <option>తెలుగు (Telugu)</option>
                                    <option>বাংলা (Bengali)</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Current Plan</h2>
                                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-[#0244c8] to-[#5187e4] text-white">
                                    <div>
                                        <p className="text-white/80 text-sm">Your Plan</p>
                                        <p className="text-2xl font-bold">Free Plan</p>
                                        <p className="text-white/80 text-sm mt-1">Basic access to policy simulations</p>
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-white text-[#0244c8] font-medium hover:opacity-90 transition-opacity">
                                        Upgrade to Pro
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="font-bold text-[var(--foreground)] mb-4">Payment Methods</h3>
                                <p className="text-[var(--muted-foreground)] text-sm mb-4">No payment methods added yet.</p>
                                <button className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--muted)]/30 transition-colors">
                                    + Add Payment Method
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
