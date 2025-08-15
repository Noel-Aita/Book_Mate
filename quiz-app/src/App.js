import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

// the three pages am working on
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';


function App() {
  return (
// These are the routes that the different pages will take
    <Router>
      
      {/* Routes define which component shows at which path */}
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/quiz" element = {<Quiz />} />
        <Route path = "/result" element = {<Result />} />
      </Routes>
    </Router>

  );
}

export default App;
