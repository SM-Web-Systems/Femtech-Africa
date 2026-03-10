import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    Femtech
                </Link>

                {/* Navigation Links */}
                <div className="flex gap-8">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        About
                    </Link>
                    <Link
                        href="/quizzes"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        Quizzes
                    </Link>
                </div>
            </div>
        </nav>
    );
}