import React from 'react';
import './App.css';
import InputForm from './components/InputForm';

export default function App() {
  return (
    <div className="container">
      <h1 className="app-title">SofaTree</h1>
      <p className="app-subtitle">Interactive Folder Tree Visualization</p>
      
      <div className="main-content">
        <div className="input-section">
          <InputForm />
        </div>
        
        <div className="visualization-section">
          <h2>Tree Visualization</h2>
          <p>Tree visualization will be implemented on Day 4</p>
        </div>
      </div>
    </div>
  );
}