import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      alert('Please log in first to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(food._id, quantity);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const getImageUrl = () => {
    if (food.image && !imgError) return food.image;
    
    // Use Pexels images - these are stable and work
    const images = {
      'pizza': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=300&h=200&fit=crop',
      'burger': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=300&h=200&fit=crop',
      'salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop',
      'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=300&h=200&fit=crop',
      'chicken': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300&h=200&fit=crop',
      'rice': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=300&h=200&fit=crop',
      'fish': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300&h=200&fit=crop',
      'bbq': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=300&h=200&fit=crop',
    };

    const name = food.name.toLowerCase();
    for (const [key, url] of Object.entries(images)) {
      if (name.includes(key)) return url;
    }

    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=300&h=200&fit=crop';
  };

  return (
    <Card className="card-blue h-100">
      <Card.Img
        variant="top"
        src={getImageUrl()}
        alt={food.name}
        style={{ height: '180px', objectFit: 'cover' }}
        onError={() => setImgError(true)}
      />
      <Card.Body>
        <Card.Title className="blue-text">{food.name}</Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
          {food.description ? food.description.substring(0, 60) + '...' : ''}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="blue-text">${food.price.toFixed(2)}</h5>
          <div className="d-flex align-items-center">
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '60px', marginRight: '8px' }}
            />
            <Button variant="blue" onClick={handleAdd} size="sm">
              Add
            </Button>
          </div>
        </div>
        {food.rating > 0 && (
          <div className="mt-2">
            <span className="text-warning">★ {food.rating.toFixed(1)}</span>
            <span className="text-muted ms-2">({food.numReviews} reviews)</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
