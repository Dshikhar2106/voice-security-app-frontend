import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './_context/AuthContext'; // Import your authentication context
import Sidebar from './Sidebar';

const ProfilePage = () => {
  const { currentUser } = useAuth(); // Assuming you have a method to update user profile
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts , setposts] = useState([])
  // Initial form data (can be fetched from an API or context)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    number: '',
    password: '',
    confirmPassword: '',
    profileImage: '' // Add profile image field
  });
console.log(user , 'jjjj' , posts);
  const [isEditing, setIsEditing] = useState(false); // Track if the user is editing the profile

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
    }
  };

  // Handle form submission (Update Profile)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated');
        return;
      }

      // Make the API call to update the profile
      const response = await fetch('http://localhost:4000/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token to authorize
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          // dob: formData.dob,
          gender: formData.gender,
          number: formData.number,
          image: formData.profileImage, // Include profile image
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      getProfile()
      // setUser(data?.user);
      alert('Profile updated successfully');
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const fetchMyPosts = async (e) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/getMyPosts?userId=${e}`);
      const data = await response.json();

      if (response.ok) {
        setposts(data.posts); // Set posts data to state
      } else {
        console.error("Error fetching posts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  useEffect(() => {
    getProfile();
    fetchMyPosts(user?.id)
  }, []);

  // Fetch user profile data when the page loads
  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage or cookies if saved

      // Make sure the token exists
      if (!token) {
        console.log('User is not authenticated.');
        return;
      }

      // Call the API to get the profile data
      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setUser(data?.user);

      // Set form data with the fetched profile data
      setFormData({
        name: data?.user?.name || '',
        email: data?.user?.email || '',
        dob: data?.user?.dob || '',
        gender: data?.user?.gender || '',
        number: data?.user?.number || '',
        profileImage: data?.user?.image || '', // Fill the profile image if available
        password: '', // Empty password field
        confirmPassword: '' // Empty confirm password field
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }

  return (
    <Container fluid>
      <Row>
        <Sidebar />
        <Col md={6} className="mx-auto">
          <Card className="p-4">

            {isEditing ? (
              <Form onSubmit={handleSubmit}>
                {/* Name */}
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* Date of Birth */}
                {/* <Form.Group controlId="dob" className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group> */}

                {/* Gender */}
                <Form.Group controlId="gender" className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>

                {/* Phone Number */}
                <Form.Group controlId="number" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* Profile Image */}
                <Form.Group controlId="profileImage" className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                {/* Display the selected profile image */}
                {formData.image && (
                  <div className="mb-3">
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{ width: '150px', height: '150px' }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" variant="primary" className="me-2">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Form>
            ) : (
              <div>
                {/* Profile Display */}
                <div className="text-center mb-3">
                  <Image
                    src={user.image || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    roundedCircle
                    width="150"
                    height="150"
                    style={{objectFit: 'cover'}}
                  />
                </div>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p><strong>Date of Birth:</strong> {user.dob}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Phone Number:</strong> {user.number}</p>

                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}

{
             posts.reverse().map((post) => (
              <Card key={post.id} className="mb-3 post-card mt-5">
                <Card.Body>
                  <Card.Title>{post.user}</Card.Title>
                  <Card.Subtitle className="text-muted">{post.date}</Card.Subtitle>
                  <Card.Text>{post.content}</Card.Text>
                  {/* Display post media (image) */}
                  {post.media && (
                    <div className="post-media mb-3">
                      <img src={post.media} style={{  objectFit:'contain'}} alt="post media" className="img-fluid" />
                    </div>
                  )}

                  <Button variant="outline-secondary">Like</Button>
                  <Button variant="outline-secondary" className="ms-2">Comment</Button>
                </Card.Body>
              </Card>
            )
             )
           }
        
          
          </Card>
        </Col>
      </Row>
      <Row> 

     
      </Row>
    </Container>
  );
};

export default ProfilePage;
