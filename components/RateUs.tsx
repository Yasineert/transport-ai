'use client'

import React, { useState } from 'react';

export function RateUs() {
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = (rate: number) => {
    setRating(rate);
    // Handle the rating submission logic here
    console.log('User rated:', rate);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Rate Us</h2>
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            filled={star <= (rating || 0)}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
      {rating && <p className="mt-2">You rated this {rating} out of 5 stars!</p>}
    </div>
  );
}

interface StarProps {
  filled: boolean;
  onClick: () => void;
}

const Star: React.FC<StarProps> = ({ filled, onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{ cursor: 'pointer', color: filled ? 'gold' : 'gray' }}
    >
      ★
    </span>
  );
};
