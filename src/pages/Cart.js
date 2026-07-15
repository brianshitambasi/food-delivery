import React, { useEffect } from 'react';
import { Container, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    if (!user) {
      alert('Please log in first to view your cart');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const total = cart?.items?.reduce((sum, item) => sum + (item.food.price * item.quantity), 0) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="text-center my-5">
        <h3>Your cart is empty.</h3>
        <Link to="/menu" className="btn btn-blue mt-3">Browse Menu</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="blue-text">Your Cart</h1>
      <ListGroup>
        {cart.items.map(item => (
          <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.food.name}</strong>
              <span className="text-muted ms-2">${item.food.price.toFixed(2)}</span>
            </div>
            <div>
              <span className="me-3">Qty: {item.quantity}</span>
              <span className="blue-text">${(item.food.price * item.quantity).toFixed(2)}</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Row className="mt-4">
        <Col md={{ span: 6, offset: 6 }} className="text-end">
          <h4 className="blue-text">Total: ${total.toFixed(2)}</h4>
          <Link to="/checkout">
            <Button variant="blue" size="lg">Proceed to Checkout</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
