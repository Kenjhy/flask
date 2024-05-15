import React from 'react';
import logo from './logo.svg';
import './App.css';
import './ModalStyles.css';
import CompanyTable from './CompanyTable';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <h1>Company Management</h1>
      <CompanyTable />
    </div>
  );
}

export default App;
