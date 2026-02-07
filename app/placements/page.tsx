'use client';

import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { placementOpenings } from '@/lib/data';
import { Briefcase, MapPin, Calendar, DollarSign } from 'lucide-react';

export default function PlacementsPage() {
  const internships = placementOpenings.filter((p) => p.type === 'internship');
  const fullTime = placementOpenings.filter((p) => p.type === 'full-time');

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Placement Openings</h1>
            <p className="text-gray-400">
              Latest internship and full-time opportunities
            </p>
          </div>

          {/* Internships */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-green-400" />
              Internships
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {internships.map((opening, idx) => (
                <Card
                  key={opening.id}
                  hover
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {opening.role}
                      </h3>
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                        Internship
                      </span>
                    </div>
                    <p className="text-lg font-medium text-blue-400">
                      {opening.company}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {opening.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {opening.salary}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Deadline: {new Date(opening.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Apply Now
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Full-Time Positions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-400" />
              Full-Time Positions
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {fullTime.map((opening, idx) => (
                <Card
                  key={opening.id}
                  hover
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {opening.role}
                      </h3>
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30">
                        Full-Time
                      </span>
                    </div>
                    <p className="text-lg font-medium text-blue-400">
                      {opening.company}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {opening.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {opening.salary}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Deadline: {new Date(opening.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Apply Now
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-12">
            <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">
                📌 Application Tips
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Tailor your resume for each application</li>
                <li>• Prepare for technical interviews by practicing DSA problems</li>
                <li>• Research the company and role before applying</li>
                <li>• Build projects that showcase your skills</li>
                <li>• Apply early - don't wait for the deadline</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
