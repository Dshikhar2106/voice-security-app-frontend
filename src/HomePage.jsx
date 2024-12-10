import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './_context/AuthContext'; // For authentication context
import './HomePage.css'; // Add your custom styles here
import Sidebar from './Sidebar';

const HomePage = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // State for managing posts
  const [posts, setPosts] = useState([
    { id: 1, user: 'John Doe', content: 'Hello, this is my first post!', date: '2024-12-08', media: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Akshay-Kumar.jpg' },
    { id: 2, user: 'Jane Smith', content: 'Loving this new platform!', date: '2024-12-07', media: null }
  ]);
  
  // State for creating a new post
  const [newPost, setNewPost] = useState('');
  const [media, setMedia] = useState(null); // State to store image
  const [mediaName, setMediaName] = useState(''); // State to store file name
  const [user , setuser] = useState()
  // Handle post submission
  const handlePostSubmit = () => {
    if (newPost.trim() || media) {
      const newPostObject = {
        id: posts.length + 1,
        user: 'Current User', // Replace with dynamic user name
        content: newPost,
        date: new Date().toLocaleDateString(),
        media: media, // Add media to post object
      };
      setPosts([newPostObject, ...posts]);
      setNewPost('');
      setMedia(null); // Reset media after post
      setMediaName('');
    }
  };

  // Handle media file upload (image or video)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType === 'image') {
        setMedia(URL.createObjectURL(file)); // Store image as an object URL
        setMediaName(file.name); // Store file name
      } else {
        alert('Please upload a valid image.');
      }
    }
  };

  // Logout functionality
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserData = (e) => {
console.log(e, 'dataflow');
setuser(e)
  }


  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Sidebar userData={getUserData}/>

        {/* Main Feed */}
        <Col md={9}>
          {/* Header */}
          <div className="header p-3">
            <Row>
              <Col>
                <h2>Welcome, {user?.name || 'User'}!</h2>
              </Col>
              <Col className="text-end">
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </Col>
            </Row>
          </div>

          {/* Create Post Section */}
          <Card className="p-4 mb-3">
            <h3>Create a New Post</h3>
            <InputGroup className="mb-3">
              <FormControl
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </InputGroup>

            {/* Custom File Upload */}
            <div className="file-upload-container">
              <label htmlFor="media" className="file-upload-button">
                Choose an Image
              </label>
              <input
                type="file"
                id="media"
                className="file-upload-input"
                accept="image/*"
                onChange={handleMediaChange}
              />
              {mediaName && <p className="file-upload-label">{mediaName}</p>}
            </div>

            {/* Display the selected image */}
            {media && (
              <div className="media-preview mb-3">
                <img src={media} alt="preview" className="img-fluid" />
              </div>
            )}

            <Button variant="primary" onClick={handlePostSubmit}>Post</Button>
          </Card>

          {/* Post Feed */}
          {posts.length === 0 ? (
            <p>No posts yet! Be the first to share something.</p>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="mb-3 post-card">
                <Card.Body>
                  <Card.Title>{post.user}</Card.Title>
                  <Card.Subtitle className="text-muted">{post.date}</Card.Subtitle>
                  <Card.Text>{post.content}</Card.Text>

                  {/* Display post media (image) */}
                  {post.media && (
                    <div className="post-media mb-3">
                      <img src={post.media} alt="post media" className="img-fluid" />
                    </div>
                  )}

                  <Button variant="outline-secondary">Like</Button>
                  <Button variant="outline-secondary" className="ms-2">Comment</Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
