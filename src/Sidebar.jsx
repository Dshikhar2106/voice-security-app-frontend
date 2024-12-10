import React, { useEffect, useState } from 'react';
import { Button, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './_context/AuthContext'; // Import authentication context
import './sidebar.css'; // Add your custom styles for Sidebar

const Sidebar = ({userData}) => {
  const { currentUser, logout } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();

const [ user , setuser] = useState()

  useEffect(() => {
getProfile()
  } , [])

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage or cookies if saved
  
      // Make sure the token exists
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      // Call the API
      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
  
      const data = await response.json();
      setuser(data?.user)
      data?.user &&   userData(data?.user)
      // You can now use `data` to update the UI or store it in your app state
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <Col md={3} className="sidebar p-3">
      {/* Profile Section */}
      <div className="sidebar-profile mb-3 text-center">
        <Image
          src={user?.image || 'https://via.placeholder.com/150'}
          alt="Profile"
          roundedCircle
          width="100"
          height="100"
          className="mb-2"
        />
        <h5>{user?.name || 'User'}</h5>
      </div>

      {/* Sidebar Links */}
      <div className="sidebar-item mb-3">
        <Button variant="outline-primary" onClick={() => navigate('/profile')} className="w-100">
          Profile
        </Button>
      </div>
      <div className="sidebar-item mb-3">
        <Button variant="outline-primary" onClick={() => navigate('/settings')} className="w-100">
          Settings
        </Button>
      </div>

      {/* Logout Button */}
      <div className="sidebar-item mb-3">
        <Button variant="outline-danger" onClick={() => logout()} className="w-100">
          Logout
        </Button>
      </div>
    </Col>
  );
};

export default Sidebar;
