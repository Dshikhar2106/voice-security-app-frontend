import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './_context/AuthContext'; // For authentication context
import './HomePage.css'; // Add your custom styles here
import Sidebar from './Sidebar';

const HomePage = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // State for managing posts
  const [posts, setPosts] = useState([]);
  

  useEffect(() => {
  

    fetchPosts();  // Call the fetch function
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/getPosts');  // Fetching all posts

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();  // Parse JSON data
      console.log(data.posts ,'lll');
      setPosts(data.posts);  // Set posts state
    } catch (error) {
      console.error('Error fetching posts:', error);
      // setError(error.message);  // Set error if something went wrong
    } finally {
      // setLoading(false);  // Set loading to false once data is fetched
    }
  };

  const [user, setuser] = useState();
  const [newPost, setNewPost] = useState(""); // For the text input
  const [media, setMedia] = useState(null);   // For previewing the uploaded file
  const [mediaName, setMediaName] = useState(""); // Displaying uploaded file name
  const [mediaFile, setMediaFile] = useState(null); // Actual file data
  
  // Handle file input change
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaName(file.name);
      setMedia(URL.createObjectURL(file)); // Preview image
      setMediaFile(file); // Save the file for submission
    }
  };
  
  // Handle Post Submission
  const handlePostSubmit = async () => {
    if (!newPost || !mediaFile) {
      alert("Please enter a post and choose an image.");
      return;
    }
  
    try {
      // Create FormData to send file along with text data
      const formData = new FormData();
      formData.append("text", newPost); // Append text data
      formData.append("file", mediaFile); // Append the file data
      formData.append("filetype", mediaFile.type); // Append file type
      formData.append("userId", user?.id); // Replace with dynamic userId if available
  
      // Send POST request with FormData
      const response = await fetch("http://localhost:4000/api/users/createPost", {
        method: "POST",
        body: formData, // Sending FormData directly
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Post submitted successfully!");
        console.log("Response:", result);
        // Clear form
        fetchPosts()
        setNewPost("");
        setMedia(null);
        setMediaName("");
        setMediaFile(null);
      } else {
        alert("Failed to submit post: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while submitting the post.");
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
                <img style={{width:150 , height : 150 , objectFit : 'contain'}} src={media} alt="preview" className="img-fluid" />
              </div>
            )}

            <Button variant="primary" onClick={handlePostSubmit}>Post</Button>
          </Card>

          {/* Post Feed */}
          {posts.length === 0 ? (
            <p>No posts yet! Be the first to share something.</p>
          ) : (
            posts.reverse().map((post) => (
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
