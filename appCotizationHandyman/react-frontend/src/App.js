import React from 'react';
import logo from './assets/logo.svg';
import './styles/App.css';
import './styles/ModalStyles.css';
import CompanyTable from './components/CompanyTable';


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
