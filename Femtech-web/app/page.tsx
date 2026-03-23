'use client';

import { useRouter } from 'next/navigation';
import FAQ from "./components/Faq";

export default function Home() {
  const router = useRouter();

  const handleHowItWorks = () => {
    router.push('/how-it-works');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Earn MAMA Tokens • Access Better Care
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Healthier Pregnancies, Rewarded
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete health milestones and wellness quizzes to earn MAMA tokens.
            Spend them with our partners to access checkups, educational resources, and maternal health services across Africa.
          </p>
          <div className="flex gap-4 justify-center pt-8 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Start Earning
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition"
              onClick={handleHowItWorks}>
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-4 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Three Simple Steps
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Build better health habits and earn rewards that matter
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition relative">
              <div className="absolute top-8 left-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="text-5xl mb-6 mt-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Milestones</h3>
              <p className="text-gray-600">
                Track your pregnancy journey through guided health checkpoints, wellness quizzes, and educational modules tailored for expectant mothers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition relative">
              <div className="absolute top-8 left-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="text-5xl mb-6 mt-4">🪙</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn MAMA Tokens</h3>
              <p className="text-gray-600">
                Each completed milestone and quiz earns you MAMA tokens on the Stellar network. Build your balance as you invest in your health.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition relative">
              <div className="absolute top-8 left-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="text-5xl mb-6 mt-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spend With Partners</h3>
              <p className="text-gray-600">
                Redeem your MAMA tokens with our network of healthcare providers and partners for prenatal checkups, services, and resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Access Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What Your Tokens Get You
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Access essential maternal health services and support with your earned tokens
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Access 1 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Health Checkups</h3>
              <p className="text-sm text-gray-600">
                Prenatal visits and maternal health screenings
              </p>
            </div>

            {/* Access 2 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Educational Resources</h3>
              <p className="text-sm text-gray-600">
                Expert-guided content on pregnancy and wellness
              </p>
            </div>

            {/* Access 3 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-sm text-gray-600">
                Connect with other mothers on their journeys
              </p>
            </div>

            {/* Access 4 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="text-4xl mb-3">💊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Wellness Services</h3>
              <p className="text-sm text-gray-600">
                Access partner clinics and health services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="bg-blue-600 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why We Built This</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Maternal Health Matters</h3>
              <p className="text-blue-100">
                Access to quality prenatal care transforms maternal outcomes. We're making it rewarding to prioritize your health throughout your pregnancy.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sustainable Solutions</h3>
              <p className="text-blue-100">
                By connecting you with verified healthcare partners, we ensure your tokens unlock real, meaningful healthcare access in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Begin your journey today. Complete your first milestone, earn your first MAMA token, and unlock better maternal healthcare.
          </p>
        </div>
      </section>
    </main>
  )
}