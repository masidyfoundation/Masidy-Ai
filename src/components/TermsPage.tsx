import React from "react";
import { X, Sparkles } from "lucide-react";

interface TermsPageProps {
  onClose: () => void;
}

export default function TermsPage({ onClose }: TermsPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Terms of Service</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <p className="text-xs text-slate-400 dark:text-zinc-500">Last updated: May 2026</p>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">1. Acceptance of Terms</h3>
            <p>By accessing or using Masidy AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">2. Description of Service</h3>
            <p>Masidy AI is an AI-powered workspace assistant that provides conversational AI capabilities, research tools, image generation, and related services. The Service is powered by third-party AI models including Groq's Llama models.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">3. User Accounts</h3>
            <p>You may create an account using your email address or Google account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">4. Acceptable Use</h3>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate harmful, illegal, or abusive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse engineer or compromise the Service</li>
              <li>Use the Service for spam or unsolicited communications</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">5. Subscription and Payments</h3>
            <p>Masidy AI offers free and paid subscription tiers. Paid subscriptions are billed monthly through Stripe. You may cancel your subscription at any time. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">6. Intellectual Property</h3>
            <p>The Masidy AI platform, including its design, code, and branding, is owned by Masidy. Content you generate using the Service remains yours. You grant Masidy a limited license to process your inputs to provide the Service.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">7. Disclaimer of Warranties</h3>
            <p>The Service is provided "as is" without warranties of any kind. AI-generated content may be inaccurate, incomplete, or outdated. Always verify important information from authoritative sources.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">8. Limitation of Liability</h3>
            <p>Masidy AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the past 12 months.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">9. Changes to Terms</h3>
            <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">10. Contact</h3>
            <p>For questions about these Terms, contact us at <span className="text-indigo-600 dark:text-indigo-400">support@masidy.com</span></p>
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
