import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import API from '../services/api';
import FoodCard from '../components/FoodCard';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/foods')
      .then(res => {
        setFoods(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = foods;

    if (search.trim()) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      result = result.filter(f => f.category === category);
    }

    switch (sortBy) {
      case 'popular':
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [search, category, sortBy, foods]);

  const categories = ['All', ...new Set(foods.map(f => f.category))];

  if (loading) return <Container className="my-5 text-center">Loading menu...</Container>;

  return (
    <Container className="my-4">
      <h1 className="blue-text text-center mb-4">Our Menu</h1>

      <Row className="mb-4">
        <Col md={4} className="mb-2">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="text-muted mb-3">{filtered.length} results</div>

      <Row>
        {filtered.length === 0 ? (
          <p className="text-center">No foods found.</p>
        ) : (
          filtered.map(food => (
            <Col key={food._id} sm={6} md={4} lg={3} className="mb-4">
              <FoodCard food={food} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Menu;
