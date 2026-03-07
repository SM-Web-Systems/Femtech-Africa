"use client";

const mockStats = {
  totalUsers: 156,
  totalTokensMinted: 12500,
  totalRedemptions: 47,
  milestonesCompleted: 342,
};

const mockActivity = [
  { id: 1, type: "mint", user: "+27***4567", amount: 100, time: "2 min ago" },
  { id: 2, type: "redeem", user: "+27***8901", amount: -50, time: "15 min ago" },
  { id: 3, type: "signup", user: "+27***2345", amount: 0, time: "1 hour ago" },
  { id: 4, type: "mint", user: "+27***6789", amount: 10, time: "2 hours ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here is what is happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.totalUsers}</p>
              <p className="text-green-500 text-sm mt-1">+12% this week</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tokens Minted</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.totalTokensMinted.toLocaleString()}</p>
              <p className="text-green-500 text-sm mt-1">+8% this week</p>
            </div>
            <div className="bg-pink-500 p-3 rounded-lg text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Redemptions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.totalRedemptions}</p>
              <p className="text-green-500 text-sm mt-1">+15% this week</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-2xl">🎁</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Milestones</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.milestonesCompleted}</p>
              <p className="text-green-500 text-sm mt-1">+23% this week</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-2xl">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {mockActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {item.type === "mint" && "💰"}
                  {item.type === "redeem" && "🎁"}
                  {item.type === "signup" && "👤"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.type === "mint" && "Token Minted"}
                    {item.type === "redeem" && "Tokens Redeemed"}
                    {item.type === "signup" && "New User"}
                  </p>
                  <p className="text-xs text-gray-500">{item.user}</p>
                </div>
                <div className="text-right">
                  {item.amount !== 0 && (
                    <p className={`text-sm font-semibold ${item.amount > 0 ? "text-pink-500" : "text-green-500"}`}>
                      {item.amount > 0 ? "+" : ""}{item.amount} MAMA
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold">Pending Rewards</h3>
              <p className="text-2xl font-bold mt-1">23</p>
              <p className="text-sm opacity-75">Users waiting to claim</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold">Active Today</h3>
              <p className="text-2xl font-bold mt-1">89</p>
              <p className="text-sm opacity-75">Users active in last 24h</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold">Token Velocity</h3>
              <p className="text-2xl font-bold mt-1">2.3x</p>
              <p className="text-sm opacity-75">Avg tokens/user/week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
