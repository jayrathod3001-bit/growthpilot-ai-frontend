import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const PrivacyPolicy = () => {
  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span>🛡️</span>
            Legal & Data Protection
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: January 15, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-slate-300 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">01.</span> Introduction & Scope
            </h2>
            <p>
              Welcome to <strong className="text-white">GrowthPilot AI</strong> ("GrowthPilot", "we", "our", or "us"). We are dedicated to safeguarding your personal data and upholding your privacy rights. This Privacy Policy outlines our practices concerning the collection, storage, processing, and protection of information when you use our website, dashboard, and AI services.
            </p>
            <p>
              By accessing or using GrowthPilot AI, you consent to the collection and handling of your data in accordance with this Privacy Policy and international standards including the General Data Protection Regulation (GDPR) and the Digital Personal Data Protection (DPDP) Act.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">02.</span> Information We Collect
            </h2>
            <p>We collect only the information necessary to power and personalize your AI growth assistant:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Account Information:</strong> Name, email address, password hash (if registering via email), mobile phone number, and avatar image.
              </li>
              <li>
                <strong className="text-slate-200">Third-Party Authentication Data:</strong> When signing in via Google OAuth or Mobile OTP, we receive cryptographic identity tokens (Google ID, profile name, verified email, or phone number).
              </li>
              <li>
                <strong className="text-slate-200">Business Profile Data:</strong> Business name, industry category, customer demographics, growth targets, and active preferences you input to calibrate the AI engine.
              </li>
              <li>
                <strong className="text-slate-200">Generated Assets & Logs:</strong> Prompts, marketing strategies, SEO keywords, generated copy, and images saved to your business history.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">03.</span> Strict AI Privacy Guarantee
            </h2>
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm space-y-2">
              <p className="font-bold flex items-center gap-2 text-white">
                <span>🔒</span> Your Business Data is Never Used to Train Public Models
              </p>
              <p className="text-xs text-indigo-300">
                Unlike public consumer AI chatbots, your proprietary business models, competitive metrics, and content prompts are strictly isolated. We do not sell, rent, or contribute your inputs to public LLM foundation datasets.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">04.</span> How We Protect Your Information
            </h2>
            <p>
              We implement enterprise-grade security protocols to protect your sensitive data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>End-to-end 256-bit SSL encryption for all network traffic.</li>
              <li>Encrypted database storage for user profiles and authentication secrets.</li>
              <li>Ephemeral, 5-minute time-to-live (TTL) expiration for all Mobile & Email verification codes (OTP).</li>
              <li>Cryptographically signed JSON Web Tokens (JWT) for stateless, tamper-proof user sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">05.</span> Your Rights & Data Portability
            </h2>
            <p>
              Regardless of your geographical jurisdiction, you possess the following rights regarding your data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Right to Access:</strong> Review all personal information and business profiles associated with your account.</li>
              <li><strong className="text-slate-200">Right to Rectification:</strong> Edit or correct any inaccurate personal or business details directly from Settings.</li>
              <li><strong className="text-slate-200">Right to Erasure:</strong> Request permanent deletion of your account and all associated AI generation history.</li>
              <li><strong className="text-slate-200">Right to Export:</strong> Download your marketing strategies and analytics reports anytime in standard formats.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-sm">06.</span> Contact Our Privacy Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Officer at:
            </p>
            <p className="font-semibold text-white">
              Email:{' '}
              <a href="mailto:privacy@growthpilot.ai" className="text-indigo-400 hover:underline">
                isaratvadadriya@growthpilot.ai
              </a>
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PrivacyPolicy;
