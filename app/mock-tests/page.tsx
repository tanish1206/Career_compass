'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { mockQuestions } from '@/lib/data';
import { FileText, CheckCircle } from 'lucide-react';

export default function MockTestsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const topics = Object.keys(mockQuestions);
  const currentQuestions = selectedTopic ? mockQuestions[selectedTopic] : [];

  const handleStartTest = (topic: string) => {
    setSelectedTopic(topic);
    setAnswers([]);
    setShowResults(false);
  };

  const handleSubmit = () => {
    let correct = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / currentQuestions.length) * 100);
    setScore(percentage);
    setShowResults(true);
  };

  const handleRetry = () => {
    setAnswers([]);
    setShowResults(false);
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="pl-0 md:pl-0 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Mock Tests</h1>
            <p className="text-gray-400">
              Test your knowledge with topic-wise assessments
            </p>
          </div>

          {!selectedTopic ? (
            // Topic Selection
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map((topic, idx) => (
                <Card
                  key={topic}
                  hover
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <button
                    onClick={() => handleStartTest(topic)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white capitalize">
                        {topic === 'javascript' ? 'JavaScript' : topic}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {mockQuestions[topic].length} questions • Easy to Medium
                    </p>
                    <div className="text-blue-400 font-medium text-sm">
                      Start Test →
                    </div>
                  </button>
                </Card>
              ))}
            </div>
          ) : showResults ? (
            // Results View
            <div className="animate-fade-in">
              <Card className="text-center py-12">
                <div
                  className={`text-6xl font-bold mb-6 ${
                    score >= 70 ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {score}%
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {score >= 70 ? 'Great Job! 🎉' : 'Keep Practicing! 📚'}
                </h2>
                <p className="text-gray-400 mb-8">
                  You got {Math.round((score / 100) * currentQuestions.length)} out of{' '}
                  {currentQuestions.length} questions correct
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                  >
                    Retry Test
                  </button>
                  <button
                    onClick={handleBack}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                  >
                    Back to Topics
                  </button>
                </div>
              </Card>
            </div>
          ) : (
            // Test Questions
            <div className="animate-fade-in">
              {/* Progress Header */}
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white mb-4 transition-colors"
                >
                  ← Back to Topics
                </button>
                <Card>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white capitalize">
                      {selectedTopic === 'javascript' ? 'JavaScript' : selectedTopic} Test
                    </h2>
                    <span className="text-gray-400 text-sm">
                      {answers.length}/{currentQuestions.length} answered
                    </span>
                  </div>
                </Card>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {currentQuestions.map((q, idx) => (
                  <Card key={q.id}>
                    <div className="mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {idx + 1}
                        </span>
                        <p className="text-white font-medium flex-1">{q.question}</p>
                      </div>
                    </div>

                    <div className="space-y-2 ml-11">
                      {q.options.map((option, optIdx) => (
                        <label
                          key={optIdx}
                          className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                            answers[idx] === optIdx
                              ? 'bg-blue-600/20 border-blue-500'
                              : 'bg-[var(--background)] border-[var(--border)] hover:border-blue-500/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            checked={answers[idx] === optIdx}
                            onChange={() => {
                              const newAnswers = [...answers];
                              newAnswers[idx] = optIdx;
                              setAnswers(newAnswers);
                            }}
                            className="mr-3"
                          />
                          <span className="text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={answers.length !== currentQuestions.length}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Test
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
