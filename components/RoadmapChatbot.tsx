'use client';

import { useState } from 'react';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { RoadmapNode } from '@/lib/data';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface RoadmapChatbotProps {
    currentRoadmap: RoadmapNode[];
    onRoadmapUpdate: (roadmap: RoadmapNode[], explanation: string) => void;
}

export default function RoadmapChatbot({ currentRoadmap, onRoadmapUpdate }: RoadmapChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hi! I can help you customize your roadmap. Try: "Skip HTML" or "Make this faster"'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/roadmap/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentRoadmap,
                    userMessage
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to edit roadmap');
            }

            // Update roadmap
            onRoadmapUpdate(data.roadmap, data.explanation);

            // Add assistant response
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `✓ ${data.explanation}` }
            ]);

        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I couldn\'t process that. Please try again.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Modal */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-white">Roadmap Assistant</h3>
                            <p className="text-xs text-gray-400">Customize your learning path</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-[var(--background)] text-gray-300 border border-[var(--border)]'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded-lg">
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border)]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your request..."
                                disabled={isLoading}
                                className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Try: "Skip HTML" • "Make faster" • "Add projects"
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
