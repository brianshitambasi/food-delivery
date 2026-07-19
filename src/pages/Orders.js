import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Row, Col, Image, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
      'pizza': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop',
      'burger': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=150&h=150&fit=crop',
      'salad': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=150&h=150&fit=crop',
      'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop',
      'chicken': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=150&h=150&fit=crop',
      'rice': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop',
      'fish': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=150&h=150&fit=crop',
      'bbq': 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=150&h=150&fit=crop',
      'carbonara': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop',
      'taco': 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=150&h=150&fit=crop',
      'sushi': 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?w=150&h=150&fit=crop',
      'dessert': 'https://images.pexels.com/photos/1120468/pexels-photo-1120468.jpeg?w=150&h=150&fit=crop',
    };

    const name = foodName.toLowerCase();
    for (const [key, url] of Object.entries(images)) {
      if (name.includes(key)) return url;
    }
    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop';
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

  const getStatusIcon = (status) => {
    const icons = {
      'placed': <FaClock className="me-1" />,
      'preparing': <FaUtensils className="me-1" />,
      'out_for_delivery': <FaTruck className="me-1" />,
      'delivered': <FaCheckCircle className="me-1" />,
      'cancelled': <FaTimesCircle className="me-1" />
    };
    return icons[status] || <FaClock className="me-1" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'placed': 'Order Placed',
      'preparing': 'Preparing',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={getStatusColor(status)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
        {getStatusIcon(status)} {getStatusLabel(status)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" style={{ color: '#1a73e8', width: '3rem', height: '3rem' }} />
        <h4 className="blue-text mt-3">Loading your orders...</h4>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="blue-text" style={{ fontSize: '2.5rem' }}>
          My Orders
          <span className="text-muted" style={{ fontSize: '1rem', marginLeft: '10px' }}>
            ({orders.length} orders)
          </span>
        </h1>
        {orders.length > 0 && (
          <Link to="/menu">
            <Button variant="outline-blue">Order More</Button>
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center my-5" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}></div>
          <h4 className="blue-text">No Orders Yet</h4>
          <p className="text-muted">You haven't placed any orders yet. Start exploring our menu!</p>
          <Link to="/menu">
            <Button variant="blue" size="lg" style={{ padding: '12px 40px', borderRadius: '30px' }}>
              Browse Menu
            </Button>
          </Link>
        </div>
      ) : (
        orders.map(order => (
          <Card key={order._id} className="mb-4 card-blue shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                {/* Order Images */}
                <Col md={2}>
                  <div className="d-flex flex-wrap">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <Image
                        key={idx}
                        src={getImageUrl(item.name)}
                        alt={item.name}
                        rounded
                        style={{
                          width: '75px',
                          height: '75px',
                          objectFit: 'cover',
                          marginRight: '5px',
                          marginBottom: '5px',
                          border: '2px solid #1a73e8'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=150&h=150&fit=crop';
                        }}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div 
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '75px',
                          height: '75px',
                          background: '#e8f0fe',
                          borderRadius: '8px',
                          border: '2px solid #1a73e8',
                          color: '#1a73e8',
                          fontWeight: 'bold'
                        }}
                      >
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </Col>

                {/* Order Info */}
                <Col md={4}>
                  <div>
                    <strong className="blue-text" style={{ fontSize: '1.1rem' }}>
                      Order #{order._id.slice(-6)}
                    </strong>
                    <p className="mb-1 mt-2">
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
                    <p className="mb-1">
                      <span className="text-muted">Total:</span> 
                      <strong className="blue-text ms-2">${order.totalAmount.toFixed(2)}</strong>
                    </p>
                    <p className="mb-0 text-muted small">
                      <FaClock className="me-1" />
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Col>

                {/* Order Status & Details */}
                <Col md={6}>
                  <div className="text-end">
                    <div className="mb-2">
                      {getStatusBadge(order.status)}
                      <Badge 
                        bg={order.isPaid ? 'success' : 'danger'} 
                        className="ms-2"
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      >
                        {order.isPaid ? '✅ Paid' : '❌ Unpaid'}
                      </Badge>
                    </div>

                    <div className="mt-3 text-start" style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <Row>
                        <Col md={6}>
                          <p className="mb-0 small">
                            <span className="text-muted">. Delivery:</span>
                            <span className="ms-2">{order.shippingAddress?.street}</span>
                          </p>
                          <p className="mb-0 small">
                            <span className="text-muted">City:</span>
                            <span className="ms-2">{order.shippingAddress?.city}</span>
                          </p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-0 small">
                            <span className="text-muted">. Phone:</span>
                            <span className="ms-2">{order.phone || 'N/A'}</span>
                          </p>
                          <p className="mb-0 small">
                            <span className="text-muted">. Payment:</span>
                            <span className="ms-2">{order.paymentMethod?.toUpperCase() || 'N/A'}</span>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Order Items Detail (expandable) */}
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">Order Items:</small>
                <div className="d-flex flex-wrap mt-1">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="me-3 mb-1">
                      <Image
                        src={getImageUrl(item.name)}
                        alt={item.name}
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          objectFit: 'cover', 
                          borderRadius: '50%',
                          marginRight: '5px'
                        }}
                      />
                      {item.name} (x{item.quantity})
                      <span className="text-muted ms-1">${(item.price * item.quantity).toFixed(2)}</span>
                      {idx < order.items.length - 1 && <span className="text-muted mx-1">|</span>}
                    </span>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;
