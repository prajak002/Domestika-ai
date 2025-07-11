'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, User } from 'lucide-react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

interface ChatMessage {
  text: string;
  isAI: boolean;
}

export default function AICoCreation() {
  const [inputValue, setInputValue] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleGetFeedback = async () => {
    if (!inputValue.trim()) return;
    setIsGettingFeedback(true);
    setFeedbackError(null);
    const userMessage: ChatMessage = { text: inputValue, isAI: false };
    setMessages(prev => [...prev, userMessage]);
    try {
      const res = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue, type: 'design_feedback' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setMessages(prev => [...prev, { text: data.text || data.response, isAI: true }]);
      setInputValue('');
    } catch (err: any) {
      setFeedbackError(err.message || 'Failed to get feedback');
    } finally {
      setIsGettingFeedback(false);
    }
  };

  // Helper to render message with LaTeX if present
  const renderMessage = (msg: string) => {
    // Simple heuristic: if contains $...$ or \( ... \), render as TeX
    if (/\$[^$]+\$|\\\([\s\S]+?\\\)/.test(msg)) {
      return <TeX>{msg}</TeX>;
    }
    return <span>{msg}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Creative Co-Creation Studio
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Describe your creative work or challenge and get AI-powered feedback
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="space-y-4">
          <textarea
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg resize-none"
            rows={5}
            placeholder="Describe your artwork, project, or creative challenge..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isGettingFeedback}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetFeedback}
            disabled={isGettingFeedback || !inputValue.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50 mx-auto"
          >
            {isGettingFeedback ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Getting Feedback...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Get Creative Feedback</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Conversation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-500" />
          Creative Chat
        </h3>
        {messages.length === 0 && (
          <div className="text-gray-400 text-center">No conversation yet. Start by describing your creative work or challenge.</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-3 ${msg.isAI ? 'flex-row-reverse' : ''}`}>
            <div className={`rounded-full p-2 ${msg.isAI ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {msg.isAI ? <Brain className="h-5 w-5 text-purple-600" /> : <User className="h-5 w-5 text-gray-600" />}
            </div>
            <div className={`max-w-xl p-3 rounded-lg ${msg.isAI ? 'bg-purple-50 dark:bg-purple-800 text-purple-900 dark:text-purple-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
              {renderMessage(msg.text)}
            </div>
          </div>
        ))}
        {isGettingFeedback && (
          <div className="flex items-start space-x-3 flex-row-reverse">
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div className="max-w-xl p-3 rounded-lg bg-purple-50 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
              Generating feedback...
            </div>
          </div>
        )}
        {feedbackError && (
          <div className="text-red-500 dark:text-red-400 mt-4">{feedbackError}</div>
        )}
      </div>
    </div>
  );
}
