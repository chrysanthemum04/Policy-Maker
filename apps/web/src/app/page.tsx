/**
 * Landing Page - Exact replica of PolicyPulse HTML design
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'government' | 'expert' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: '',
    organization: '',
    bio: '',
    termsAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: selectedRole,
      });
      // Redirect is handled by AuthContext
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <div className="relative flex h-auto w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Top Navigation Bar */}
        <div className="px-4 md:px-20 lg:px-40 flex justify-center py-5 border-b border-solid border-primary/10">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-4 py-3">
              <div className="flex items-center gap-4 text-primary">
                <div className="size-8">
                  <Image src="/logo.png" alt="PolicyWave" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-xl font-bold leading-tight tracking-[-0.015em] font-display">
                  PolicyWave
                </h2>
              </div>
              <div className="flex flex-1 justify-end gap-8 items-center">
                <div className="hidden md:flex items-center gap-9">
                  <a className="text-[#1c0c0e] dark:text-[#fcf8f8] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#about">
                    About
                  </a>
                  <a className="text-[#1c0c0e] dark:text-[#fcf8f8] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#features">
                    Features
                  </a>
                  <a className="text-[#1c0c0e] dark:text-[#fcf8f8] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#simulations">
                    Simulations
                  </a>
                  <a className="text-[#1c0c0e] dark:text-[#fcf8f8] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#expertise">
                    Expertise
                  </a>
                </div>
                <div className="flex gap-3">
                  <Link href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary/20 bg-transparent text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/5">
                    <span className="truncate">Login</span>
                  </Link>
                  <button onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                    <span className="truncate">Sign Up</span>
                  </button>
                </div>
              </div>
            </header>
          </div>
        </div>

        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <div className="px-4 md:px-20 lg:px-40 flex justify-center py-10 w-full">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              <div className="flex flex-col gap-6 px-4 py-10 md:gap-12 md:flex-row items-center">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-xl md:w-1/2 overflow-hidden border border-primary/10"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQJ9vWhdaCnj_uL-MSgVTCASHKooxgEcaw6fUaRSbG285Itn84LqXWyefsH3t3IUDFntP7gGekSRuIiKiveSOfQiF9atb3eyjtXxlSlBDWtJZ4d2CSIcvkWpaC6tiyfPwZEcglz9QDKLWLhRFKg_Sy14clis4AGMGQnX0CTMxY4ftYWTy33qYIU4Qpf3Qy0ULPXdTZZ7lWq-8fS6m2G22U71rXim-hJWK0YoJAPMUcAzXchfa6R6wyuiImnUOW1dopZ2K0jsJm5Ydx")'
                  }}
                />
                <div className="flex flex-col gap-6 md:w-1/2 justify-center">
                  <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl font-display">
                      Shape the Future of Governance.
                    </h1>
                    <h2 className="text-[#1c0c0e]/80 dark:text-[#fcf8f8]/80 text-lg font-normal leading-relaxed max-w-lg">
                      Engage in real-time policy simulations and collaborate with experts to build better communities through data-driven decisions.
                    </h2>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-md">
                      <span className="truncate">Get Started</span>
                    </button>
                    <button onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })} className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary/10 text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/20 transition-all">
                      <span className="truncate">Learn More</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection Section */}
          <div id="roles" className="px-4 md:px-20 lg:px-40 flex justify-center py-12 w-full bg-primary/5 dark:bg-white/5">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              <div className="text-center mb-10 px-4">
                <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
                  Choose Your Role
                </h2>
                <p className="text-[#1c0c0e]/60 dark:text-[#fcf8f8]/60 mt-2">
                  Select how you want to contribute to the PolicyWave ecosystem.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                {/* Citizen Card */}
                <div
                  onClick={() => {
                    setSelectedRole('citizen');
                    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group flex flex-1 gap-5 rounded-xl border p-8 flex-col hover:border-primary hover:shadow-lg transition-all cursor-pointer ${selectedRole === 'citizen' ? 'border-primary shadow-lg bg-primary/5' : 'border-primary/10 bg-background-light dark:bg-background-dark'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'citizen' ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <span className="material-symbols-outlined text-3xl">groups</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-xl font-bold leading-tight font-display">
                      Citizen
                    </h2>
                    <p className="text-[#1c0c0e]/70 dark:text-[#fcf8f8]/70 text-sm font-normal leading-relaxed">
                      Voice your opinion, vote on initiatives, and participate in local or national policy simulations.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm">
                    {selectedRole === 'citizen' ? 'Selected' : 'Select Role'}
                    <span className="material-symbols-outlined ml-2 text-sm">
                      {selectedRole === 'citizen' ? 'check_circle' : 'arrow_forward'}
                    </span>
                  </div>
                </div>

                {/* Government Card */}
                <div
                  onClick={() => {
                    setSelectedRole('government');
                    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group flex flex-1 gap-5 rounded-xl border p-8 flex-col hover:border-primary hover:shadow-lg transition-all cursor-pointer ${selectedRole === 'government' ? 'border-primary shadow-lg bg-primary/5' : 'border-primary/10 bg-background-light dark:bg-background-dark'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'government' ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <span className="material-symbols-outlined text-3xl">account_balance</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-xl font-bold leading-tight font-display">
                      Government
                    </h2>
                    <p className="text-[#1c0c0e]/70 dark:text-[#fcf8f8]/70 text-sm font-normal leading-relaxed">
                      Model policy impacts, run scenario analysis, and engage directly with your constituents through data.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm">
                    {selectedRole === 'government' ? 'Selected' : 'Select Role'}
                    <span className="material-symbols-outlined ml-2 text-sm">
                      {selectedRole === 'government' ? 'check_circle' : 'arrow_forward'}
                    </span>
                  </div>
                </div>

                {/* Expert Card */}
                <div
                  onClick={() => {
                    setSelectedRole('expert');
                    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group flex flex-1 gap-5 rounded-xl border p-8 flex-col hover:border-primary hover:shadow-lg transition-all cursor-pointer ${selectedRole === 'expert' ? 'border-primary shadow-lg bg-primary/5' : 'border-primary/10 bg-background-light dark:bg-background-dark'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'expert' ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-xl font-bold leading-tight font-display">
                      Expert
                    </h2>
                    <p className="text-[#1c0c0e]/70 dark:text-[#fcf8f8]/70 text-sm font-normal leading-relaxed">
                      Provide data-driven insights, peer-review simulations, and validate complex policy frameworks.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm">
                    {selectedRole === 'expert' ? 'Selected' : 'Select Role'}
                    <span className="material-symbols-outlined ml-2 text-sm">
                      {selectedRole === 'expert' ? 'check_circle' : 'arrow_forward'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Form Section */}
          <div id="signup-form" className="px-4 md:px-20 lg:px-40 flex justify-center py-20 w-full">
            <div className="layout-content-container flex flex-col max-w-[800px] flex-1 bg-white dark:bg-[#1c0c0e] rounded-2xl shadow-2xl p-8 md:p-12 border border-primary/5">
              <div className="mb-10 text-center">
                <h2 className="text-[#1c0c0e] dark:text-[#fcf8f8] text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
                  Join the Wave
                </h2>
                <p className="text-[#1c0c0e]/60 dark:text-[#fcf8f8]/60 mt-2">
                  Complete your profile to get started.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Full Name</label>
                    <input
                      className="h-12 px-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="John Doe"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Work Email</label>
                    <input
                      className="h-12 px-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="john@example.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Password</label>
                    <input
                      className="h-12 px-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Min. 8 characters"
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Location</label>
                    <div className="relative">
                      <input
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="City, Country"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                      <span className="material-symbols-outlined absolute left-4 top-3 text-[#1c0c0e]/40">location_on</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Organization / Affiliation</label>
                    <input
                      className="h-12 px-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="University, Agency, etc."
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-[#1c0c0e] dark:text-[#fcf8f8]">Brief Biography</label>
                  <textarea
                    className="p-4 rounded-lg bg-background-light dark:bg-[#2c1316] border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Tell us about your background in policy or community engagement..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div className="flex items-start gap-3 mt-2">
                  <input
                    className="mt-1 rounded border-primary/20 text-primary focus:ring-primary"
                    id="terms"
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  />
                  <label className="text-sm text-[#1c0c0e]/70 dark:text-[#fcf8f8]/70" htmlFor="terms">
                    I agree to the <a className="text-primary font-bold underline" href="#">Terms of Service</a> and <a className="text-primary font-bold underline" href="#">Privacy Policy</a> regarding data simulation usage.
                  </label>
                </div>
                <button
                  className="flex w-full items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={!selectedRole}
                >
                  <span className="truncate">Create Account</span>
                </button>
                <p className="text-center text-sm text-[#1c0c0e]/60 dark:text-[#fcf8f8]/60">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-20 lg:px-40 py-10 border-t border-primary/10 bg-background-light dark:bg-background-dark">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-primary">
              <Image src="/logo.png" alt="PolicyWave" width={24} height={24} className="w-6 h-6 object-contain" />
              <span className="font-bold font-display">PolicyWave</span>
            </div>
            <div className="flex gap-8 text-sm text-[#1c0c0e]/60 dark:text-[#fcf8f8]/60">
              <a className="hover:text-primary" href="#">Privacy</a>
              <a className="hover:text-primary" href="#">Terms</a>
              <a className="hover:text-primary" href="#">Cookie Policy</a>
              <a className="hover:text-primary" href="#">Contact</a>
            </div>
            <div className="text-xs text-[#1c0c0e]/40 dark:text-[#fcf8f8]/40">
              © 2024 PolicyWave Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
