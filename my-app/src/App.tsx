import React from 'react';
// import logo from './logo.svg';
import logo from './logo/my_logo2.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="border">
          <p className="p">Welcome</p>
        </div>
      </header>
    </div>
  );
}

export default App;
