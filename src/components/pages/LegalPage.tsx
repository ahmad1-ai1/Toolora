import React from 'react';
import { ShieldCheck, FileText, AlertCircle, Lock } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const config = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Our strict commitment to zero data retention and client-side processing.',
      lastUpdated: 'May 2025',
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Guidelines for accessing and using OmniTools utilities.',
      lastUpdated: 'May 2025',
    },
    disclaimer: {
      title: 'Legal Disclaimer',
      subtitle: 'Important disclosures regarding document conversion and calculations.',
      lastUpdated: 'May 2025',
    },
  }[type];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: config.title }]} />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs uppercase tracking-wider">
            {type === 'privacy' && <ShieldCheck className="w-4 h-4" />}
            {type === 'terms' && <FileText className="w-4 h-4" />}
            {type === 'disclaimer' && <AlertCircle className="w-4 h-4" />}
            <span>Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
            {config.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {config.subtitle}
          </p>
          <div className="text-xs text-gray-400 pt-1">
            Last Updated: {config.lastUpdated}
          </div>
        </div>

        <div className={`p-6 sm:p-10 rounded-3xl border space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${
          isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
        }`}>
          {type === 'privacy' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  1. The Client-Side Execution Guarantee
                </h2>
                <p>
                  At OmniTools, privacy is not just a policy; it is an architectural foundation. All file manipulation tools — including the Image Compressor, PDF Compressor, JPG to PDF, PDF to JPG, and Image Resizer — execute completely within your web browser using HTML5 Canvas, WebAssembly, and local JavaScript.
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Your files, documents, photographs, and metadata are never uploaded to our servers, stored in any database, or inspected by third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  2. Information We Do Not Collect
                </h2>
                <p>
                  We do not require user account creation, logins, phone numbers, or credit card details. We do not store or track any document contents, text inputs in our Word Counter, or JSON payloads formatted in our developer tools.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  3. Cookies and Local State
                </h2>
                <p>
                  We utilize standard browser <code>localStorage</code> solely for remembering non-sensitive preferences such as your preferred color theme (Dark or Light mode). No tracking beacons or cross-site tracking cookies are stored.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  4. Third-Party Links &amp; Content
                </h2>
                <p>
                  Our site may contain links to external documentation or partners. We encourage you to review their respective privacy terms when navigating away from OmniTools.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using OmniTools, you agree to be bound by these Terms of Service. If you do not agree to all terms, you must discontinue using our services.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  2. Permitted Use
                </h2>
                <p>
                  OmniTools provides free utility services for personal and commercial usage. You agree not to use the service for any unlawful activities or in a manner that impairs the platform’s stability or accessibility for others.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  3. Intellectual Property
                </h2>
                <p>
                  You retain complete and unreserved ownership of all images, documents, and content processed using our utilities. OmniTools claims no ownership or license over any files created or modified via our browser tools.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  4. Limitation of Liability
                </h2>
                <p>
                  OmniTools is provided on an "as is" and "as available" basis without warranties of any kind. Under no circumstances shall OmniTools or its contributors be liable for any data loss, computational inaccuracies, or damages arising out of your use of the website.
                </p>
              </section>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  1. General Information Only
                </h2>
                <p>
                  The utilities, calculators, and converters provided on OmniTools are intended for general informational, educational, and workflow convenience purposes.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  2. No Financial, Legal, or Medical Advice
                </h2>
                <p>
                  Outputs from our percentage calculators, chronological age calculations, and document converters should not be treated as formal legal, accounting, tax, or medical advice. Always double-check critical numerical outputs before submitting binding legal filings or making financial transactions.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  3. File Integrity &amp; Backups
                </h2>
                <p>
                  While our browser-based compression and conversion routines are built against robust industry standards, users are strongly advised to keep independent backup copies of original files before executing destructive file overwrites.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
