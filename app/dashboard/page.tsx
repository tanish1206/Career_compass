'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { defaultUserProfile, frontendRoadmap, getUserProfile, getRoadmapProgress } from '@/lib/data';
import { Target, BookOpen, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [completedTopics, setCompletedTopics] = useState(0);

  useEffect(() => {
    // Load user profile using storage helper
    const profile = getUserProfile();
    setUserProfile(profile);

    // Load completed roadmap items using storage helper
    const roadmapData = getRoadmapProgress();
    if (roadmapData) {
      const completed = roadmapData.filter((item) => item.completed).length;
      setCompletedTopics(completed);
    }
  }, []);

  const totalTopics = frontendRoadmap.length;
  const roadmapProgress = (completedTopics / totalTopics) * 100;

  // Find weakest skill
  const skills = [
    { name: 'DSA', value: userProfile.skillLevels.dsa },
    { name: 'Core CS', value: userProfile.skillLevels.coreCS },
    { name: 'Frameworks', value: userProfile.skillLevels.frameworks },
  ];
  const weakestSkill = skills.reduce((prev, current) =>
    prev.value < current.value ? prev : current
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-400">
              Here's your placement preparation progress
            </p>
          </div>

          {/* Readiness Score - Highlight */}
          <div className="mb-8 animate-slide-up">
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
                      {completedTopics}/{totalTopics} Topics Complete
                    </span>
                    <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 text-sm rounded-full border border-cyan-600/30">
                      {userProfile.projectsCompleted} Projects
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
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - userProfile.readinessScore / 100)}`}
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
                        {userProfile.readinessScore}%
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {userProfile.readinessScore >= 70
                          ? 'Excellent!'
                          : userProfile.readinessScore >= 50
                            ? 'Keep going!'
                            : 'Getting started'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Target className="w-6 h-6" />}
              label="Domain"
              value={userProfile.domain}
              color="blue"
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              label="Projects Completed"
              value={userProfile.projectsCompleted}
              color="green"
            />
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              label="Roadmap Progress"
              value={`${completedTopics}/${totalTopics}`}
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Days to Placement"
              value={userProfile.placementTimeline}
              color="orange"
            />
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Skill Levels */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Skill Levels
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  label="Data Structures & Algorithms"
                  value={userProfile.skillLevels.dsa}
                  color="blue"
                />
                <ProgressBar
                  label="Core CS Fundamentals"
                  value={userProfile.skillLevels.coreCS}
                  color="green"
                />
                <ProgressBar
                  label="Frameworks & Tools"
                  value={userProfile.skillLevels.frameworks}
                  color="yellow"
                />
              </div>
            </Card>

            {/* Roadmap Overview */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">
                Learning Roadmap
              </h3>
              {completedTopics === 0 ? (
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
                      value={roadmapProgress}
                      color="blue"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    You've completed {completedTopics} out of {totalTopics} topics
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
          </div>

          {/* Weakness Alert & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weakness Alert */}
            <Card className="border-yellow-500/30 bg-yellow-900/10">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Focus Area
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Your weakest skill is <span className="font-semibold text-yellow-400">{weakestSkill.name}</span> at {weakestSkill.value}%
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

            {/* Quick Actions */}
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
    <Card>
      <div className="flex items-center gap-3 mb-3">
        <div className={colorClasses[color]}>{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white capitalize">{value}</div>
    </Card>
  );
}
