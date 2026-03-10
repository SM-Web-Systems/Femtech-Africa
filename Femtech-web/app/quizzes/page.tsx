import QuizzesList from "../components/QuizzesList";

export default function Quizzes() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Quizzes</h1>
                    <p className="text-xl text-blue-100">
                        Our mission is to support the mental health and wellbeing of pregnant mothers
                        across Africa through accessible, compassionate, and evidence-based resources.
                    </p>
                </div>
            </section>

            {/* Quizzes List Section */}
            <QuizzesList />

        </main>
    )
}