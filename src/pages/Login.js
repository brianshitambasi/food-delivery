import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('password');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await API.post('/auth/request-otp', { email });
      setSuccess('OTP sent! Check your email or console.');
      setShowOTP(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '480px' }}>
      <div className="text-center mb-4">
        <h2 className="blue-text">Welcome</h2>
        <p className="text-muted">Login to continue</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-center mb-3">
        <Button 
          variant={loginMode === 'password' ? 'blue' : 'outline-blue'} 
          size="sm"
          onClick={() => { setLoginMode('password'); setShowOTP(false); setError(''); setSuccess(''); }}
          className="me-2"
        >
          Password
        </Button>
        <Button 
          variant={loginMode === 'otp' ? 'blue' : 'outline-blue'} 
          size="sm"
          onClick={() => { setLoginMode('otp'); setShowOTP(false); setError(''); setSuccess(''); }}
        >
          Email (OTP)
        </Button>
      </div>

      {loginMode === 'password' ? (
        <Form onSubmit={handlePasswordLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="blue" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </Form>
      ) : (
        <div>
          <Form onSubmit={handleRequestOTP}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="blue" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </Form>

          {showOTP && (
            <Form onSubmit={handleVerifyOTP} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </Form.Group>
              <Button variant="blue" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
            </Form>
          )}
        </div>
      )}

      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Container>
  );
};

export default Login;
