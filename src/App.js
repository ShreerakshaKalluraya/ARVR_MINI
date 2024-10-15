import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VRScene from './Vrscene'; // Import the VRScene component
import Scene2 from './Scene2';   // Import the Scene2 component

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Treadmill VR Experience</h1>
        <nav>
          <button>
            <Link to="/Vrscene" style={{ textDecoration: 'none', color: 'black' }}>Go to VR Scene</Link>
          </button>
          <button>
            <Link to="/Scene2" style={{ textDecoration: 'none', color: 'black' }}>Go to Scene 2</Link>
          </button>
        </nav>
        <Routes>
          {/* Route to VRScene */}
          <Route path="/Vrscene" element={<VRScene />} />
          
          {/* Route to Scene2 */}
          <Route path="/Scene2" element={<Scene2 />} />
          
          {/* Default Route */}
          <Route path="/" element={<h2>Welcome to the Treadmill VR Experience</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
