const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
            w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-xl
            transition-all duration-200 placeholder:text-gray-400
            focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'}
          `}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
