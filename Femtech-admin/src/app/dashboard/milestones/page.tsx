"use client";

const mockMilestones = [
  { id: "1", name: "Complete Profile", category: "onboarding", reward: 10, completions: 145, active: true },
  { id: "2", name: "First Prenatal Visit", category: "healthcare", reward: 100, completions: 89, active: true },
  { id: "3", name: "Weekly Check-in", category: "engagement", reward: 5, completions: 432, active: true },
  { id: "4", name: "Nutrition Quiz", category: "education", reward: 20, completions: 67, active: true },
  { id: "5", name: "Exercise Goal", category: "health", reward: 15, completions: 54, active: true },
  { id: "6", name: "Kick Counter Session", category: "tracking", reward: 5, completions: 234, active: true },
  { id: "7", name: "Emergency Contact Added", category: "safety", reward: 10, completions: 112, active: true },
  { id: "8", name: "Referral Bonus", category: "growth", reward: 25, completions: 23, active: true },
];

export default function MilestonesPage() {
  const totalCompletions = mockMilestones.reduce((sum, m) => sum + m.completions, 0);
  const totalTokens = mockMilestones.reduce((sum, m) => sum + (m.completions * m.reward), 0);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: "bg-blue-100 text-blue-700",
      healthcare: "bg-green-100 text-green-700",
      engagement: "bg-purple-100 text-purple-700",
      education: "bg-yellow-100 text-yellow-700",
      health: "bg-pink-100 text-pink-700",
      tracking: "bg-indigo-100 text-indigo-700",
      safety: "bg-red-100 text-red-700",
      growth: "bg-orange-100 text-orange-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Milestones</h1>
        <p className="text-gray-500">Manage milestone definitions and track completions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Milestones</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{mockMilestones.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Completions</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalCompletions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Tokens Distributed</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Avg per User</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">4.2</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Milestone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Reward</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Completions</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total Tokens</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{m.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(m.category)}`}>
                      {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-pink-600">{m.reward} MAMA</td>
                  <td className="px-6 py-4 text-gray-800">{m.completions}</td>
                  <td className="px-6 py-4 text-gray-600">{(m.completions * m.reward).toLocaleString()} MAMA</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {m.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
