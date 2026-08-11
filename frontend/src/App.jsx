import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import DigitalTwinPage from './pages/DigitalTwin';
import Simulation from './pages/Simulation';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/simulation" element={<Simulation />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
