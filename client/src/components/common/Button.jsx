const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0',
        secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:shadow-secondary-500/40 hover:-translate-y-0.5',
        outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const classes = [
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
