'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Target, TrendingUp, BookOpen, Award, CheckCircle2, Zap, BarChart3, X, Eye } from 'lucide-react';
import ScrambledText from '@/components/ScrambledText';
import LiquidChrome from '@/components/LiquidChrome';

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domain: 'frontend' as 'frontend' | 'backend' | 'fullstack',
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear demo mode for real users
    localStorage.removeItem('demo_mode');

    if (isSignUp) {
      // Sign Up: Create new user state
      const newUserState = {
        userId: `user-${Date.now()}`,
        profile: {
          name: formData.name,
          email: formData.email,
          role: formData.domain === 'frontend' ? 'Frontend Developer' :
            formData.domain === 'backend' ? 'Backend Developer' : 'Full Stack Developer',
          college: '',
        },
        skills: {
          dsa: 0,
          projects: 0,
          fundamentals: 0,
          softSkills: 0,
        },
        roadmap: {
          topics: [],
          source: 'default' as const,
          lastUpdated: new Date().toISOString(),
        },
        projects: [],
        mockTests: [],
        metadata: {
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          version: '1.0',
        },
      };

      localStorage.setItem('career_compass_user_state', JSON.stringify(newUserState));
    } else {
      // Sign In: Check if user exists
      const existingUser = localStorage.getItem('career_compass_user_state');
      if (!existingUser) {
        alert('No account found. Please sign up first!');
        setIsSignUp(true);
        return;
      }
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleDemoMode = () => {
    // Set demo mode flag
    localStorage.setItem('demo_mode', 'true');
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 relative overflow-hidden">
      {/* Liquid Chrome Background - Blue Theme */}
      <div className="fixed inset-0 z-0 opacity-60">
        <LiquidChrome
          baseColor={[0.05, 0.1, 0.25]}
          speed={0.4}
          amplitude={0.5}
          frequencyX={3}
          frequencyY={2}
          interactive={true}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-md w-full p-8 relative animate-fade-in">
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-400 mb-6">
                {isSignUp
                  ? 'Start your placement preparation journey'
                  : 'Continue your learning path'}
              </p>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Choose Your Domain
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="frontend">Frontend Development</option>
                      <option value="backend">Backend Development</option>
                      <option value="fullstack">Full-Stack Development</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </button>
              </div>

              {/* Demo Mode Button */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--card)] text-gray-400">Or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Try Demo Mode
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Explore the app with pre-populated demo data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="container mx-auto px-4 min-h-screen flex items-center justify-center relative">
          <div className="text-center max-w-[900px] mx-auto py-20 relative z-10">

            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-300 tracking-wide">AI-POWERED PLACEMENT PREPARATION</span>
            </div>

            {/* Main Headline - ONLY use ScrambledText here */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 bg-clip-text text-transparent">
                <ScrambledText
                  className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 mx-auto tracking-tight leading-none"
                  radius={200}
                  duration={0.6}
                  scrambleChars="!@#$%^&*"
                  style={{
                    margin: '0 auto',
                    maxWidth: '100%',
                  }}
                >
                  Career Compass
                </ScrambledText>
              </div>

              {/* Subheadline - NO scrambled text */}
              <h2 className="text-xl md:text-3xl text-slate-200 font-light tracking-wide leading-relaxed">
                Your Personalized Path to Placement Success
              </h2>
            </div>

            {/* Supporting Paragraph - NO scrambled text, NO gradients */}
            <p className="text-base md:text-lg text-slate-300 mb-12 max-w-[700px] mx-auto leading-relaxed tracking-wide">
              Stop guessing what to learn next. Get a personalized roadmap, track your progress in real-time, and know exactly how placement-ready you are.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-white px-12 py-4 rounded-full text-base font-bold hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
              >
                Start Your Journey Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badge */}
              <p className="text-sm text-slate-400 font-light">
                No credit card required • Built for tier-2/3 students
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text mb-4 drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              How It Works
            </h2>
            <p className="text-gray-300 text-xl font-light">
              Three simple steps to placement success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksStep
              number="1"
              icon={<Target className="w-8 h-8" />}
              title="Choose Your Path"
              description="Select your domain (Frontend, Backend, or Full-Stack) and we'll create a personalized learning roadmap tailored to your goals."
            />
            <HowItWorksStep
              number="2"
              icon={<Zap className="w-8 h-8" />}
              title="Learn & Verify"
              description="Follow your roadmap, complete topics, and take verification tests to prove your knowledge. Unlock new topics as you progress."
            />
            <HowItWorksStep
              number="3"
              icon={<BarChart3 className="w-8 h-8" />}
              title="Track Readiness"
              description="Watch your Placement Readiness Score grow. Know exactly where you stand and what to focus on next."
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400">
              All the tools to go from confused to confident
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Personalized Roadmap"
              description="No more confusion about what to learn next. Get a clear, step-by-step path based on your domain."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Progress Tracking"
              description="See your growth in real-time. Track completed topics, test scores, and skill improvements."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Verification Tests"
              description="Prove you've mastered each topic with quick 5-question tests. Pass to unlock the next level."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Readiness Score"
              description="Know if you're placement-ready. AI-powered score tells you exactly where you stand."
            />
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-32 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for Tier-2/3 College Students
          </h2>
          <ScrambledText
            className="text-gray-400 text-lg leading-relaxed mb-8 mx-auto max-w-3xl"
            radius={120}
            duration={0.7}
            scrambleChars="!@#$"
          >
            We understand the challenges: lack of clarity on what to learn, no structure, and zero feedback on your progress. Career Compass solves all three with personalized roadmaps, structured learning paths, and AI-powered insights.
          </ScrambledText>

          {/* Benefits List */}
          <div className="grid md:grid-cols-2 gap-4 text-left mt-8">
            <BenefitItem text="Clear roadmap—no more guessing" />
            <BenefitItem text="Track progress in real-time" />
            <BenefitItem text="Verify knowledge with tests" />
            <BenefitItem text="Know your placement readiness" />
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center pb-20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Placement-Ready?
          </h2>
          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/40"
          >
            Start Learning Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function HowItWorksStep({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      {/* Number Badge */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {number}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 hover:border-blue-500/30 transition-all h-full">
        <div className="text-blue-400 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <ScrambledText
          className="text-gray-400 leading-relaxed"
          radius={100}
          duration={0.6}
          scrambleChars="!@#"
        >
          {description}
        </ScrambledText>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover:border-blue-500/30 hover:bg-[var(--card-hover)] transition-all group">
      <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <ScrambledText
        className="text-gray-400 text-sm leading-relaxed"
        radius={80}
        duration={0.5}
        scrambleChars="!@#"
      >
        {description}
      </ScrambledText>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
      <span className="text-gray-300">{text}</span>
    </div>
  );
}
