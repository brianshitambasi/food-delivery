import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Carousel, Spinner, Card } from 'react-bootstrap';
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

  const carouselItems = [
    {
      title: 'Welcome to Utamu',
      subtitle: 'Your premium food delivery service',
      desc: 'Delicious meals delivered to your doorstep. Order now and experience the taste of quality.',
      img: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Order Now',
      buttonLink: '/menu'
    },
    {
      title: '. Authentic Italian Pizza',
      subtitle: 'Hand-tossed, wood-fired perfection',
      desc: 'Freshly baked with premium ingredients. Every bite is a taste of Italy.',
      img: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'View Menu',
      buttonLink: '/menu'
    },
    {
      title: '. Gourmet Burgers',
      subtitle: 'Juicy, messy, and absolutely delicious',
      desc: '100% premium beef patties, fresh vegetables, and secret sauces.',
      img: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Order Now',
      buttonLink: '/menu'
    },
    {
      title: '. Authentic Tacos',
      subtitle: 'Mexican street food at its finest',
      desc: 'Soft tortillas filled with seasoned meat, fresh salsa, and zesty lime.',
      img: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Explore',
      buttonLink: '/menu'
    },
    {
      title: '. Fresh Sushi',
      subtitle: 'Premium Japanese cuisine',
      desc: 'Expertly crafted rolls with the freshest ingredients. A culinary experience.',
      img: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Order Sushi',
      buttonLink: '/menu'
    },
    {
      title: '. Pasta Perfection',
      subtitle: 'Italian classics made with love',
      desc: 'Homemade pasta, rich sauces, and authentic Italian flavors.',
      img: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'See Pasta',
      buttonLink: '/menu'
    },
    {
      title: '. Fresh & Healthy Salads',
      subtitle: 'Nourish your body with wholesome ingredients',
      desc: 'Farm-fresh vegetables, protein-rich toppings, and delicious dressings.',
      img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Order Salad',
      buttonLink: '/menu'
    },
    {
      title: '. Grilled Chicken',
      subtitle: 'Perfectly seasoned, flame-grilled to perfection',
      desc: 'Succulent chicken with mouthwatering marinades. A protein lover\'s delight.',
      img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Order Now',
      buttonLink: '/menu'
    },
    {
      title: '. Desserts & Treats',
      subtitle: 'Indulge your sweet tooth',
      desc: 'Decadent cakes, pastries, and desserts made fresh daily.',
      img: 'https://images.pexels.com/photos/1120468/pexels-photo-1120468.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'View Desserts',
      buttonLink: '/menu'
    },
    {
      title: '. Refreshing Drinks',
      subtitle: 'Quench your thirst with our premium beverages',
      desc: 'Fresh juices, smoothies, milkshakes, and more.',
      img: 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'See Drinks',
      buttonLink: '/menu'
    },
    {
      title: '. Order & Enjoy',
      subtitle: 'How to get started with Utamu',
      desc: '1. Create your account 2. Browse our menu 3. Place your order 4. Enjoy your meal!',
      img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Get Started',
      buttonLink: '/login'
    },
    {
      title: '. Join Utamu Today',
      subtitle: 'Sign up for exclusive offers and deals',
      desc: 'Create your account and get 10% off your first order! Don\'t miss out.',
      img: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=1600&h=600&fit=crop',
      buttonText: 'Sign Up Now',
      buttonLink: '/register'
    }
  ];

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" style={{ color: '#1a73e8', width: '3rem', height: '3rem' }} />
        <h4 className="blue-text mt-3">Loading delicious food...</h4>
      </Container>
    );
  }

  return (
    <>
      {/* Full Carousel with 10+ items */}
      <Carousel fade indicators={true} controls={true} interval={5000}>
        {carouselItems.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={item.img}
              alt={item.title}
              style={{ height: '650px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=1600&h=600&fit=crop';
              }}
            />
            <Carousel.Caption 
              className="bg-dark bg-opacity-50 rounded p-5" 
              style={{ 
                bottom: '15%', 
                maxWidth: '700px', 
                margin: '0 auto',
                left: '10%',
                right: '10%'
              }}
            >
              <h2 className="display-3 fw-bold mb-3" style={{ color: '#D4AF37' }}>
                {item.title}
              </h2>
              <h4 className="text-white mb-3">{item.subtitle}</h4>
              <p className="text-white fs-5 mb-4">{item.desc}</p>
              <Link to={item.buttonLink}>
                <Button variant="blue" size="lg" style={{ padding: '12px 40px', borderRadius: '30px' }}>
                  {item.buttonText}
                </Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Featured Foods Section */}
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="blue-text mb-0" style={{ fontSize: '2.5rem' }}>. Popular Dishes</h2>
          <Link to="/menu">
            <Button variant="outline-blue" size="lg">View All Menu</Button>
          </Link>
        </div>
        <Row>
          {foods.slice(0, 8).map(food => (
            <Col key={food._id} sm={6} md={4} lg={3} className="mb-4">
              <FoodCard food={food} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Promo Banner */}
      <Container className="my-5">
        <Card 
          className="p-5 text-center" 
          style={{ 
            background: 'linear-gradient(135deg, #1a73e8, #42a5f5)', 
            color: '#fff',
            borderRadius: '20px'
          }}
        >
          <h2 className="display-4 fw-bold">. Get 20% Off Your First Order</h2>
          <p className="fs-5 mt-3">Use promo code: <strong style={{ color: '#D4AF37', fontSize: '1.8rem' }}>UTAMU20</strong></p>
          <p className="mb-4">Sign up now and start saving on delicious meals!</p>
          <div className="mt-3">
            <Link to="/register">
              <Button variant="light" size="lg" style={{ padding: '12px 40px', borderRadius: '30px', color: '#1a73e8' }}>
                Sign Up Now
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Home;
