

import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../css/Item.css';
import Back from '../components/Back';
import Loading from '../components/Loading';
import Errors from '../components/Error';

import { Review } from "../interfaces.ts";
import type { Item } from "../interfaces.ts";

function Item() {
    const {id} = useParams();
    const [item, setItem] = useState<Item[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemError, setItemError] = useState<string>('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response: Response = await fetch(`http://localhost:3001/items/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item details');
                }
                const data: Item[] = await response.json();
                setItem(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Error fetching items:', errorMessage);
                setItemError('Failed to load item details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/items/${id}/reviews`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch {
                console.error('Failed to fetch item reviews');
            }
        };

        fetchItem();
        fetchReviews();
    }, [id]);

    if (loading) {
        return <Loading/>;
    }

    if (itemError) {
        return <Errors message={itemError}/>;
    }

    if (!item) {
        return <Errors message="Item not found"/>;
    }

    const getUserRating = (userId: number) => {
        const rating = reviews.find(r => r.userId === userId);
        return rating ? rating.rating : 0;
    };

    const averageRating = reviews.length > 0
        ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
        : 0;

    return (
        <>
            <div className="item-container">
                <h2 className="item-title">{item.name}</h2>
                <div className="average-rating">
                    <p><strong>Rating:</strong></p>
                    {[...Array(averageRating)].map((_, index) => (
                        <span key={index} className="stars" style={{color: 'gold'}}>
                            &#9733;
                        </span>
                    ))}
                    {[...Array(5 - averageRating)].map((_, index) => (
                        <span key={index} className="stars" style={{color: '#ddd'}}>
                            &#9733;
                        </span>
                    ))}
                </div>

                <p className="item-description">Description: {item.description}</p>
                <p className="item-category">{item.categoryName}</p>

                <h3 className="reviews-title">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h3>
                {reviews.length > 0 ? (
                    <div className="reviews-container">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <div className="review-rating">
                                    {[...Array(getUserRating(review.userId))].map((_, starIndex) => (
                                        <span key={starIndex} className="stars" style={{color: 'gold'}}>
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                                <p className="review-date">
                                    user {review.userId} - {new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).format(new Date(review.reviewDate))}
                                </p>
                                <p className="review-text">{review.reviewText}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-reviews-text">No reviews available for this item.</p>
                )}
            </div>
            <Back/>
        </>
    );
}

export default Item;

