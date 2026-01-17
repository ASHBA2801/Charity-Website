const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div
            className={`${sizes[size]} border-gray-200 border-t-primary-500 rounded-full animate-spin`}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
};

export default Loader;
