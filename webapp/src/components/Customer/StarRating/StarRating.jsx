import React from 'react';

const StarRating = ({ rating }) => {
    return (
        <div className="review-star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa-star mini-star ${star <= rating ? 'fa-solid' : 'fa-regular'}`}
                ></i>
            ))}
        </div>
    );
};

export default StarRating;
