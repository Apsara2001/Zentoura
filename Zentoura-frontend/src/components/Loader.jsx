const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-8 w-8 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export const SkeletonCard = () => {
    return (
        <div className="glass-card rounded-xl p-6 animate-pulse">
            <div className="skeleton h-48 rounded-lg mb-4"></div>
            <div className="skeleton h-6 rounded mb-2"></div>
            <div className="skeleton h-4 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between">
                <div className="skeleton h-4 rounded w-1/4"></div>
                <div className="skeleton h-4 rounded w-1/4"></div>
            </div>
        </div>
    );
};

export const SkeletonList = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default Loader;
