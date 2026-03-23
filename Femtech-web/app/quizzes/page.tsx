import QuizzesList from "../components/quizzes/QuizzesList";

export default function Quizzes() {
    return (
        <main className="min-h-screen bg-white">
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4">
                {/* Quizzes List Section */}
                <QuizzesList />
            </section>



        </main>
    )
}