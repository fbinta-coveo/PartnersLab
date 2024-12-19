import React, { useState } from 'react';
import { Star, StarHalf, StarBorder } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const StarRating = ({ initialRating }) => {
  const [rating, setRating] = useState(initialRating);

  return (
    <div >
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            style={{ cursor: 'pointer' }}
          >
            {rating >= ratingValue ? (
              <Star sx={{ color: 'gold' }} />
            ) : rating >= ratingValue - 0.5 ? (
              <StarHalf sx={{ color: 'gold' }} />
            ) : (
              <StarBorder sx={{ color: 'gold' }} />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;