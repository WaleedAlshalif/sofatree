import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import TreeVisualization from './components/TreeVisualization';
import SVGTree from './components/SVGTree';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [activeTab, setActiveTab] = useState('hierarchy');

  const handleTreeGenerated = (tree) => {
    setTreeData(tree);
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
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'hierarchy' ? 'active' : ''}`}
              onClick={() => setActiveTab('hierarchy')}
            >
              Hierarchy View
            </button>
            <button 
              className={`tab-button ${activeTab === 'svg' ? 'active' : ''}`}
              onClick={() => setActiveTab('svg')}
            >
              SVG Tree
            </button>
          </div>

          {treeData ? (
            <div className="visualization-content">
              {activeTab === 'hierarchy' && (
                <TreeVisualization treeData={treeData} />
              )}
              {activeTab === 'svg' && (
                <SVGTree treeData={treeData} />
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tree data yet. Please generate a tree first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;