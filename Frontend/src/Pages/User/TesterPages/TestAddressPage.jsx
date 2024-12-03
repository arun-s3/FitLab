import React, { useState } from "react";
import './TestAddressPage.css'

const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "Jacob",
    lastName: "Sunny",
    dob: "1997-09-21",
    city: "Ernakulam",
    state: "Kerala",
    address: "Padi house, Kacheripady",
    pinCode: "682018",
    addressType: "Home",
    landmark: "opp Lenskart",
    mobile: "+91 9798256495",
    email: "jacob12@gmail.com",
    alternateNumber: "+91 9012458798",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150" // Replace with actual profile image URL
            alt="Profile"
            className="profile-image"
          />
          <h3 className="profile-name">Jacob Sunny</h3>
        </div>
        <ul className="profile-menu">
          <li className="active">Profile</li>
          <li>Order History</li>
          <li>Wallet</li>
          <li>Shopping Cart</li>
          <li>Wishlist</li>
          <li>Compare</li>
          <li>Manage Address</li>
          <li>Change Password</li>
          <li>Log-out</li>
        </ul>
      </div>
      <div className="profile-main">
        <h2>Your Details</h2>
        <p>Personal Information</p>
        <form onSubmit={handleFormSubmit} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City / District / Town</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="Home"
                    checked={formData.addressType === "Home"}
                    onChange={handleInputChange}
                  />
                  Home
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="Work"
                    checked={formData.addressType === "Work"}
                    onChange={handleInputChange}
                  />
                  Work
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
            />
          </div>
          <h3>Contact Information</h3>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Alternate Number (Optional)</label>
            <input
              type="text"
              name="alternateNumber"
              value={formData.alternateNumber}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
