import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', marginTop:"150px"}} className="dark-theme-hover">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h4>Your Website Name</h4>
            <p>Provide a brief description of your eLearning platform.</p>
          </div>
          <div className="col-md-6">
            <h4>Contact Information</h4>
            <p>Email: contact@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>&copy; {new Date().getFullYear()} Your Website Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
