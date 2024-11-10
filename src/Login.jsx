import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import './App.css'; // Ensure this file exists and styles are correct

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email is not valid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission initiated"); // Debugging step
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      console.log('Form submitted successfully');
    } else {
      setIsSubmitted(false);
      console.log('Form submission failed due to validation errors', validationErrors);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00bcd4, #3f51b5)',
      }}
    >
      <Row>
        <Col md={12}>
          <Card className="p-4 login-card">
            <Card.Body>
              <h3 className="text-center mb-4">Login to Your Account</h3>
              
              {isSubmitted && <Alert variant="success">Login successful!</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 button-transition"
                >
                  Login
                </Button>

                <div className="text-center mt-3">
                  <a href="/signup" className="text-link">
                    Don't have an account? Sign up
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
