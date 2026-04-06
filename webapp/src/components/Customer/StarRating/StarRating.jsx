import React from 'react';

const StarRating = ({ rating, interactive = false, hoverRating = 0, onRatingChange, onHoverChange }) => {
    return (
        <div className={interactive ? "stars-container" : "review-star-rating"}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = interactive ? (hoverRating || rating) >= star : star <= rating;
                
                return (
                    <i
                        key={star}
                        className={`fa-star ${interactive ? 'star-icon' : 'mini-star'} ${isFilled ? 'fa-solid' + (interactive ? ' filled' : '') : 'fa-regular'}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                        onMouseEnter={interactive && onHoverChange ? () => onHoverChange(star) : undefined}
                        onMouseLeave={interactive && onHoverChange ? () => onHoverChange(0) : undefined}
                    ></i>
                );
            })}
        </div>
    );
};

export default StarRating;
