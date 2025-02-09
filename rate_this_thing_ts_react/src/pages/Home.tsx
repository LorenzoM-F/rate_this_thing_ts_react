import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Loading from '../components/Loading.tsx';
import ScrollToTopButton from '../components/ScrollToTopButton.tsx';
import { motion } from "framer-motion";

import { Items } from '../interfaces.ts';
import { Category } from "../interfaces.ts";

function Home() {
    const [items, setItems] = useState<Items[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemsError, setItemsError] = useState<string>('');
    const [categoriesError, setCategoriesError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(5);

    useEffect(() => {
        const fetchItems = async (): Promise<void> => {
            try {
                const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Inc1SjhRQmsyUkV6X2lSQ1F5Z013NSJ9.eyJpc3MiOiJodHRwczovL25pbm9jb2Rlcy5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8Njc0NGM3MTRlNWExYzBmYjg2MTFhOWJlIiwiYXVkIjoiaHR0cHM6Ly9uaW5vYXBpLmNvbSIsImlhdCI6MTczOTEyMzY4NywiZXhwIjoxNzM5MjEwMDg3LCJndHkiOiJwYXNzd29yZCIsImF6cCI6IjJiNjhMNTZJSUU5enhvRmF3dmZrT2YxR21VQ1p0RXhIIiwicGVybWlzc2lvbnMiOlsiYWRtaW4iXX0.HIGZk2z7Y5G2CHJR2U5G9cznuqlI8-cOwb3izZ9f6MrDbY40LR5pJMXEbYPS5mXT2gRUhgt58-huJBSGK2Xp4Qb2cN0p9daGK6CTKl8jH3QQbkQk10yY5-CaqAEo8O2t9tCNv7Dzmr9fL2jU5TxzKi_hxl4UpOsZoIt_6Yu0dWBsZBLtJCAGovJMHeJvKdtwcKBcTv7tQCUAOvdq3FI2vTpu9PpsNg4D56vh9OAgTs0DKa3xFoL3nL71ShwW_yD1kirOWPexv3uTC9BErYbWwqovqFyoNn0aAIp7az6rJpsoskHp6ZnV2NVFAO6kLuj5G1HCxYrz9STyyoDAYxPXzg'; // Replace with the actual token

                const response: Response = await fetch('http://localhost:3001/items', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }

                const data: Items[] = await response.json();
                setItems(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Error fetching items:', errorMessage);
                setItemsError('Failed to load items.');
            } finally {
                setLoading(false);
            }
        };



        const fetchCategories = async () => {
            try {
                const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Inc1SjhRQmsyUkV6X2lSQ1F5Z013NSJ9.eyJpc3MiOiJodHRwczovL25pbm9jb2Rlcy5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8Njc0NGM3MTRlNWExYzBmYjg2MTFhOWJlIiwiYXVkIjoiaHR0cHM6Ly9uaW5vYXBpLmNvbSIsImlhdCI6MTczOTEyMzY4NywiZXhwIjoxNzM5MjEwMDg3LCJndHkiOiJwYXNzd29yZCIsImF6cCI6IjJiNjhMNTZJSUU5enhvRmF3dmZrT2YxR21VQ1p0RXhIIiwicGVybWlzc2lvbnMiOlsiYWRtaW4iXX0.HIGZk2z7Y5G2CHJR2U5G9cznuqlI8-cOwb3izZ9f6MrDbY40LR5pJMXEbYPS5mXT2gRUhgt58-huJBSGK2Xp4Qb2cN0p9daGK6CTKl8jH3QQbkQk10yY5-CaqAEo8O2t9tCNv7Dzmr9fL2jU5TxzKi_hxl4UpOsZoIt_6Yu0dWBsZBLtJCAGovJMHeJvKdtwcKBcTv7tQCUAOvdq3FI2vTpu9PpsNg4D56vh9OAgTs0DKa3xFoL3nL71ShwW_yD1kirOWPexv3uTC9BErYbWwqovqFyoNn0aAIp7az6rJpsoskHp6ZnV2NVFAO6kLuj5G1HCxYrz9STyyoDAYxPXzg'; // Replace with the actual token

                const response = await fetch('http://localhost:3001/categories', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data: Category[] = await response.json();
                setCategories(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Error fetching categories:', errorMessage);
                setCategoriesError('Failed to load categories.');
            }
        };

        fetchItems();
        fetchCategories();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 5);
    };


    // Define filteredItems before using it in JSX
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? item.categoryName.toUpperCase() === selectedCategory.name : true;
        return matchesSearch && matchesCategory;
    });

    const handleCategoryClick = (category: Category): void => {
        setSelectedCategory(category);
    };

    const handleRemoveSelection = (): void => {
        setSelectedCategory(null);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="app-name">Rate This Thing</h1>
                <div className="burger-menu">
                    <input type="checkbox" id="menu-toggle" />
                    <label htmlFor="menu-toggle" className="menu-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <nav className="menu">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </nav>
                </div>
            </header>

            <div className="categories-container">
                <div className="categories-scroll">
                    {categoriesError ? (
                        <p className="error-text">{categoriesError}</p>
                    ) : (
                        categories.map((category) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: category.id * 0.2 }}>
                                <button
                                    key={category.id}
                                    className="category-button"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category.name}
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

            </div>
            {selectedCategory && (
                <div className="selected-category">
                    <p>Selected Category: {selectedCategory.name}</p>
                    <button onClick={handleRemoveSelection} className="remove-selection-button">
                        Remove Selection
                    </button>
                </div>
            )}

            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search for places..."
                    className="search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="items-container">
                {itemsError ? (
                    <p className="error-text">{itemsError}</p>
                ) : (
                    <>
                        {filteredItems.length > 0 ? (
                            <>
                                {filteredItems.slice(0, visibleCount).map((item, index) => (
                                    <Link to={`/item/${item.id}`} key={item.id} className="item-card-link">
                                        <motion.div
                                            className="item-card"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.2 }} // Staggered effect
                                        >
                                            <h3>{item.name}</h3>
                                            <div>
                                                {[...Array(5)].map((_, starIndex) => (
                                                    <span key={starIndex} className="stars" style={{ color: 'gold' }}>
                                                        &#9733;
                                                    </span>
                                                ))}
                                            </div>
                                            <p>{item.description}</p>
                                        </motion.div>
                                    </Link>
                                ))}
                                {visibleCount < filteredItems.length && (
                                    <button onClick={handleShowMore} className="show-more-btn">
                                        Show More
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No items found for the selected category.</p>
                        )}
                    </>
                )}
            </div>
            <div className="home-container">
                {/* Your existing JSX */}
                <ScrollToTopButton />
            </div>
        </div>
    );
}

export default Home;

