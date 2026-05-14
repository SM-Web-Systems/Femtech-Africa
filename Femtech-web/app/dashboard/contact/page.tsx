"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/common/Card";
import { Button } from "@/app/components/common/Button";
import { useAuthStore } from "@/app/lib/store/auth.store";
import { useLanguage } from "@/app/lib/i18n/LanguageContext";

export default function ContactPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) return;
    setSending(true);
    // Simulate send - in production this would call an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/profile")}>
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{t("profile.contactUs")}</h1>
        </div>
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">&#9993;</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">Thank you for reaching out. Our support team will get back to you within 24-48 hours.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="sm" onClick={() => { setSubmitted(false); setSubject(""); setMessageText(""); }}>
              Send Another Message
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/profile")}>
              Back to Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/profile")}>
          {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{t("profile.contactUs")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <div className="text-3xl mb-2">&#9993;</div>
          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
          <a href="mailto:support@mamatokens.com" className="text-blue-600 hover:underline text-sm">support@mamatokens.com</a>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-3xl mb-2">&#128222;</div>
          <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
          <a href="https://wa.me/27662448550" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">+27 66 244 8550</a>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-3xl mb-2">&#128337;</div>
          <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
          <p className="text-gray-600 text-sm">Mon-Fri 8am - 6pm SAST</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
            <input type="text" value={user?.phone || ""} disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a topic...</option>
              <option value="wallet">Wallet & Tokens</option>
              <option value="redemption">Redemptions</option>
              <option value="quiz">Quizzes & Milestones</option>
              <option value="account">Account & Profile</option>
              <option value="technical">Technical Issue</option>
              <option value="feedback">Feedback & Suggestions</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)}
              rows={5} placeholder="Describe your issue or question in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <Button variant="primary" onClick={() => {}} isLoading={sending}
            className={!subject.trim() || !messageText.trim() ? "opacity-50 cursor-not-allowed" : ""}>
            Send Message
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Before contacting us</h2>
        <p className="text-gray-600 text-sm mb-3">Many common questions are already answered in our FAQ. Check there first for quick answers!</p>
        <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/faq")}>
          {t("profile.faq")}
        </Button>
      </Card>
    </div>
  );
}