'use client';

import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { newsItems } from '@/lib/data';
import { Newspaper, Calendar, Tag } from 'lucide-react';

export default function NewsPage() {
  const categoryColors: Record<string, string> = {
    AI: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    Tech: 'bg-green-600/20 text-green-400 border-green-600/30',
    Placements: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-blue-400" />
              Latest News
            </h1>
            <p className="text-gray-400">
              Stay updated with IT, AI, and placement trends
            </p>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {newsItems.map((news, idx) => (
              <Card
                key={news.id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Image Placeholder */}
                <div className="mb-4 h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-16 h-16 text-gray-600" />
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border ${categoryColors[news.category]
                      }`}
                  >
                    <Tag className="w-3 h-3" />
                    {news.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                  {news.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {news.summary}
                </p>

                {/* Date & Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(news.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
                    Read More →
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Subscribe Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Stay Informed
              </h3>
              <p className="text-gray-300 mb-6">
                Get the latest placement and tech news delivered to you
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
