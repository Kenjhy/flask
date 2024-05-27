import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './assets/logo.svg';
import './styles/App.css';
import './styles/ModalStyles.css';
import CompanyTable from './components/CompanyTable';
import Report from './components/reports/Report';


function App() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    console.log('Menu toggled:', !showMenu);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={toggleMenu} />
          <h4>MENU</h4>
          {showMenu && (
            <div className="dropdown-menu">
              <Link to="/" className="dropdown-item" onClick={() => setShowMenu(false)}>Home</Link>
              <Link to="/report" className="dropdown-item" onClick={() => setShowMenu(false)}>Report</Link>
            </div>
          )}
        </header>
        <Routes>
          <Route exact path="/" element={<CompanyTable />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
