export default function About() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">About Femtech</h1>
                    <p className="text-xl text-blue-100">
                        Our mission is to support the mental health and wellbeing of pregnant mothers
                        across Africa through accessible, compassionate, and evidence-based resources.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="px-4 py-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Femtech Africa was founded with a simple belief: every pregnant mother deserves
                            access to mental health support and resources. We recognized that maternal mental
                            health is often overlooked, yet it's crucial for both mother and baby.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We're committed to creating a supportive community where pregnant mothers can
                            access professional guidance, connect with peers, and learn evidence-based
                            strategies for mental wellness during pregnancy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <span className="text-2xl">💙</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Compassion</h3>
                                    <p className="text-gray-700">We understand the challenges of pregnancy and approach every interaction with empathy.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-2xl">🔬</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Evidence-Based</h3>
                                    <p className="text-gray-700">All our resources and advice are grounded in scientific research and professional expertise.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-2xl">🤝</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Community</h3>
                                    <p className="text-gray-700">We believe in the power of connection and building supportive networks for mothers.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-2xl">♿</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Accessible</h3>
                                    <p className="text-gray-700">Mental health support should be available to everyone, regardless of location or economic status.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-50 px-4 py-20 border-t border-gray-200">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
                    <p className="text-lg text-gray-700">
                        Join our community and take the first step toward better mental health.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                        Join Now
                    </button>
                </div>
            </section>
        </main>
    );
}