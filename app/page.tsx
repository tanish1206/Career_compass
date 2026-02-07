import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Career Compass
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Your AI-Powered Placement Preparation Partner
            </p>
          </div>

          {/* Value Proposition */}
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Navigate your placement journey with confidence. Get personalized roadmaps,
            track your progress, take mock tests, and calculate your Placement Readiness
            Score - all in one place.
          </p>

          {/* CTA Button */}
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Start My Journey
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Alternative Links */}
          <div className="mt-8 flex gap-6 justify-center text-sm">
            <Link
              href="/login"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Personalized Roadmap"
            description="Custom learning paths based on your domain and skill level"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Progress Tracking"
            description="Real-time monitoring of your preparation journey"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Mock Tests"
            description="Topic-wise assessments to validate your knowledge"
          />
          <FeatureCard
            icon={<Award className="w-8 h-8" />}
            title="Readiness Score"
            description="AI-calculated score to measure placement readiness"
          />
        </div>

        {/* Problem Statement */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for Tier-2/3 College Students
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We understand the challenges of placement preparation - lack of clarity,
            structure, and feedback. Career Compass brings together everything you need
            to succeed, with AI-powered insights and a clear path forward.
          </p>
        </div>
      </div>
    </main>
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
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
