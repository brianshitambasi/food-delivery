import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button, Row, Col, Image } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      alert('Please log in first to view your cart');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const total = cart?.items?.reduce((sum, item) => sum + (item.food.price * item.quantity), 0) || 0;
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleQuantityChange = async (foodId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      await updateQuantity(foodId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (foodId) => {
    if (window.confirm('Remove this item from your cart?')) {
      try {
        await removeFromCart(foodId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const getImageUrl = (foodName) => {
    const images = {
      'pizza': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop',
      'burger': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=100&h=100&fit=crop',
      'salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=100&h=100&fit=crop',
      'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop',
      'chicken': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=100&h=100&fit=crop',
      'rice': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop',
      'fish': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=100&h=100&fit=crop',
      'bbq': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=100&h=100&fit=crop',
    };

    const name = foodName.toLowerCase();
    for (const [key, url] of Object.entries(images)) {
      if (name.includes(key)) return url;
    }
    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop';
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="text-center my-5" style={{ minHeight: '60vh' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>í»’</div>
        <h3 className="blue-text">Your Cart is Empty</h3>
        <p className="text-muted">Looks like you haven't added any items yet.</p>
        <Link to="/menu">
          <Button variant="blue" size="lg" style={{ padding: '12px 40px', borderRadius: '30px' }}>
            Browse Menu
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="blue-text" style={{ fontSize: '2.5rem' }}>
          Your Cart
          <span className="text-muted" style={{ fontSize: '1rem', marginLeft: '10px' }}>
            ({itemCount} items)
          </span>
        </h1>
        <Link to="/menu">
          <Button variant="outline-blue">Continue Shopping</Button>
        </Link>
      </div>

      <ListGroup variant="flush">
        {cart.items.map(item => (
          <ListGroup.Item key={item._id} className="py-3">
            <Row className="align-items-center">
              <Col xs={2} md={1}>
                <Image 
                  src={getImageUrl(item.food.name)} 
                  alt={item.food.name}
                  rounded
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop';
                  }}
                />
              </Col>
              <Col xs={5} md={5}>
                <h5 className="mb-0">{item.food.name}</h5>
                <span className="text-muted">${item.food.price.toFixed(2)}</span>
              </Col>
              <Col xs={3} md={3}>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleQuantityChange(item.food._id, item.quantity - 1)}
                    disabled={updating || item.quantity <= 1}
                  >
                    <FaMinus />
                  </Button>
                  <span className="mx-2" style={{ minWidth: '30px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleQuantityChange(item.food._id, item.quantity + 1)}
                    disabled={updating}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </Col>
              <Col xs={2} md={2} className="text-end">
                <div>
                  <span className="blue-text fw-bold">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <Button 
                  variant="link" 
                  className="text-danger p-0 mt-1"
                  onClick={() => handleRemoveItem(item.food._id)}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FaTrash /> Remove
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Row className="mt-4">
        <Col md={6}>
          <div className="p-3" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
            <h5 className="blue-text">Order Summary</h5>
            <div className="d-flex justify-content-between">
              <span>Subtotal ({itemCount} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Delivery Fee</span>
              <span>$0.00</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span className="blue-text">Total</span>
              <span className="blue-text">${total.toFixed(2)}</span>
            </div>
          </div>
        </Col>
        <Col md={6} className="text-end d-flex flex-column justify-content-end">
          <Link to="/checkout">
            <Button variant="blue" size="lg" style={{ padding: '12px 50px', borderRadius: '30px' }}>
              Proceed to Checkout â†’
            </Button>
          </Link>
          <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
            Free delivery on orders over $50
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
