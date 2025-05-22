"use client";

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // Current rating (0-5)
  onRatingChange?: (rating: number) => void; // Optional: makes the component interactive
  size?: number; // Size of the stars in pixels
  className?: string;
  totalStars?: number;
}

export function StarRating({
  rating,
  onRatingChange,
  size = 20,
  className,
  totalStars = 5,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starValue: number) => {
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (onRatingChange) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center space-x-0.5", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        // For half stars, if rating is 3.5, starValue 3 < 3.5, starValue 4 is not.
        // A star is half-filled if its value - 0.5 equals the rating, e.g. star 4 (value) - 0.5 = 3.5
        const isHalfFilled = !isFilled && rating > index && rating < starValue;


        return (
          <button
            key={starValue}
            type="button"
            disabled={!onRatingChange}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "p-0 bg-transparent border-none",
              onRatingChange ? "cursor-pointer" : "cursor-default"
            )}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                'transition-colors duration-150',
                isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50 fill-muted-foreground/20',
                isHalfFilled && 'text-yellow-400' // Half star logic will use custom SVG if needed or rely on fill
              )}
              fillRule={isHalfFilled ? 'nonzero' : 'evenodd'} // this won't make it half by itself
            >
              {isHalfFilled && (
                <defs>
                  <linearGradient id={`grad-${starValue}`}>
                    <stop offset="50%" stopColor="hsl(var(--primary))" /> {/* approx yellow-400 */}
                    <stop offset="50%" stopColor="hsl(var(--muted-foreground)/0.2)" />
                  </linearGradient>
                </defs>
              )}
            </Star>
            
          </button>
        );
      })}
    </div>
  );
}
