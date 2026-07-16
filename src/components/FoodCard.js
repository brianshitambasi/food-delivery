import React, { useState } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      alert('Please log in first to add items to cart');
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(food._id, quantity);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const getImageUrl = () => {
    if (food.image && !imgError) return food.image;
    
    // High-quality food images from Pexels
    const images = {
      'pizza': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600&h=400&fit=crop',
      'burger': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=600&h=400&fit=crop',
      'salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
      'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600&h=400&fit=crop',
      'chicken': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=600&h=400&fit=crop',
      'rice': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600&h=400&fit=crop',
      'fish': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=600&h=400&fit=crop',
      'bbq': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=600&h=400&fit=crop',
      'taco': 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=600&h=400&fit=crop',
      'sushi': 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?w=600&h=400&fit=crop',
      'dessert': 'https://images.pexels.com/photos/1120468/pexels-photo-1120468.jpeg?w=600&h=400&fit=crop',
      'drink': 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?w=600&h=400&fit=crop',
    };

    const name = food.name.toLowerCase();
    for (const [key, url] of Object.entries(images)) {
      if (name.includes(key)) return url;
    }

    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600&h=400&fit=crop';
  };

  return (
    <Card className="card-blue h-100 shadow-sm">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={getImageUrl()}
          alt={food.name}
          style={{ 
            height: '220px', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="hover-zoom"
          onError={() => setImgError(true)}
        />
        {!food.isAvailable && (
          <Badge 
            bg="danger" 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px',
              padding: '8px 15px',
              fontSize: '0.8rem'
            }}
          >
            Unavailable
          </Badge>
        )}
        {food.rating > 0 && (
          <Badge 
            bg="warning" 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px',
              color: '#333',
              padding: '8px 15px',
              fontSize: '0.8rem'
            }}
          >
            <FaStar className="me-1" /> {food.rating.toFixed(1)}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="blue-text mb-0" style={{ fontSize: '1.1rem' }}>
            {food.name}
          </Card.Title>
          <h5 className="blue-text mb-0">${food.price.toFixed(2)}</h5>
        </div>
        
        <Card.Text className="text-muted" style={{ fontSize: '0.85rem', flex: '1' }}>
          {food.description ? food.description.substring(0, 60) + '...' : ''}
        </Card.Text>
        
        <div className="mt-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ 
                  width: '60px', 
                  height: '38px',
                  borderRadius: '8px',
                  borderColor: '#1a73e8'
                }}
              />
            </div>
            <Button 
              variant="blue" 
              onClick={handleAdd} 
              size="sm"
              disabled={adding || !food.isAvailable}
              style={{ 
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaShoppingCart size={14} />
              {adding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
        
        {food.numReviews > 0 && (
          <div className="mt-2">
            <small className="text-muted">
              ★ {food.rating.toFixed(1)} ({food.numReviews} reviews)
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
