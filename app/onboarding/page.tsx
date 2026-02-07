'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [domain, setDomain] = useState<'frontend' | 'backend' | 'fullstack'>('frontend');
  const [dsaLevel, setDsaLevel] = useState(3);
  const [coreCsLevel, setCoreCsLevel] = useState(3);
  const [frameworksLevel, setFrameworksLevel] = useState(3);
  const [projects, setProjects] = useState(0);
  const [timeline, setTimeline] = useState(90);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user data in localStorage (mock persistence)
    const userData = {
      domain,
      skillLevels: {
        dsa: dsaLevel * 20,
        coreCS: coreCsLevel * 20,
        frameworks: frameworksLevel * 20,
      },
      projectsCompleted: projects,
      placementTimeline: timeline,
      readinessScore: Math.round(((dsaLevel + coreCsLevel + frameworksLevel) / 15) * 100),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userData));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Let's Get Started
          </h1>
          <p className="text-gray-400">
            Tell us about yourself to personalize your learning journey
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Domain Selection */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 animate-slide-up">
            <label className="block text-lg font-semibold text-white mb-4">
              What's your target domain?
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['frontend', 'backend', 'fullstack'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDomain(d)}
                  className={`py-3 px-4 rounded-lg font-medium capitalize transition-all ${
                    domain === d
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-[var(--background)] text-gray-300 border border-[var(--border)] hover:border-blue-500/50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Levels */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Rate your current skill levels
            </h3>

            <SkillRating
              label="Data Structures & Algorithms (DSA)"
              value={dsaLevel}
              onChange={setDsaLevel}
            />
            <SkillRating
              label="Core CS Fundamentals"
              value={coreCsLevel}
              onChange={setCoreCsLevel}
            />
            <SkillRating
              label="Frameworks & Tools"
              value={frameworksLevel}
              onChange={setFrameworksLevel}
            />
          </div>

          {/* Projects Completed */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              How many projects have you completed?
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={projects}
              onChange={(e) => setProjects(parseInt(e.target.value) || 0)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Placement Timeline */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              Placement timeline (days until placements)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              value={timeline}
              onChange={(e) => setTimeline(parseInt(e.target.value) || 90)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-sm text-gray-400 mt-2">
              Approximately {Math.round(timeline / 30)} months from now
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function SkillRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-gray-400 text-sm self-center">
          {value === 1 && 'Beginner'}
          {value === 2 && 'Basic'}
          {value === 3 && 'Intermediate'}
          {value === 4 && 'Advanced'}
          {value === 5 && 'Expert'}
        </span>
      </div>
    </div>
  );
}
