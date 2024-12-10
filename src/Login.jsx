import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css'; // Ensure this file exists and styles are correct
import { useAuth } from './_context/AuthContext'; // Use the custom hook
import { toast , Toaster} from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState(''); // To display server-side errors
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state
  const [isEditing, setIsEditing] = useState(false); // To toggle confirmation for the email
  const [confirmedEmail, setConfirmedEmail] = useState(''); // To store the transcribed email before confirmation
  const [isListening, setIsListening] = useState(false); // To track if speech recognition is active
 const [showModal , setshowmodal] = useState(false);
 const [ppin , setppin] = useState()
  const {login} = useAuth();
  const [user , setuser] = useState()

  const showToast = () => {
    toast.success('Login succesfully', {
      duration: 4000, // Optional: Time in ms
    });
  }

  const showerror = () => {
    toast.error('Please enter correct security pin', {
      duration: 4000, // Optional: Time in ms
    });
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startSpeechRecognition = (fieldName) => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(fieldName); // Indicate that speech recognition is active
      console.log(`Speech recognition started for ${fieldName}`);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false); // Reset if there is an error
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSpeechRecognitionResult(fieldName, transcript);
      setIsListening(false); // Reset listening state after result
    };

    recognition.start();
  };

  const handleSpeechRecognitionResult = (fieldName, transcript) => {
    let correctedTranscript = transcript;

    if (fieldName === 'email' || fieldName === 'password') {
      // Handle "dot" and "at" and other common misinterpretations
      correctedTranscript = correctedTranscript
        .replace(/\sdot\s/g, '.')              // Replace "dot" with "."
        .replace(/\sat\s/g, '@')               // Replace " at " with "@"
        .replace(/\sthe\srate\s/g, '@')        // Replace "the rate" with "@"
        .replace(/\s+/, '');                   // Trim extra spaces (if any)

      // If "@" is already present, avoid adding another one
      if (correctedTranscript.includes('@')) {
        correctedTranscript = correctedTranscript.replace(/therate/g, '@');
      }

      if (correctedTranscript.includes('@@')) {
        correctedTranscript = correctedTranscript.replace(/@@/g, '@');
      }

      if (correctedTranscript.includes(' gmail')) {
        correctedTranscript = correctedTranscript.replace(/ gmail/g, 'gmail');
      }
      // Set corrected email
   
        if (correctedTranscript.includes(' ')) {
          correctedTranscript = correctedTranscript.replace(/ /g, '');
         
      }
      setConfirmedEmail(correctedTranscript);
      setIsEditing(true);
    }



    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: correctedTranscript,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiError(''); // Reset API error

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:4000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong');
        }

        const data = await response.json();
      setuser(data)
      setIsSubmitted(true);
      setshowmodal(true)
      login()
        // Optional: Store token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);

        // Redirect to the home page
       // navigate('/home'); // Using the useNavigate hook to redirect
      } catch (error) {
        console.error('Error during login:', error);
        setApiError(error.message);
        setIsSubmitted(false);
      }
    } else {
      setIsSubmitted(false);
    }
  };

  // Initialize useNavigate hook
  const navigate = useNavigate();

  const handleModalClose = () => {
    setshowmodal(false)
  }

  const handleProceed = () => {
    console.log(user)
    if(ppin == user?.user.pin){
      showToast();
      navigate('/home');
      setshowmodal(false)
      setppin()
    }else{
      showerror()
      localStorage.removeItem('token')
      setshowmodal(false)
      setppin()
    }
  }


const handlesetppin = (e) => {
setppin(e.target.value)
}

  return (
    <>  
      <Toaster />
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
              {apiError && <Alert variant="danger">{apiError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <div className="d-flex position-relative">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      isInvalid={!!errors.email}
                    />
                    <Button
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#ccc',
                        color: '#ccc',
                        padding: '0.25rem 0.5rem',
                        marginTop: -7,
                        border: '#fff',
                      }}
                      variant="outline-secondary"
                      className="position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => startSpeechRecognition('email')}
                    >
                      {isListening === 'email' ? '🔴' : '🎙️'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email Confirmation Section */}
                {isEditing && (
                  <Alert variant="info">
                    You said: {confirmedEmail}. Is that correct? 
                    <Button variant="link" onClick={() => setIsEditing(false)}>Edit</Button>
                    <Button variant="primary" onClick={() => {
                      // setFormData((prevData) => ({ ...prevData, email: confirmedEmail }));
                      setIsEditing(false);
                    }}>Confirm</Button>
                  </Alert>
                )}

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex align-items-center position-relative">
                    <Form.Control
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field"
                      isInvalid={!!errors.password}
                    />
                    <Button
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#ccc',
                        color: '#ccc',
                        padding: '0.25rem 0.5rem',
                        marginTop: -7,
                        border: '#fff',
                      }}
                      variant="outline-secondary"
                      className="ms-2 position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Button
                    variant="outline-secondary"
                    className="position-absolute top-55 end-0 -mt-20"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#ccc',
                      color: '#ccc',
                      padding: '0.25rem 0.5rem',
                      border: '#fff',
                      top: 250,
                      marginRight: 65,
                    }}
                    onClick={() => startSpeechRecognition('password')}
                  >
                    {isListening === 'password' ? '🔴' : '🎙️'}
                  </Button>
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

      <Modal show={showModal} onHide={handleModalClose} centered>
<Modal.Header closeButton>
  <Modal.Title>Welcome Back!</Modal.Title>
</Modal.Header>
<Modal.Body>

  <p> Enter your security pin</p>
  <Form.Control
                      type="number"
                      name="pppin"
                      placeholder="Enter pin"
                      onChange={handlesetppin}
                      className="input-field"
                      value={ppin}
                    /></Modal.Body>
<Modal.Footer>
  <Button variant="primary" onClick={handleProceed}>
    Proceed to Dashboard
  </Button>
</Modal.Footer>
</Modal>
    </Container>
</> 

  );
};

export default Login;
