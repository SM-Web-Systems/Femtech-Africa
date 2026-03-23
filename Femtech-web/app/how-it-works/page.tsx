export default function HowItWorks() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                        How It Works
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A transparent, rewarding pathway to better maternal health across Africa
                    </p>
                </div>
            </section>

            {/* Step 1: Complete */}
            <section className="bg-white px-4 py-20 border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/2">
                            <div className="inline-block mb-4">
                                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    STEP 1
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Complete Health Milestones & Quizzes
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Your journey begins with meaningful health activities designed specifically for expectant mothers. Whether you're just learning you're pregnant or preparing for birth, we have milestones tailored to your stage.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Pregnancy Stage Assessments</h3>
                                        <p className="text-gray-600 text-sm">Complete quizzes about your current trimester, health status, and wellness goals</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Health Tracking Milestones</h3>
                                        <p className="text-gray-600 text-sm">Log prenatal visits, nutrition habits, exercise, and mental wellness checkpoints</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Educational Modules</h3>
                                        <p className="text-gray-600 text-sm">Learn about pregnancy care, nutrition, labor preparation, and postpartum health</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Community Engagement</h3>
                                        <p className="text-gray-600 text-sm">Connect with other mothers, share stories, and get peer support</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                                💡 Every activity you complete contributes to your health journey AND earns you rewards. No busy work—everything is designed to support your wellbeing.
                            </p>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Example: Your First Month</h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                                        <p className="font-semibold text-gray-900">Week 1: Pregnancy Confirmation Quiz</p>
                                        <p className="text-sm text-gray-600 mt-2">Answer questions about your health history and current symptoms</p>
                                        <p className="text-sm font-semibold text-blue-600 mt-2">→ Earn 5 MAMA Tokens</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                                        <p className="font-semibold text-gray-900">Week 2: Nutrition Milestone</p>
                                        <p className="text-sm text-gray-600 mt-2">Complete the prenatal nutrition module and log 5 healthy meals</p>
                                        <p className="text-sm font-semibold text-blue-600 mt-2">→ Earn 8 MAMA Tokens</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                                        <p className="font-semibold text-gray-900">Week 3: Mental Wellness Check</p>
                                        <p className="text-sm text-gray-600 mt-2">Complete wellness assessment and join community group chat</p>
                                        <p className="text-sm font-semibold text-blue-600 mt-2">→ Earn 7 MAMA Tokens</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                                        <p className="font-semibold text-gray-900">Week 4: Prenatal Care Planning</p>
                                        <p className="text-sm text-gray-600 mt-2">Schedule your first checkup and complete care plan quiz</p>
                                        <p className="text-sm font-semibold text-blue-600 mt-2">→ Earn 10 MAMA Tokens</p>
                                    </div>

                                    <div className="bg-blue-600 text-white rounded-lg p-4 mt-6 text-center">
                                        <p className="text-sm">Total Month 1</p>
                                        <p className="text-3xl font-bold">30 MAMA Tokens</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 2: Earn */}
            <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                        <div className="lg:w-1/2">
                            <div className="inline-block mb-4">
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    STEP 2
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Earn MAMA Tokens on Stellar
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Every completed milestone automatically awards you MAMA tokens—a digital asset on the Stellar blockchain. Your tokens are real, secure, and entirely yours.
                            </p>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">How Tokens Are Earned</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex gap-3">
                                            <span className="text-blue-600">•</span>
                                            <span><strong>Quick Quizzes:</strong> 3-10 MAMA tokens per quiz (5-15 min each)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-blue-600">•</span>
                                            <span><strong>Health Milestones:</strong> 5-15 MAMA tokens per milestone</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-blue-600">•</span>
                                            <span><strong>Learning Modules:</strong> 10-20 MAMA tokens (varies by module depth)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-blue-600">•</span>
                                            <span><strong>Bonus Achievements:</strong> Extra tokens for consistency streaks and milestones</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>What makes MAMA tokens special:</strong> They're issued on the Stellar network, meaning they're portable, secure, and represent real value. You own them completely—no app required to hold them.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Token Dashboard</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                            <span className="text-gray-600">Total Earned (This Month)</span>
                                            <span className="text-2xl font-bold text-green-600">127</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                            <span className="text-gray-600">Available to Spend</span>
                                            <span className="text-2xl font-bold text-blue-600">85</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                            <span className="text-gray-600">Pending (Not Yet Redeemed)</span>
                                            <span className="text-2xl font-bold text-gray-400">42</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Lifetime Tokens</span>
                                            <span className="text-2xl font-bold text-purple-600">312</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-6">
                                    <h3 className="font-bold mb-4">Token Growth Timeline</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span>Month 1</span>
                                            <span className="font-bold">30 tokens</span>
                                        </div>
                                        <div className="w-full bg-blue-500 h-2 rounded-full"></div>

                                        <div className="flex justify-between items-center pt-4">
                                            <span>Month 2</span>
                                            <span className="font-bold">45 tokens</span>
                                        </div>
                                        <div className="w-3/4 bg-blue-400 h-2 rounded-full"></div>

                                        <div className="flex justify-between items-center pt-4">
                                            <span>Month 3</span>
                                            <span className="font-bold">52 tokens</span>
                                        </div>
                                        <div className="w-4/5 bg-blue-400 h-2 rounded-full"></div>
                                    </div>
                                    <p className="text-blue-100 text-xs mt-6">
                                        💡 As you complete more activities, you unlock higher-value milestones and earn faster
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 3: Spend */}
            <section className="bg-white px-4 py-20 border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        <div className="lg:w-1/2">
                            <div className="inline-block mb-4">
                                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    STEP 3
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Spend With Our Partner Network
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Your MAMA tokens unlock access to verified healthcare providers, clinics, and services across Africa. Choose what matters most to your health journey.
                            </p>

                            <h3 className="font-bold text-gray-900 mb-4 text-lg">What You Can Get</h3>
                            <div className="grid gap-4 mb-8">
                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Prenatal Checkups</p>
                                    <p className="text-gray-600 text-sm">Ultrasounds, health screenings, and clinical visits with certified providers</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">40-80 MAMA tokens per visit</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Lab Tests & Screenings</p>
                                    <p className="text-gray-600 text-sm">Blood work, glucose tests, and other essential prenatal labs</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">25-50 MAMA tokens per test</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Birth Preparation Classes</p>
                                    <p className="text-gray-600 text-sm">Online and in-person classes on labor, delivery, and postpartum care</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">15-35 MAMA tokens per class</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Nutritionist Consultations</p>
                                    <p className="text-gray-600 text-sm">Personalized prenatal nutrition guidance and meal planning</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">20-40 MAMA tokens per session</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Mental Health Support</p>
                                    <p className="text-gray-600 text-sm">Counseling and therapy sessions with maternal health specialists</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">30-60 MAMA tokens per session</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-semibold text-gray-900 mb-2">Delivery & Postpartum Care</p>
                                    <p className="text-gray-600 text-sm">Maternity packages covering labor, delivery, and newborn care</p>
                                    <p className="text-purple-600 font-semibold text-sm mt-2">200-400 MAMA tokens (major milestone)</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 border border-purple-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Example: Spending Your Tokens</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">First Prenatal Checkup</h4>
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-bold">-60</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Clinic Mombasa • Ultrasound + Initial Assessment</p>
                                        <p className="text-xs text-gray-500 mt-2">✓ Completed May 15, 2024</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">Blood Work Screening</h4>
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-bold">-35</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Lab Partner Network • Full Prenatal Panel</p>
                                        <p className="text-xs text-gray-500 mt-2">✓ Completed May 20, 2024</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">Birth Prep Class</h4>
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-bold">-25</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Online Course • 4-week labor & delivery prep</p>
                                        <p className="text-xs text-gray-500 mt-2">✓ Completed June 5, 2024</p>
                                    </div>

                                    <div className="border-t-2 border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">Started with:</span>
                                            <span className="text-lg font-bold text-purple-600">127 tokens</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                            <span>Total spent:</span>
                                            <span className="font-semibold">120 tokens</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 bg-purple-200 rounded-lg p-3">
                                            <span className="font-semibold text-purple-900">Balance:</span>
                                            <span className="text-lg font-bold text-purple-900">7 tokens</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">✓ Result</p>
                                    <p className="text-sm text-gray-600">
                                        Three essential health services completed. Continue earning more tokens to access additional care and services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Ecosystem */}
            <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Our Growing Partner Network
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        We work with verified clinics, hospitals, and healthcare providers across Africa
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Healthcare Clinics</h3>
                            <p className="text-gray-600 mb-4">
                                Local prenatal clinics and maternity centers that accept MAMA tokens for checkups, screenings, and delivery services.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Obstetric facilities with trained midwives and doctors
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Emergency obstetric care capabilities
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Ultrasound and diagnostic equipment
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Educational Providers</h3>
                            <p className="text-gray-600 mb-4">
                                Organizations offering pregnancy classes, wellness programs, and maternal health education.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Birth preparation instructors
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Nutritionists and wellness coaches
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Mental health professionals
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Laboratory Networks</h3>
                            <p className="text-gray-600 mb-4">
                                Accredited labs providing prenatal testing, screenings, and diagnostic services.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Blood work and serology testing
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Glucose tolerance and anemia screening
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> STI and infectious disease testing
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Support Services</h3>
                            <p className="text-gray-600 mb-4">
                                Complementary services supporting maternal wellbeing throughout pregnancy.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Counseling and mental health services
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Fitness and prenatal exercise programs
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">→</span> Postpartum and lactation support
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Expanding Across Africa</h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            We're rapidly adding partners in Kenya, Nigeria, Uganda, South Africa, and beyond. All partners are vetted and committed to maternal health excellence.
                        </p>
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Become a Partner
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="bg-white px-4 py-20 border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Common Questions
                    </h2>

                    <div className="space-y-6">
                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                How long until I can spend my first tokens?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                You can start spending tokens immediately after your first milestone is completed—usually within 1-2 days. Most women earn enough for a basic checkup (40-60 tokens) within their first 2-3 weeks of activity.
                            </p>
                        </details>

                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                What if I don't spend my tokens?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                Your tokens don't expire. They remain in your Stellar wallet indefinitely. You can save them up for larger services (like delivery packages) or redeem them whenever it makes sense for your health journey.
                            </p>
                        </details>

                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                Are MAMA tokens real cryptocurrency?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                Yes. MAMA tokens are issued on the Stellar blockchain. Once earned, they're your property and can be held in any Stellar-compatible wallet. This means they have real value and are secure.
                            </p>
                        </details>

                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                What happens after delivery?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                Your MAMA platform evolves with you. After delivery, we have postpartum milestones, newborn health tracking, and services for new mothers. Your tokens continue to be earned and spent on postpartum and infant care services.
                            </p>
                        </details>

                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                Is there a fee to use MAMA?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                No. The app is completely free. You never pay to earn tokens. Our partner network has agreed to accept MAMA tokens at fixed rates—no hidden fees or markup.
                            </p>
                        </details>

                        <details className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition">
                            <summary className="font-bold text-lg text-gray-900 flex justify-between items-center">
                                Which countries are you available in?
                                <span className="text-xl">+</span>
                            </summary>
                            <p className="text-gray-600 mt-4">
                                We're currently live in Kenya, Nigeria, and Uganda, with rapid expansion to South Africa, Ghana, Tanzania, and other African nations. Check the app to see if we're available in your location.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Complete your first milestone today, earn your first MAMA tokens, and take control of your maternal health.
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                        Create Your Account
                    </button>
                </div>
            </section>
        </main>
    )
}