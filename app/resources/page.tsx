'use client';

import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { resources } from '@/lib/data';
import { BookOpen, ExternalLink, DollarSign } from 'lucide-react';

export default function ResourcesPage() {
  // Group resources by topic
  const resourcesByTopic = resources.reduce((acc, resource) => {
    if (!acc[resource.topic]) {
      acc[resource.topic] = [];
    }
    acc[resource.topic].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const topics = Object.keys(resourcesByTopic);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="pl-0 md:pl-0 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Learning Resources</h1>
            <p className="text-gray-400">
              Curated resources to help you master each topic
            </p>
          </div>

          {/* Resources by Topic */}
          <div className="space-y-8">
            {topics.map((topic, idx) => (
              <div
                key={topic}
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  {topic === 'javascript' ? 'JavaScript' : topic}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {resourcesByTopic[topic].map((resource) => (
                    <Card key={resource.id} hover>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-white flex-1">
                          {resource.title}
                        </h3>
                        {resource.type === 'paid' ? (
                          <span className="flex-shrink-0 px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded border border-yellow-600/30 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="flex-shrink-0 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded border border-green-600/30">
                            Free
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-4">
                        {resource.description}
                      </p>

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                      >
                        Visit Resource
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
              <h3 className="text-xl font-semibold text-white mb-3">
                💡 Learning Tips
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Start with free resources before investing in paid courses</li>
                <li>• Practice while learning - theory alone isn't enough</li>
                <li>• Take notes and build projects to reinforce concepts</li>
                <li>• Join developer communities for support and networking</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
