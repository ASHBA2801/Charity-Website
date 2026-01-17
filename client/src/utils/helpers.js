// Format currency in INR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format relative time
export const formatRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(date);
};

// Calculate days remaining
export const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

// Calculate percentage
export const calculatePercentage = (raised, target) => {
    return Math.min(Math.round((raised / target) * 100), 100);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// Get category label
export const getCategoryLabel = (category) => {
    const labels = {
        'education': 'Education',
        'health': 'Health',
        'environment': 'Environment',
        'disaster-relief': 'Disaster Relief',
        'animals': 'Animals',
        'community': 'Community',
        'other': 'Other'
    };
    return labels[category] || 'Other';
};

// Get status color
export const getStatusColor = (status) => {
    const colors = {
        'pending': 'warning',
        'active': 'success',
        'completed': 'primary',
        'disabled': 'danger'
    };
    return colors[status] || 'primary';
};

// Validate email
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password (min 6 characters)
export const isValidPassword = (password) => {
    return password.length >= 6;
};
