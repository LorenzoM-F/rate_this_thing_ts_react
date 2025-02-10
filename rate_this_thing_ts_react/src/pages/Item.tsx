

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Item.css';
import Back from '../components/Back.tsx';
import Loading from '../components/Loading.tsx';
import Errors from '../components/Error.tsx';
import { motion } from "framer-motion";

import { Items, Review, User } from "../interfaces.ts";

function Item() {
    const { id } = useParams();
    const [item, setItem] = useState<Items>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemError, setItemError] = useState<string>('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response: Response = await fetch(`https://75.119.131.245:8443/v1/items/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item details');
                }
                const data: Items = await response.json();
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
                const response = await fetch(`https://75.119.131.245:8443/v1/items/${id}/reviews`);
                if (response.ok) {
                    const data: Review[] = await response.json();
                    setReviews(data);
                }
            } catch {
                console.error('Failed to fetch item reviews');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(`https://75.119.131.245:8443/v1/users`);
                if (response.ok) {
                    const data: User[] = await response.json();
                    setUsers(data);
                }
            } catch {
                console.error('Failed to fetch item reviews');
            }
        };

        fetchItem();
        fetchReviews();
        fetchUsers();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (itemError) {
        return <Errors message={itemError} />;
    }

    if (!item) {
        return <Errors message="Item not found" />;
    }

    const getUserRating = (userId: number) => {
        const rating = reviews.find(r => r.userId === userId);
        return rating ? rating.rating : 0;
    };

    const averageRating = reviews.length > 0
        ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
        : 0;

    const getUserName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? user.firstName : 'user';
    }

    return (
        <>
            <div className="item-container">
                <h2 className="item-title">{item.name}</h2>
                <div className="average-rating">
                    <p><strong>Rating:</strong></p>
                    {[...Array(averageRating)].map((_, index) => (
                        <span key={index} className="stars" style={{ color: 'gold' }}>
                            &#9733;
                        </span>
                    ))}
                    {[...Array(5 - averageRating)].map((_, index) => (
                        <span key={index} className="stars" style={{ color: '#ddd' }}>
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
                            <motion.div key={index} className="review-card"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.2 }}
                            >
                                <div className="review-rating">
                                    {[...Array(getUserRating(review.userId))].map((_, starIndex) => (
                                        <span key={starIndex} className="stars" style={{ color: 'gold' }}>
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                                <p className="review-date">
                                    {getUserName(review.userId)} - {new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).format(new Date(review.reviewDate))}
                                </p>
                                <p className="review-text">{review.reviewText}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="no-reviews-text">No reviews available for this item.</p>
                )}
            </div>
            <Back />
        </>
    );
}

export default Item;

