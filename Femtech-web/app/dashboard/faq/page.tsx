"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/common/Card";
import { Button } from "@/app/components/common/Button";
import { useLanguage } from "@/app/lib/i18n/LanguageContext";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "What are MAMA tokens?",
      answer: "MAMA tokens are digital rewards you earn by completing health milestones and wellness quizzes during your pregnancy. They are stored on the Stellar blockchain and can be redeemed for real maternal health services like prenatal checkups, nutritional consultations, and more."
    },
    {
      question: "How do I earn MAMA tokens?",
      answer: "You earn tokens in two main ways: completing health milestones (like attending prenatal visits, tracking baby kicks, etc.) and passing wellness quizzes. Each activity has a specific token reward shown before you start."
    },
    {
      question: "How do I create a wallet?",
      answer: "Your Stellar wallet is created automatically when you register. You can view your wallet address and balance on the Wallet page. Your tokens are securely stored on the Stellar blockchain."
    },
    {
      question: "What can I redeem my tokens for?",
      answer: "You can redeem MAMA tokens for maternal health services including prenatal checkups, nutritional consultations, prenatal yoga classes, mental health counseling, vitamin packs, and ultrasound scans. Visit the Redemptions page to see all available options."
    },
    {
      question: "How long does a redemption take?",
      answer: "Redemptions are typically processed within 24-48 hours. You will receive confirmation once your redemption has been completed and the service is ready for you."
    },
    {
      question: "Can I retake quizzes?",
      answer: "Yes, you can retake quizzes to improve your score. However, token rewards are only granted on the first successful pass. Retaking is a great way to reinforce your learning!"
    },
    {
      question: "Is my personal data safe?",
      answer: "Yes. All personal and health data is encrypted using industry-standard AES-256 encryption. We follow strict data protection practices and never share your information with third parties without your consent."
    },
    {
      question: "What countries is MamaTokens available in?",
      answer: "MamaTokens is currently available in South Africa, Nigeria, Kenya, Uganda, Tanzania, and Ghana. We are actively working to expand to more African countries."
    },
    {
      question: "How do I change my language?",
      answer: "Go to your Profile page and scroll to the Language section. You can choose from English, French, Swahili, and Zulu. The app will immediately switch to your selected language."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account from the Profile page under the Danger Zone section. Please note that this action is permanent and will remove all your data, including your token balance and transaction history."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/profile")}>
          {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{t("profile.faq")}</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-600 mb-6">Find answers to common questions about MamaTokens, your wallet, and maternal health services.</p>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <span className={`text-gray-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`}>&#9660;</span>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Still have questions?</h2>
        <p className="text-blue-700 text-sm mb-4">Our support team is here to help you with anything not covered above.</p>
        <Button variant="primary" size="sm" onClick={() => router.push("/dashboard/contact")}>
          {t("profile.contactUs")}
        </Button>
      </Card>
    </div>
  );
}