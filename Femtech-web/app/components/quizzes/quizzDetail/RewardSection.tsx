'use client';

interface RewardSectionProps {
    rewardAmount: number;
    rewardEarned: boolean;
    rewardAlreadyClaimed: boolean;
}

export default function RewardSection({
    rewardAmount,
    rewardEarned,
    rewardAlreadyClaimed,
}: RewardSectionProps) {
    if (rewardAlreadyClaimed) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-900 font-semibold mb-1">
                    You have already claimed {rewardAmount} MAMA tokens for this quiz
                </p>
            </div>
        );
    }

    if (rewardEarned) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-900 font-semibold mb-1">
                    You earned {rewardAmount} MAMA tokens!
                </p>
                <p className="text-sm text-green-800">These have been added to your wallet.</p>
            </div>
        );
    }

    return null;
}