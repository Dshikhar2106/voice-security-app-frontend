import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { toast , Toaster} from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    number: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email is not valid';

    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.number) newErrors.number = 'Phone number is required';
    else if (!phoneRegex.test(formData.number)) newErrors.number = 'Phone number is not valid';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); // Clear any previous API errors
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:4000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Convert form data to JSON
        });

        const data = await response.json();

        if (response.ok) {
          showToast()
          setIsSubmitted(true);
          setFormData({
            name: '',
            email: '',
            dob: '',
            gender: '',
            number: '',
            password: '',
            confirmPassword: '',
          });
        } else {
          errToast()
          setApiError(data.error || 'An error occurred while submitting the form.');
        }
      } catch (err) {
        errToast()
        setApiError('Failed to connect to the server. Please try again later.');
        console.error('Error:', err);
      }
    } else {
      setIsSubmitted(false);
    }
  };

  const showToast = () => {
    toast.success('You registered succesfully', {
      duration: 4000, // Optional: Time in ms
    });
  }


  const errToast = () => {
    toast.error('Something went wrong', {
      duration: 4000, // Optional: Time in ms
    });
  }


  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        overflow: 'hidden',
      }}
    >
      <Toaster/>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4" style={{ borderRadius: '8px' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: '#1877f2' }}>
                Create a New Account
              </h2>

              {isSubmitted && <Alert variant="success">Registered successfully!</Alert>}
              {apiError && <Alert variant="danger">{apiError}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicDOB" className="mt-3">
                  <Form.Control
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.dob && <small className="text-danger">{errors.dob}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicGender" className="mt-3">
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Control>
                  {errors.gender && <small className="text-danger">{errors.gender}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicNumber" className="mt-3">
                  <Form.Control
                    type="text"
                    name="number"
                    placeholder="Phone Number"
                    value={formData.number}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.number && <small className="text-danger">{errors.number}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    style={{ height: '45px', fontSize: '1em' }}
                  />
                  {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4"
                  style={{
                    backgroundColor: '#1877f2',
                    borderColor: '#1877f2',
                    height: '50px',
                    fontSize: '1.2em',
                  }}
                >
                  Sign Up
                </Button>

                <div className="text-center mt-3">
                  <a href="/login" style={{ textDecoration: 'none', color: '#1877f2' }}>
                    Already have an account? Login
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

export default Signup;
