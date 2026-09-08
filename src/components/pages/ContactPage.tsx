import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';
import { SeoHead } from '../seo/SeoHead';

export const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SeoHead
        title="Contact Toolora — Feedback, Support & Tool Suggestions"
        description="Contact the Toolora team. Share feedback, submit bug reports, or suggest new privacy-focused online utilities."
        path="/contact"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
            Get in touch with Toolora
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Have a suggestion, found a bug, or want to recommend a new tool? We’d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-4 ${
            isDark ? 'bg-[#10131a] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Message received!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Thank you for reaching out, <span className="font-semibold">{name}</span>. Our team reviews feedback regularly and will respond to <span className="font-semibold">{email}</span> if a follow-up is needed.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Your Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1">Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="Feedback">Product Feedback</option>
                <option value="Feature Request">Request a New Tool</option>
                <option value="Bug Report">Report a Bug / Issue</option>
                <option value="General Inquiry">General Question</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1">Message *</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your suggestion or issue in detail..."
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:border-indigo-500 resize-y ${
                  isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
