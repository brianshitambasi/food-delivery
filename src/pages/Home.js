import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Carousel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/foods')
      .then(res => {
        setFoods(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" style={{ color: '#1a73e8', width: '3rem', height: '3rem' }} />
        <h4 className="blue-text mt-3">Loading delicious food...</h4>
      </Container>
    );
  }

  const carouselItems = [
    {
      title: 'Delicious Food',
      desc: 'Fresh and tasty meals delivered to your door',
      img: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=1200&h=400&fit=crop'
    },
    {
      title: 'Gourmet Burgers',
      desc: 'Juicy patties with premium toppings',
      img: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=1200&h=400&fit=crop'
    }
  ];

  return (
    <>
      <Carousel fade>
        {carouselItems.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={item.img}
              alt={item.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-4">
              <h3 className="blue-text">{item.title}</h3>
              <p>{item.desc}</p>
              <Link to="/menu">
                <Button variant="blue">Order Now</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container className="my-5">
        <h2 className="text-center blue-text mb-4">Popular Dishes</h2>
        <Row>
          {foods.slice(0, 8).map(food => (
            <Col key={food._id} sm={6} md={4} lg={3} className="mb-4">
              <FoodCard food={food} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
