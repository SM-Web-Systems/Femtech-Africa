import PartnerList from "../components/redemptions/PartnerList";

export default function Partners() {
    return (
        <main className="min-h-screen bg-white">
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4">
                {/* Partners List Section */}
                <PartnerList />
            </section>
        </main>
    )
}