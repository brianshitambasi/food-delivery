import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Navbar expand="lg" className="navbar-blue" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          FoodDelivery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            )}
            <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/cart">
                  Cart
                  {itemCount > 0 && (
                    <Badge bg="danger" pill className="ms-1">{itemCount}</Badge>
                  )}
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
