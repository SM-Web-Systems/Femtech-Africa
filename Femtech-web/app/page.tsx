'use client';

import { useRouter } from 'next/navigation';
import { Button } from './components/common/Button';
import { useLanguage } from './lib/i18n/LanguageContext';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="px-4 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              {t('landing.badge')}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">{t('landing.heroTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('landing.heroSubtitle')}</p>
          <div className="flex gap-4 justify-center pt-8 flex-wrap">
            <Button variant="primary" size="lg" onClick={handleLogin}>{t('landing.startEarning')}</Button>
            <Button variant="outline" size="lg">{t('landing.learnMore')}</Button>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">{t('landing.howItWorks')}</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">{t('landing.howItWorksSubtitle')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: '✅', title: t('landing.step1Title'), desc: t('landing.step1Desc') },
              { step: 2, icon: '🪙', title: t('landing.step2Title'), desc: t('landing.step2Desc') },
              { step: 3, icon: '🏥', title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition relative">
                <div className="absolute top-8 left-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{step}</div>
                <div className="text-5xl mb-6 mt-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">{t('landing.whatTokensGetYou')}</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">{t('landing.whatTokensSubtitle')}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏥', title: t('landing.healthCheckups'), desc: t('landing.healthCheckupsDesc') },
              { icon: '📖', title: t('landing.educationalResources'), desc: t('landing.educationalResourcesDesc') },
              { icon: '👥', title: t('landing.communitySupport'), desc: t('landing.communitySupportDesc') },
              { icon: '💊', title: t('landing.wellnessServices'), desc: t('landing.wellnessServicesDesc') },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('landing.whyBuiltTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('landing.maternalHealthMatters')}</h3>
              <p className="text-blue-100">{t('landing.maternalHealthDesc')}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('landing.sustainableSolutions')}</h3>
              <p className="text-blue-100">{t('landing.sustainableDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">{t('landing.readyToStart')}</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">{t('landing.readyDesc')}</p>
          <Button variant="secondary" size="lg" onClick={handleLogin}>{t('landing.startNow')}</Button>
        </div>
      </section>
    </main>
  );
}