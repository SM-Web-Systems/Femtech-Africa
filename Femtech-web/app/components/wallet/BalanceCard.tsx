interface BalanceCardProps {
    xlmBalance: string;
    mamaBalance: string;
    totalValue: string;
}

export default function BalanceCard({ xlmBalance, mamaBalance, totalValue }: BalanceCardProps) {
    return (
        <div>
            {/* Balance Cards Grid */}
            < div className="space-y-4" >
                {/* XLM Balance Card */}
                < div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl border border-purple-500/20 hover:-translate-y-2 transition-transform duration-300" >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-xs font-semibold uppercase tracking-wider opacity-80">
                                XLM Balance
                            </p>
                            <p className="text-purple-200 text-xs font-medium mt-1">Stellar Lumens</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-white">
                                {xlmBalance}
                            </p>
                            <p className="text-purple-100 text-xs opacity-75 mt-1">Primary token</p>
                        </div>
                    </div>
                </div >

                {/* MAMA Balance Card */}
                < div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl border border-blue-500/20 hover:-translate-y-2 transition-transform duration-300" >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider opacity-80">
                                MAMA Balance
                            </p>
                            <p className="text-blue-200 text-xs font-medium mt-1">MAMA Tokens</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-white">
                                {mamaBalance}
                            </p>
                            <p className="text-blue-100 text-xs opacity-75 mt-1">Community token</p>
                        </div>
                    </div>
                </div >

                {/* Total Value Card */}
                < div className="bg-gradient-to-r from-emerald-600 via-green-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl border border-green-500/20 hover:-translate-y-2 transition-transform duration-300" >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-xs font-semibold uppercase tracking-wider opacity-80">
                                Total Value
                            </p>
                            <p className="text-green-200 text-xs font-medium mt-1">Combined Value</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-white">
                                {totalValue}
                            </p>
                            <p className="text-green-100 text-xs opacity-75 mt-1">XLM + MAMA</p>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    )
}