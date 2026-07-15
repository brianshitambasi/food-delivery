import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, Row, Col, Table, Button, Form, Modal, Alert, 
  Image, Badge, Card, Nav, Tab 
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  });
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: ''
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, foodsRes, usersRes] = await Promise.all([
        API.get('/admin/orders'),
        API.get('/admin/foods'),
        API.get('/admin/users'),
      ]);
      setOrders(ordersRes.data);
      setFoods(foodsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFoodForm({ ...foodForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }, [foodForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880,
    multiple: false
  });

  const handleFoodSubmit = async () => {
    try {
      setUploading(true);
      if (editingFood) {
        const res = await API.put(`/foods/${editingFood._id}`, foodForm);
        setFoods(foods.map(f => f._id === editingFood._id ? res.data : f));
      } else {
        const res = await API.post('/foods', foodForm);
        setFoods([...foods, res.data]);
      }
      setShowFoodModal(false);
      resetFoodForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving food');
    } finally {
      setUploading(false);
    }
  };

  const resetFoodForm = () => {
    setEditingFood(null);
    setFoodForm({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
    setPreviewImage('');
    setError('');
  };

  const openEditFood = (food) => {
    setEditingFood(food);
    setFoodForm(food);
    setPreviewImage(food.image || '');
    setShowFoodModal(true);
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Delete this food item permanently?')) {
      try {
        await API.delete(`/foods/${id}`);
        setFoods(foods.filter(f => f._id !== id));
      } catch (err) {
        setError('Failed to delete food');
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Delete this order permanently?')) {
      try {
        await API.delete(`/admin/orders/${orderId}`);
        setOrders(orders.filter(o => o._id !== orderId));
      } catch (err) {
        setError('Failed to delete order');
      }
    }
  };

  const handleUserSubmit = async () => {
    try {
      if (editingUser) {
        const res = await API.put(`/admin/users/${editingUser._id}`, userForm);
        setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
      } else {
        const res = await API.post('/admin/users', userForm);
        setUsers([...users, res.data]);
      }
      setShowUserModal(false);
      resetUserForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user');
    }
  };

  const resetUserForm = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'user', phone: '' });
    setError('');
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || ''
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user permanently?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
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

  const getImageUrl = (food) => {
    if (food.image && food.image.startsWith('http')) return food.image;
    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=50&h=50&fit=crop';
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h3>Loading admin dashboard...</h3>
      </Container>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Container className="my-5 text-center">
        <h3 className="text-danger">Access Denied</h3>
        <p>You must be an admin to view this page.</p>
        <Link to="/" className="btn btn-blue">Go Home</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5" fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="blue-text">Admin Dashboard</h1>
        <Button variant="blue" onClick={fetchAllData}>Refresh</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-blue">
            <Card.Body className="text-center">
              <h3 className="blue-text">{orders.length}</h3>
              <p className="text-muted">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-blue">
            <Card.Body className="text-center">
              <h3 className="blue-text">{foods.length}</h3>
              <p className="text-muted">Menu Items</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-blue">
            <Card.Body className="text-center">
              <h3 className="blue-text">{users.length}</h3>
              <p className="text-muted">Registered Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-blue">
            <Card.Body className="text-center">
              <h3 className="blue-text">
                {orders.filter(o => o.status === 'placed' || o.status === 'preparing').length}
              </h3>
              <p className="text-muted">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="orders" className="blue-text">
              Orders ({orders.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="foods" className="blue-text">
              Menu ({foods.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users" className="blue-text">
              Users ({users.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders">
            <h3 className="blue-text mt-3">Orders Management</h3>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No orders found</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                      <td>
                        {order.items.slice(0, 2).map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <Badge bg={order.isPaid ? 'success' : 'danger'}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => viewOrderDetails(order)} className="me-1">
                          View
                        </Button>
                        <Form.Select
                          size="sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{ width: '120px', display: 'inline-block' }}
                        >
                          <option value="placed">Placed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                        <Button variant="danger" size="sm" onClick={() => deleteOrder(order._id)} className="mt-1">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tab.Pane>

          <Tab.Pane eventKey="foods">
            <div className="d-flex justify-content-between align-items-center mt-3">
              <h3 className="blue-text">Menu Management</h3>
              <Button variant="blue" onClick={() => { setEditingFood(null); setShowFoodModal(true); }}>
                Add New Food
              </Button>
            </div>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Available</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No foods found</td></tr>
                ) : (
                  foods.map(food => (
                    <tr key={food._id}>
                      <td>
                        <Image 
                          src={getImageUrl(food)} 
                          alt={food.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=50&h=50&fit=crop';
                          }}
                        />
                      </td>
                      <td>{food.name}</td>
                      <td>${food.price.toFixed(2)}</td>
                      <td>{food.category}</td>
                      <td>
                        <Badge bg={food.isAvailable ? 'success' : 'danger'}>
                          {food.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td>{food.rating > 0 ? `★ ${food.rating.toFixed(1)}` : 'No ratings'}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => openEditFood(food)} className="me-1">
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteFood(food._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tab.Pane>

          <Tab.Pane eventKey="users">
            <div className="d-flex justify-content-between align-items-center mt-3">
              <h3 className="blue-text">User Management</h3>
              <Button variant="blue" onClick={() => { setEditingUser(null); setShowUserModal(true); }}>
                Add New User
              </Button>
            </div>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No users found</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <>
                            <Button variant="warning" size="sm" onClick={() => openEditUser(user)} className="me-1">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                              Delete
                            </Button>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-muted">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal show={showFoodModal} onHide={() => { setShowFoodModal(false); resetFoodForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingFood ? 'Edit Food' : 'Add New Food'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="Food name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Food description"
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={foodForm.price}
                        onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        value={foodForm.category}
                        onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                        placeholder="e.g., Pizza, Burger, Salad"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Available for ordering"
                    checked={foodForm.isAvailable}
                    onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Food Image</Form.Label>
                  <div 
                    {...getRootProps()} 
                    style={{
                      border: '2px dashed #1a73e8',
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isDragActive ? '#e8f0fe' : '#fff',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <input {...getInputProps()} />
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '150px', 
                          objectFit: 'contain',
                          borderRadius: '5px'
                        }} 
                      />
                    ) : (
                      <div>
                        <p className="text-muted">Drag & drop an image here</p>
                        <p className="text-muted small">or click to select</p>
                        <p className="text-muted small">Supported: JPG, PNG, GIF, WebP</p>
                      </div>
                    )}
                  </div>
                  {previewImage && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => { setPreviewImage(''); setFoodForm({ ...foodForm, image: '' }); }}
                    >
                      Remove Image
                    </Button>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowFoodModal(false); resetFoodForm(); }}>
            Cancel
          </Button>
          <Button variant="blue" onClick={handleFoodSubmit} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Food'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row>
                <Col md={6}>
                  <h6 className="blue-text">Order Information</h6>
                  <p><strong>Order ID:</strong> #{selectedOrder._id}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Payment:</strong> {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase()}</p>
                  <p><strong>Total Amount:</strong> <strong className="blue-text">${selectedOrder.totalAmount.toFixed(2)}</strong></p>
                </Col>
                <Col md={6}>
                  <h6 className="blue-text">Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone || 'N/A'}</p>
                  <h6 className="blue-text mt-3">Shipping Address</h6>
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </Col>
              </Row>
              <hr />
              <h6 className="blue-text">Order Items</h6>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total</strong></td>
                    <td><strong className="blue-text">${selectedOrder.totalAmount.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserModal} onHide={() => { setShowUserModal(false); resetUserForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="Full name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="Email address"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="Phone number"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password {editingUser && '(leave blank to keep current)'}</Form.Label>
              <Form.Control
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder={editingUser ? 'New password' : 'Password'}
                required={!editingUser}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowUserModal(false); resetUserForm(); }}>
            Cancel
          </Button>
          <Button variant="blue" onClick={handleUserSubmit}>
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
