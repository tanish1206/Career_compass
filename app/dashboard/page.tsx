'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { ParticleCard, GlobalSpotlight } from '@/components/MagicBento';
import { Target, TrendingUp, FileText, Award, BookOpen, AlertCircle } from 'lucide-react';
import { getUserState, getDerivedMetrics } from '@/lib/userState';
import { UserState, DerivedMetrics } from '@/lib/types/userState';

export default function DashboardPage() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [metrics, setMetrics] = useState<DerivedMetrics | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const statsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const state = await getUserState();
        setUserState(state);

        const derivedMetrics = getDerivedMetrics(state);
        setMetrics(derivedMetrics);

        console.log('✅ Loaded user state from central data layer');
        console.log('📊 Readiness Score:', derivedMetrics.readinessScore);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }

    loadDashboardData();
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading state if data not loaded yet
  if (!userState || !metrics) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userState.profile.name}! 👋
            </h1>
            <p className="text-gray-400">
              Here's your placement preparation progress
            </p>
          </div>

          {/* Readiness Score - Highlight */}
          <div className="mb-8 animate-slide-up">
            <ParticleCard
              disableAnimations={false}
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Placement Readiness Score
                    </h2>
                    <p className="text-gray-300 text-base mb-4">
                      Based on your skills, projects, and roadmap completion
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-600/30">
                        {metrics.completedTopicsCount}/{metrics.totalTopicsCount} Topics Complete
                      </span>
                      <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 text-sm rounded-full border border-cyan-600/30">
                        {metrics.completedProjectsCount} Projects
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {/* Circular progress background */}
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-700"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - metrics.readinessScore / 100)}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Score text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {metrics.readinessScore}%
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {metrics.readinessScore >= 70
                            ? 'Excellent!'
                            : metrics.readinessScore >= 50
                              ? 'Keep going!'
                              : 'Getting started'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </ParticleCard>
          </div>

          {/* Stats Grid */}
          <div ref={statsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative bento-section">
            <GlobalSpotlight
              gridRef={statsGridRef}
              enabled={!isMobile}
              spotlightRadius={200}
              glowColor="59, 130, 246"
              disableAnimations={isMobile}
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              label="Domain"
              value={userState.profile.role}
              color="blue"
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              label="Projects Completed"
              value={metrics.completedProjectsCount}
              color="green"
            />
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              label="Roadmap Progress"
              value={`${metrics.completedTopicsCount}/${metrics.totalTopicsCount}`}
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Days to Placement"
              value={90} // TODO: Add placement timeline to UserState
              color="orange"
            />
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Skill Levels */}
            <ParticleCard
              disableAnimations={false}
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Skill Levels
                </h3>
                <div className="space-y-4">
                  <ProgressBar
                    label="Data Structures & Algorithms"
                    value={userState.skills.dsa}
                    color="blue"
                  />
                  <ProgressBar
                    label="Core CS Fundamentals"
                    value={userState.skills.fundamentals}
                    color="green"
                  />
                  <ProgressBar
                    label="Frameworks & Tools"
                    value={userState.skills.projects}
                    color="yellow"
                  />
                </div>
              </Card>
            </ParticleCard>

            {/* Roadmap Overview */}
            <ParticleCard
              disableAnimations={false}
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-6">
                  Learning Roadmap
                </h3>
                {metrics.completedTopicsCount === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-400 mb-4">
                      You haven't started any topics yet
                    </p>
                    <Link
                      href="/roadmap"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium"
                    >
                      Start Learning
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <ProgressBar
                        label="Overall Completion"
                        value={metrics.roadmapProgress}
                        color="blue"
                      />
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      You've completed {metrics.completedTopicsCount} out of {metrics.totalTopicsCount} topics
                    </p>
                    <Link
                      href="/roadmap"
                      className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      View Full Roadmap
                    </Link>
                  </>
                )}
              </Card>
            </ParticleCard>
          </div>


          {/* Weakness Alert & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weakness Alert */}
            <ParticleCard
              disableAnimations={false}
              particleCount={10}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="234, 179, 8"
            >
              <Card className="border-yellow-500/30 bg-yellow-900/10">
                <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Focus Area
                    </h3>
                    <p className="text-gray-300 mb-3">
                      Your weakest skill is <span className="font-semibold text-yellow-400">{metrics.weakestSkill.name}</span> at {metrics.weakestSkill.value}%
                    </p>
                    <Link
                      href="/resources"
                      className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      Find Resources
                    </Link>
                  </div>
                </div>
              </Card>
            </ParticleCard>

            {/* Quick Actions */}
            <ParticleCard
              disableAnimations={false}
              particleCount={10}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/mock-tests"
                    className="block bg-[var(--background)] hover:bg-[var(--card-hover)] border border-[var(--border)] hover:border-blue-500/30 rounded-lg p-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Take Mock Test</span>
                    </div>
                  </Link>
                  <Link
                    href="/roadmap"
                    className="block bg-[var(--background)] hover:bg-[var(--card-hover)] border border-[var(--border)] hover:border-blue-500/30 rounded-lg p-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Continue Learning</span>
                    </div>
                  </Link>
                </div>
              </Card>
            </ParticleCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <ParticleCard
      disableAnimations={false}
      particleCount={12}
      enableTilt={false}
      clickEffect={true}
      enableMagnetism={true}
      glowColor="59, 130, 246"
    >
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className={colorClasses[color]}>{icon}</div>
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white capitalize">{value}</div>
      </Card>
    </ParticleCard>
  );
}
