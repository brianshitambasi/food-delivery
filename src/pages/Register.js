import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState('password');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePasswordRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, phone });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      setSuccess('OTP sent to your email! Please check.');
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
        <h2 className="blue-text">Create Account</h2>
        <p className="text-muted">Join us and start ordering</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-center mb-3">
        <Button 
          variant={registerMode === 'password' ? 'blue' : 'outline-blue'} 
          size="sm"
          onClick={() => { setRegisterMode('password'); setShowOTP(false); setError(''); setSuccess(''); }}
          className="me-2"
        >
          With Password
        </Button>
        <Button 
          variant={registerMode === 'otp' ? 'blue' : 'outline-blue'} 
          size="sm"
          onClick={() => { setRegisterMode('otp'); setShowOTP(false); setError(''); setSuccess(''); }}
        >
          With Email (OTP)
        </Button>
      </div>

      {registerMode === 'password' ? (
        <Form onSubmit={handlePasswordRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
              minLength="6"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number (optional)</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </Form.Group>
          <Button variant="blue" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </Form>
      ) : (
        <div>
          <Form onSubmit={handleRequestOTP}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Form.Text className="text-muted">
                We'll send a verification code to this email
              </Form.Text>
            </Form.Group>
            <Button variant="blue" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Form>

          {showOTP && (
            <Form onSubmit={handleVerifyOTP} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
                <Form.Text className="text-muted">
                  Check your email for the verification code
                </Form.Text>
              </Form.Group>
              <Button variant="blue" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>
            </Form>
          )}
        </div>
      )}

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Container>
  );
};

export default Register;
