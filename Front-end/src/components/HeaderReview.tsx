export const HeaderReview = () => {
  return (
    <div className="px-6 pt-6 pb-1 bg-white">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 mb-6 border-b-2 border-gray-200">
        <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">
          Students & Courses
        </div>
        <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">
          Ratings & Reviews
        </div>
        <div className="text-gray-500 font-medium text-sm uppercase tracking-wide text-left md:text-right">
          Posted Date
        </div>
      </div>
    </div>
  );
};
