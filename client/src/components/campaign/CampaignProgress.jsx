import { formatCurrency, calculatePercentage } from '../../utils/helpers';

const CampaignProgress = ({ raised, target, showLabels = true, size = 'md' }) => {
    const percentage = calculatePercentage(raised, target);

    const heights = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    return (
        <div className="w-full">
            {showLabels && (
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(raised)}</span>
                        <span className="text-gray-500 ml-1">raised</span>
                    </div>
                    <div className="text-right">
                        <span className="text-gray-500">of </span>
                        <span className="font-semibold text-gray-700">{formatCurrency(target)}</span>
                    </div>
                </div>
            )}
            <div className={`bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-semibold text-primary-600">{percentage}% complete</span>
            </div>
        </div>
    );
};

export default CampaignProgress;
