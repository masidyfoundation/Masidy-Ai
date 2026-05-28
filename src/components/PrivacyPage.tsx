import React from "react";
import { X, Sparkles } from "lucide-react";

interface PrivacyPageProps {
  onClose: () => void;
}

export default function PrivacyPage({ onClose }: PrivacyPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Privacy Agreement</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <p className="text-xs text-slate-400 dark:text-zinc-500">Last updated: May 2026</p>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">1. Information We Collect</h3>
            <p>When you use Masidy AI, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account information:</strong> Email address, name, and profile data when you sign up</li>
              <li><strong>Conversation data:</strong> Messages you send and receive through the Service</li>
              <li><strong>Usage data:</strong> How you interact with the Service, features used, and session duration</li>
              <li><strong>Device information:</strong> Browser type, operating system, and IP address</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and improve the Service</li>
              <li>Process your AI requests and maintain conversation history</li>
              <li>Manage your account and subscription</li>
              <li>Send service-related communications</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">3. Data Storage</h3>
            <p>Your data is stored securely using Supabase (PostgreSQL) with row-level security. Conversation history is associated with your account and is only accessible to you. We use industry-standard encryption for data in transit and at rest.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">4. Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Groq:</strong> Processes your AI requests. Your messages are sent to Groq's API to generate responses.</li>
              <li><strong>Supabase:</strong> Stores your account data and conversation history.</li>
              <li><strong>Stripe:</strong> Processes payments for paid subscriptions.</li>
              <li><strong>Render:</strong> Hosts the application infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">5. Data Sharing</h3>
            <p>We do not sell your personal data. We do not share your conversation content with third parties except as required to provide the Service (e.g., sending messages to the AI model API) or as required by law.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">6. Voice Data</h3>
            <p>If you use the voice input feature, audio is processed locally in your browser using the Web Speech API. Audio data is not sent to our servers — only the transcribed text is used.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">7. Your Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your conversation history</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">8. Cookies</h3>
            <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">9. Children's Privacy</h3>
            <p>Masidy AI is not intended for users under 13 years of age. We do not knowingly collect data from children.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">10. Contact</h3>
            <p>For privacy-related requests, contact us at <span className="text-indigo-600 dark:text-indigo-400">privacy@masidy.com</span></p>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 shrink-0">
          <button onClick={onClose} className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl transition-all hover:opacity-90">
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
