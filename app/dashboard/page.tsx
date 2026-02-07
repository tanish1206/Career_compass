'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { defaultUserProfile, frontendRoadmap } from '@/lib/data';
import { Target, BookOpen, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [completedTopics, setCompletedTopics] = useState(0);

  useEffect(() => {
    // Load user profile from localStorage
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      const data = JSON.parse(stored);
      setUserProfile({ ...defaultUserProfile, ...data });
    }

    // Load completed roadmap items
    const roadmapData = localStorage.getItem('roadmapProgress');
    if (roadmapData) {
      const completed = JSON.parse(roadmapData).filter((item: any) => item.completed).length;
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

      <main className="pl-0 md:pl-0 p-6 md:p-8">
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Placement Readiness Score
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Based on your skills, projects, and roadmap completion
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {userProfile.readinessScore}%
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {userProfile.readinessScore >= 70
                      ? 'Great progress!'
                      : userProfile.readinessScore >= 50
                      ? 'Keep going!'
                      : 'Let\'s improve!'}
                  </p>
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
