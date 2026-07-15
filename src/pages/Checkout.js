import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    if (!user) {
      alert('Please log in first to checkout');
      navigate('/login');
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart?.items?.reduce((sum, item) => sum + (item.food.price * item.quantity), 0) || 0;

  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        phone: form.phone,
        paymentMethod: paymentMethod,
      };

      await API.post('/orders', orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="blue-text">Checkout</h1>
      <Row>
        <Col md={7}>
          <Form onSubmit={handleSubmit}>
            <h5 className="blue-text">Shipping Address</h5>
            <Form.Group className="mb-2">
              <Form.Control
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Control
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="zip"
                  placeholder="Zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Control
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Control
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <h5 className="mt-4 blue-text">Payment Method</h5>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="mpesa">M-Pesa</option>
              <option value="card">Credit Card</option>
              <option value="wallet">Wallet</option>
            </Form.Select>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Button variant="blue" type="submit" className="mt-3" disabled={loading}>
              {loading ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
            </Button>
          </Form>
        </Col>
        <Col md={5}>
          <div className="border p-3 rounded">
            <h5 className="blue-text">Order Summary</h5>
            {cart?.items.map(item => (
              <div key={item._id} className="d-flex justify-content-between py-1">
                <span>{item.food.name} x{item.quantity}</span>
                <span>${(item.food.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span className="blue-text">${total.toFixed(2)}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
