import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      API.get('/orders/myorders')
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

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
      'carbonara': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop',
    };

    const name = foodName.toLowerCase();
    for (const [key, url] of Object.entries(images)) {
      if (name.includes(key)) return url;
    }
    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=100&h=100&fit=crop';
  };

  const getStatusColor = (status) => {
    const colors = {
      'placed': 'warning',
      'preparing': 'info',
      'out_for_delivery': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={getStatusColor(status)}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) return <Container className="my-5 text-center">Loading orders...</Container>;

  return (
    <Container className="my-5">
      <h1 className="blue-text mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center my-5">
          <h4>No orders yet.</h4>
          <p>Start ordering delicious food from our menu!</p>
          <Link to="/menu">
            <Button variant="blue">Browse Menu</Button>
          </Link>
        </div>
      ) : (
        orders.map(order => (
          <Card key={order._id} className="mb-4 card-blue">
            <Card.Body>
              <Row>
                <Col md={2}>
                  <div className="d-flex flex-wrap">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <Image
                        key={idx}
                        src={getImageUrl(item.name)}
                        alt={item.name}
                        rounded
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          marginRight: '5px',
                          marginBottom: '5px',
                          border: '2px solid #1a73e8'
                        }}
                      />
                    ))}
                    {order.items.length > 2 && (
                      <div 
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '70px',
                          height: '70px',
                          background: '#e8f0fe',
                          borderRadius: '8px',
                          border: '2px solid #1a73e8',
                          color: '#1a73e8',
                          fontWeight: 'bold'
                        }}
                      >
                        +{order.items.length - 2}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={5}>
                  <div>
                    <strong className="blue-text">Order #{order._id.slice(-6)}</strong>
                    <p className="mb-1">
                      <span className="text-muted">Total:</span> 
                      <strong className="blue-text ms-2">${order.totalAmount.toFixed(2)}</strong>
                    </p>
                    <p className="mb-1">
                      <span className="text-muted">Items:</span>
                      <span className="ms-2">
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {item.name} 
                            <span className="text-muted"> (x{item.quantity})</span>
                          </span>
                        ))}
                      </span>
                    </p>
                    <p className="mb-0 text-muted small">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Col>
                <Col md={5}>
                  <div className="text-end">
                    <div className="mb-2">
                      {getStatusBadge(order.status)}
                      <Badge bg={order.isPaid ? 'success' : 'danger'} className="ms-2">
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-start">
                      <p className="mb-0 small">
                        <span className="text-muted">Delivery:</span>
                        <span className="ms-2">{order.shippingAddress?.street}, {order.shippingAddress?.city}</span>
                      </p>
                      <p className="mb-0 small">
                        <span className="text-muted">Phone:</span>
                        <span className="ms-2">{order.phone || 'N/A'}</span>
                      </p>
                      <p className="mb-0 small">
                        <span className="text-muted">Payment:</span>
                        <span className="ms-2">{order.paymentMethod?.toUpperCase() || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;
