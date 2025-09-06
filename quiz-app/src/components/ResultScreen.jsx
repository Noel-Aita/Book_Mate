import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, username } = location.state || {};

  return (
    <Layout>
      <div>
        <h2>Quiz Results</h2>
        <p>{username}, your score is: {score}</p>
        <button onClick={() => navigate("/home")}>Go Home</button>
      </div>
    </Layout>
  );
};

export default ResultScreen;
