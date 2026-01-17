import { Link } from 'react-router-dom';
import { HiClock, HiUsers } from 'react-icons/hi';
import { formatCurrency, getDaysRemaining, calculatePercentage, getCategoryLabel } from '../../utils/helpers';

const CampaignCard = ({ campaign }) => {
    const { _id, title, shortDescription, image, targetAmount, raisedAmount, donorsCount, endDate, category } = campaign;
    const percentage = calculatePercentage(raisedAmount, targetAmount);
    const daysLeft = getDaysRemaining(endDate);

    return (
        <Link to={`/campaigns/${_id}`} className="block group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                            {getCategoryLabel(category)}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {shortDescription}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-primary-600">{formatCurrency(raisedAmount)}</span>
                            <span className="text-gray-500">of {formatCurrency(targetAmount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <HiUsers className="text-primary-500" />
                            <span>{donorsCount} donors</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiClock className="text-primary-500" />
                            <span>{daysLeft} days left</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CampaignCard;
