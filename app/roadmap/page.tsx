'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { frontendRoadmap, mockQuestions, RoadmapNode, getRoadmapProgress, saveRoadmapProgress } from '@/lib/data';
import { CheckCircle2, Circle, X, Globe, Code, Palette, Zap, GitBranch, Component } from 'lucide-react';

// Topic icon mapping
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

  useEffect(() => {
    // Load roadmap progress using storage helper
    const stored = getRoadmapProgress();
    if (stored) {
      setRoadmapProgress(stored);
    } else {
      setRoadmapProgress(frontendRoadmap);
    }
  }, []);

  const handleTopicToggle = (topicId: string) => {
    const topic = roadmapProgress.find((t) => t.id === topicId);
    if (!topic) return;

    // If marking as complete, trigger test modal
    if (!topic.completed) {
      setCurrentTopic(topicId);
      setTestAnswers([]);
      setShowResults(false);
      setShowTestModal(true);
    } else {
      // Allow unchecking
      const updated = roadmapProgress.map((t) =>
        t.id === topicId ? { ...t, completed: false } : t
      );
      setRoadmapProgress(updated);
      saveRoadmapProgress(updated);
    }
  };

  const handleTestSubmit = () => {
    if (!currentTopic) return;

    const questions = mockQuestions[currentTopic] || [];
    let correct = 0;

    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setTestScore(score);
    setShowResults(true);

    // If passed (>= 70%), mark as completed
    if (score >= 70) {
      const updated = roadmapProgress.map((t) =>
        t.id === currentTopic ? { ...t, completed: true } : t
      );
      setRoadmapProgress(updated);
      saveRoadmapProgress(updated);
    }
  };

  const handleCloseModal = () => {
    setShowTestModal(false);
    setCurrentTopic(null);
    setTestAnswers([]);
    setShowResults(false);
  };

  const currentQuestions = currentTopic ? mockQuestions[currentTopic] || [] : [];
  const completedCount = roadmapProgress.filter((t) => t.completed).length;
  const totalCount = roadmapProgress.length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Frontend Roadmap</h1>
            <p className="text-gray-400">
              Complete each topic and pass the mini-test to unlock the next
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Progress</span>
                <span>
                  {completedCount}/{totalCount} completed
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Roadmap Flowchart */}
          <div className="space-y-4">
            {roadmapProgress.map((node, idx) => {
              const isLocked =
                node.prerequisites &&
                node.prerequisites.some(
                  (prereqId) =>
                    !roadmapProgress.find((t) => t.id === prereqId)?.completed
                );

              return (
                <div key={node.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <Card
                    className={`transition-all ${node.completed
                      ? 'border-green-500/50 bg-green-900/10'
                      : isLocked
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Topic Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${node.completed
                        ? 'bg-green-600/20 text-green-400'
                        : isLocked
                          ? 'bg-gray-600/20 text-gray-500'
                          : 'bg-blue-600/20 text-blue-400'
                        }`}>
                        {topicIcons[node.id] || <Code className="w-6 h-6" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {node.title}
                          </h3>
                          {/* Checkbox */}
                          <button
                            onClick={() => !isLocked && handleTopicToggle(node.id)}
                            disabled={isLocked}
                            className={`flex-shrink-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'
                              }`}
                          >
                            {node.completed ? (
                              <CheckCircle2 className="w-7 h-7 text-green-400" />
                            ) : (
                              <Circle className="w-7 h-7 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{node.description}</p>
                        <div className="flex items-center gap-2">
                          {node.completed ? (
                            <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30 font-medium">
                              ✓ Verified
                            </span>
                          ) : isLocked ? (
                            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-600/30 font-medium">
                              🔒 Locked
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30 font-medium">
                              Ready to Start
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Connection Line */}
                  {idx < roadmapProgress.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-blue-600/50 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Test Modal */}
      {showTestModal && currentTopic && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {roadmapProgress.find((t) => t.id === currentTopic)?.title} Test
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Score 70% or higher to verify completion
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Questions or Results */}
            <div className="p-6">
              {!showResults ? (
                <>
                  {currentQuestions.map((q, idx) => (
                    <div key={q.id} className="mb-6 last:mb-0">
                      <p className="text-white font-medium mb-3">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className={`block p-3 rounded-lg border cursor-pointer transition-all ${testAnswers[idx] === optIdx
                              ? 'bg-blue-600/20 border-blue-500'
                              : 'bg-[var(--background)] border-[var(--border)] hover:border-blue-500/50'
                              }`}
                          >
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              checked={testAnswers[idx] === optIdx}
                              onChange={() => {
                                const newAnswers = [...testAnswers];
                                newAnswers[idx] = optIdx;
                                setTestAnswers(newAnswers);
                              }}
                              className="mr-3"
                            />
                            <span className="text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Submit Button */}
                  <button
                    onClick={handleTestSubmit}
                    disabled={testAnswers.length !== currentQuestions.length}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Test
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div
                    className={`text-6xl font-bold mb-4 ${testScore >= 70 ? 'text-green-400' : 'text-yellow-400'
                      }`}
                  >
                    {testScore}%
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {testScore >= 70 ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {testScore >= 70
                      ? 'You\'ve verified your knowledge of this topic!'
                      : 'Review the topic and try again to verify completion.'}
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
