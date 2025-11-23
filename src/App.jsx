import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';

function App() {
  const [treeData, setTreeData] = useState(null);

  const handleTreeGenerated = (tree) => {
    setTreeData(tree);
    console.log('Tree data received in App:', tree);
  };

  return (
    <div className="container">
      <h1 className="app-title">SofaTree</h1>
      <p className="app-subtitle">Interactive Folder Tree Visualization</p>
      
      <div className="main-content">
        <div className="input-section">
          <InputForm onTreeGenerated={handleTreeGenerated} />
        </div>
        
        <div className="visualization-section">
          <h2>Tree Visualization</h2>
          {treeData ? (
            <div className="tree-preview">
              <h4>Tree Generated Successfully! </h4>
              <pre className="tree-structure">
                {JSON.stringify(treeData, null, 2)}
              </pre>
              <p>Tree visualization will be implemented on Day 4</p>
            </div>
          ) : (
            <p>No tree data yet. Please generate a tree first.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;