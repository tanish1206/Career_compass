'use client';

import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { rankingData } from '@/lib/data';
import { TrendingUp, Trophy, Users } from 'lucide-react';

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Your Ranking</h1>
            <p className="text-gray-400">
              See how you compare with peers in your college
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300 text-sm">Your Percentile</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {rankingData.userPercentile}%
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-300 text-sm">College Rank</span>
              </div>
              <div className="text-4xl font-bold text-white">
                #{rankingData.collegeRank}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-purple-400" />
                <span className="text-gray-300 text-sm">Total Students</span>
              </div>
              <div className="text-4xl font-bold text-white">
                {rankingData.totalStudents}
              </div>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Performance Comparison
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Your Score</span>
                  <span className="font-semibold text-blue-400">
                    {rankingData.userPercentile}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full"
                    style={{ width: `${rankingData.userPercentile}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>College Average</span>
                  <span className="font-semibold text-gray-400">
                    {rankingData.collegeAverage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gray-500 h-3 rounded-full"
                    style={{ width: `${rankingData.collegeAverage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                You're performing{' '}
                <span className="font-semibold">
                  {rankingData.userPercentile - rankingData.collegeAverage}% better
                </span>{' '}
                than the college average. Keep up the great work!
              </p>
            </div>
          </Card>

          {/* Top Performers */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Top Performers
            </h2>

            <div className="space-y-3">
              {rankingData.topPerformers.map((performer, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0
                        ? 'bg-yellow-600 text-white'
                        : idx === 1
                          ? 'bg-gray-400 text-white'
                          : 'bg-orange-600 text-white'
                      }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <p className="text-white font-medium">{performer.name}</p>
                    <p className="text-gray-400 text-sm">{performer.college}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{performer.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Motivation */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
              <p className="text-lg text-gray-300">
                "Success is the sum of small efforts repeated day in and day out."
              </p>
              <p className="text-sm text-gray-400 mt-2">- Robert Collier</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
