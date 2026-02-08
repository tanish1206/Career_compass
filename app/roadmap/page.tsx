'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { ParticleCard, GlobalSpotlight } from '@/components/MagicBento';
import RoadmapChatbot from '@/components/RoadmapChatbot';
import { frontendRoadmap, mockQuestions, RoadmapNode } from '@/lib/data';
import { getRoadmap, saveRoadmap } from '@/lib/supabase/roadmaps';
import {
  CheckCircle2,
  Circle,
  X,
  Globe,
  Code,
  Palette,
  Zap,
  GitBranch,
  Component,
  Sparkles
} from 'lucide-react';

/* -------------------------------- Icons -------------------------------- */
const topicIcons: Record<string, React.ReactNode> = {
  internet: <Globe className="w-6 h-6" />,
  html: <Code className="w-6 h-6" />,
  css: <Palette className="w-6 h-6" />,
  javascript: <Zap className="w-6 h-6" />,
  git: <GitBranch className="w-6 h-6" />,
  react: <Component className="w-6 h-6" />,
};

export default function RoadmapPage() {
  const router = useRouter();

  const [roadmapProgress, setRoadmapProgress] = useState<RoadmapNode[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const goalsGridRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- Load progress ---------------------------- */
  useEffect(() => {
    async function loadRoadmap() {
      // For demo mode, use a fixed demo user ID
      // In production, this would come from auth
      const demoUserId = 'demo-user-id';

      try {
        // Try Supabase first
        const supabaseRoadmap = await getRoadmap(demoUserId);

        if (supabaseRoadmap && supabaseRoadmap.length > 0) {
          console.log('✅ Loaded roadmap from Supabase');
          setRoadmapProgress(supabaseRoadmap);
          return;
        }
      } catch (error) {
        console.warn('Supabase unavailable, using localStorage fallback');
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('roadmapProgress');
      if (stored) {
        try {
          setRoadmapProgress(JSON.parse(stored));
          console.log('📦 Loaded roadmap from localStorage');
        } catch {
          setRoadmapProgress(frontendRoadmap);
          console.log('🎨 Using default roadmap');
        }
      } else {
        setRoadmapProgress(frontendRoadmap);
        console.log('🎨 Using default roadmap');
      }
    }

    loadRoadmap();
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

  /* ---------------------------- Topic handling ---------------------------- */
  const handleTopicToggle = async (topicId: string) => {
    const topic = roadmapProgress.find(t => t.id === topicId);
    if (!topic) return;

    if (!topic.completed) {
      setCurrentTopic(topicId);
      setTestAnswers([]);
      setShowResults(false);
      setShowTestModal(true);
    } else {
      const updated = roadmapProgress.map(t =>
        t.id === topicId ? { ...t, completed: false } : t
      );
      setRoadmapProgress(updated);

      // Save to localStorage
      localStorage.setItem('roadmapProgress', JSON.stringify(updated));

      // Save to Supabase
      const demoUserId = 'demo-user-id';
      try {
        await saveRoadmap(demoUserId, updated, 'system', 'Frontend Developer');
        console.log('✅ Saved progress to Supabase');
      } catch (error) {
        console.warn('Failed to save to Supabase, localStorage backup exists');
      }
    }
  };

  const handleTestSubmit = () => {
    if (!currentTopic) return;
    const questions = mockQuestions[currentTopic] || [];

    let correct = 0;
    questions.forEach((q, i) => {
      if (testAnswers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / questions.length) * 100);
    setTestScore(score);
    setShowResults(true);

    if (score >= 70) {
      const updated = roadmapProgress.map(t =>
        t.id === currentTopic ? { ...t, completed: true } : t
      );
      setRoadmapProgress(updated);
      localStorage.setItem('roadmapProgress', JSON.stringify(updated));
    }
  };

  const handleCloseModal = () => {
    setShowTestModal(false);
    setCurrentTopic(null);
    setTestAnswers([]);
    setShowResults(false);
  };

  const completedCount = roadmapProgress.filter(t => t.completed).length;
  const totalCount = roadmapProgress.length;
  const currentQuestions = currentTopic ? mockQuestions[currentTopic] || [] : [];

  /* -------------------------- AI Roadmap Handlers ------------------------- */
  const handleGenerateRoadmap = async (profile: any) => {
    setIsGenerating(true);
    const demoUserId = 'demo-user-id';

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (data.fallback) {
        setToastMessage(data.message);
      }

      // Update state
      setRoadmapProgress(data.roadmap);

      // Save to localStorage (fallback)
      localStorage.setItem('roadmapProgress', JSON.stringify(data.roadmap));

      // Save to Supabase (primary storage)
      try {
        await saveRoadmap(
          demoUserId,
          data.roadmap,
          data.fallback ? 'system' : 'ai',  // Track if AI-generated
          profile.role || 'Frontend Developer'
        );
        console.log('✅ Saved roadmap to Supabase');
      } catch (error) {
        console.warn('Failed to save to Supabase, localStorage backup exists');
      }

      setShowGenerateModal(false);
      setToastMessage('✓ Roadmap generated successfully!');
    } catch (error) {
      setToastMessage('Failed to generate roadmap. Using default.');
      setRoadmapProgress(frontendRoadmap);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleRoadmapUpdate = async (roadmap: RoadmapNode[], explanation: string) => {
    const demoUserId = 'demo-user-id';

    // Update state
    setRoadmapProgress(roadmap);

    // Save to localStorage (fallback)
    localStorage.setItem('roadmapProgress', JSON.stringify(roadmap));

    // Save to Supabase (primary storage)
    try {
      await saveRoadmap(
        demoUserId,
        roadmap,
        'ai',  // Chatbot edits are AI-generated
        'Frontend Developer'
      );
      console.log('✅ Saved updated roadmap to Supabase');
    } catch (error) {
      console.warn('Failed to save to Supabase, localStorage backup exists');
    }

    setToastMessage(`✓ ${explanation}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* ======================= HEADER ======================= */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2">
                  Your 14-Day Sprint
                </h1>
                <p className="text-gray-400">
                  AI-generated personalized preparation plan
                </p>
              </div>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate Roadmap
              </button>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Overall Progress</span>
                <span>{completedCount}/{totalCount} completed</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ================= WEEKLY + PRIORITIES ================= */}
          <div ref={goalsGridRef} className="grid md:grid-cols-2 gap-6 relative bento-section">
            <GlobalSpotlight
              gridRef={goalsGridRef}
              enabled={!isMobile}
              spotlightRadius={200}
              glowColor="59, 130, 246"
              disableAnimations={isMobile}
            />
            <ParticleCard
              disableAnimations={isMobile}
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">Weekly Goals</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li>• Build DSA foundations (arrays, strings, hashing)</li>
                  <li>• Strengthen SQL + OS + Networking basics</li>
                  <li>• Start one deployable full-stack project</li>
                </ul>
              </Card>
            </ParticleCard>

            <ParticleCard
              disableAnimations={isMobile}
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="59, 130, 246"
            >
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">Key Priorities</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li>✔ Pattern-based DSA practice (6/day)</li>
                  <li>✔ Clean notes + flashcards</li>
                  <li>✔ One high-quality deployable project</li>
                </ul>
              </Card>
            </ParticleCard>
          </div>

          {/* ================= DAY BY DAY PLAN ================= */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Day-by-Day Plan</h2>

            {roadmapProgress.map((node, idx) => {
              const isLocked =
                node.prerequisites?.some(
                  p => !roadmapProgress.find(t => t.id === p)?.completed
                );

              return (
                <ParticleCard
                  key={node.id}
                  disableAnimations={isMobile}
                  particleCount={10}
                  enableTilt={false}
                  clickEffect={true}
                  enableMagnetism={true}
                  glowColor="59, 130, 246"
                >
                  <Card
                    className={`transition-all ${node.completed
                      ? 'border-green-500/40 bg-green-900/10'
                      : isLocked
                        ? 'opacity-50'
                        : 'hover:border-blue-500/40'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${node.completed
                          ? 'bg-green-600/20 text-green-400'
                          : isLocked
                            ? 'bg-gray-600/20 text-gray-500'
                            : 'bg-blue-600/20 text-blue-400'
                          }`}
                      >
                        {topicIcons[node.id] || <Code className="w-6 h-6" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            D{idx + 1}: {node.title}
                          </h3>

                          <button
                            disabled={isLocked}
                            onClick={() => !isLocked && handleTopicToggle(node.id)}
                          >
                            {node.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-400" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-500" />
                            )}
                          </button>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">
                          {node.description}
                        </p>

                        <span
                          className={`px-3 py-1 text-xs rounded-full border font-medium ${node.completed
                            ? 'bg-green-600/20 text-green-400 border-green-600/30'
                            : isLocked
                              ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                              : 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                            }`}
                        >
                          {node.completed
                            ? '✓ Verified'
                            : isLocked
                              ? '🔒 Locked'
                              : 'Ready to Start'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </ParticleCard>
              );
            })}
          </div>
        </div>
      </main>

      {/* ======================= TEST MODAL ======================= */}
      {showTestModal && currentTopic && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)] flex justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {roadmapProgress.find(t => t.id === currentTopic)?.title} Test
                </h2>
                <p className="text-gray-400 text-sm">
                  Score 70% or higher to verify
                </p>
              </div>
              <button onClick={handleCloseModal}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="p-6">
              {!showResults ? (
                <>
                  {currentQuestions.map((q, i) => (
                    <div key={q.id} className="mb-6">
                      <p className="text-white font-medium mb-3">
                        {i + 1}. {q.question}
                      </p>
                      {q.options.map((opt, j) => (
                        <label
                          key={j}
                          className={`block p-3 rounded-lg border cursor-pointer mb-2 ${testAnswers[i] === j
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'border-[var(--border)]'
                            }`}
                        >
                          <input
                            type="radio"
                            className="mr-3"
                            checked={testAnswers[i] === j}
                            onChange={() => {
                              const copy = [...testAnswers];
                              copy[i] = j;
                              setTestAnswers(copy);
                            }}
                          />
                          <span className="text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ))}

                  <button
                    onClick={handleTestSubmit}
                    disabled={testAnswers.length !== currentQuestions.length}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    Submit Test
                  </button>
                </>
              ) : (
                <div className="text-center py-10">
                  <div
                    className={`text-6xl font-bold mb-4 ${testScore >= 70 ? 'text-green-400' : 'text-yellow-400'
                      }`}
                  >
                    {testScore}%
                  </div>
                  <p className="text-gray-400 mb-6">
                    {testScore >= 70
                      ? 'You’ve verified this topic 🎉'
                      : 'Review and try again'}
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TOAST NOTIFICATION ======================= */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* ======================= CHATBOT ======================= */}
      <RoadmapChatbot
        currentRoadmap={roadmapProgress}
        onRoadmapUpdate={handleRoadmapUpdate}
      />

      {/* ======================= GENERATE MODAL ======================= */}
      {showGenerateModal && (
        <GenerateRoadmapModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateRoadmap}
          isLoading={isGenerating}
        />
      )}
    </div>
  );
}

/* ======================= GENERATE MODAL COMPONENT ======================= */
function GenerateRoadmapModal({
  onClose,
  onGenerate,
  isLoading
}: {
  onClose: () => void;
  onGenerate: (profile: any) => void;
  isLoading: boolean;
}) {
  const [role, setRole] = useState('Frontend Developer');
  const [dsa, setDsa] = useState(50);
  const [coreCS, setCoreCS] = useState(50);
  const [frameworks, setFrameworks] = useState(50);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [timelineWeeks, setTimelineWeeks] = useState(4);

  const handleSubmit = () => {
    onGenerate({
      role,
      currentSkills: { dsa, coreCS, frameworks },
      hoursPerDay,
      timelineWeeks
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Generate Personalized Roadmap</h2>
          <button onClick={onClose} disabled={isLoading}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">DSA Skills: {dsa}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={dsa}
              onChange={(e) => setDsa(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Core CS: {coreCS}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={coreCS}
              onChange={(e) => setCoreCS(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Frameworks: {frameworks}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={frameworks}
              onChange={(e) => setFrameworks(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Hours/Day: {hoursPerDay}</label>
            <input
              type="range"
              min="1"
              max="8"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Timeline: {timelineWeeks} weeks</label>
            <input
              type="range"
              min="2"
              max="16"
              value={timelineWeeks}
              onChange={(e) => setTimelineWeeks(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Roadmap
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
