'use client';

import { useState } from 'react';

interface FAQItem {
    id: number;
    question: string;
    answer: string
}

const faqData: FAQItem[] = [
    {
        id: 1,
        question: "Is it normal to feel anxious during pregnancy?",
        answer: "Yes, anxiety during pregnancy is very common. Many mothers experience worries about labor, baby's health, and their role as a parent. These feelings are valid, and seeking support is an important step toward managing them.",
    },
    {
        id: 2,
        question: "How can I manage stress while pregnant?",
        answer: "Some effective strategies include regular exercise, meditation, deep breathing exercises, prenatal yoga, talking to loved ones, and seeking professional support when needed. Find what works best for you.",
    },
    {
        id: 3,
        question: "What is postpartum depression and how do I know if I have it?",
        answer: "Postpartum depression is a serious medical condition that affects some mothers after childbirth. Signs include persistent sadness, loss of interest in activities, difficulty bonding with baby, and sleep problems. If you experience these, please reach out to a healthcare provider.",
    },
    {
        id: 4,
        question: "When should I talk to a professional about my mental health?",
        answer: "Consider talking to a professional if you experience persistent anxiety, depression, intrusive thoughts, difficulty functioning, or any concerns about your mental health. There's no 'right time'—reaching out is always appropriate.",
    },
    {
        id: 5,
        question: "Are there support groups for pregnant mothers?",
        answer: "Yes! Many hospitals, clinics, and online communities offer support groups for pregnant mothers. These groups provide a safe space to share experiences, ask questions, and connect with others going through similar journeys.",
    }
];

export default function FAQ() {
    const [activeId, setActiveId] = useState<number | null>(null);

    // Toggle the accordion
    // If the clicked item is already open, it closes it
    // If it's closed, it opens it
    const toggleFaq = (id: number) => {
        setActiveId(activeId === id ? null : id);
    }

    return (
        <section className="px-4 py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                    Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 text-center mb-12">
                    Find answers to common questions about maternal mental health
                </p>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqData.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFaq(item.id)}
                                className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-blue-50 transition flex justify-between items-center"
                            >
                                <span>{item.question}</span>
                                {/* Arrow that rotates when open */}
                                <span
                                    className={`text-blue-600 transition-transform ${activeId === item.id ? 'rotate-180' : ''
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {/* Answer - Only shows when activeId matches this item's id */}
                            {activeId === item.id && (
                                <div className="px-6 py-4 bg-blue-50 border-t border-gray-200 text-gray-700">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}