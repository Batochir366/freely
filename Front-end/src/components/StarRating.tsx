import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
    </div>
  );
}
