import React from "react";
import BlogSection from "./BlogSection";
import AuthScreen from "./AuthScreen";

const LoginScreen = ({ onAuth }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Signup</h2>
      <AuthScreen onAuth={onAuth} />

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default LoginScreen;
