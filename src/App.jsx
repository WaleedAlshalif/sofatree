import React, { useState, useEffect } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import TreeVisualization from './components/TreeVisualization';
import SVGTree from './components/SVGTree';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [isLoading, setIsLoading] = useState(false);
  const [appVersion] = useState('1.0.0');

  // تحميل البيانات المحفوظة من localStorage
  useEffect(() => {
    const savedTreeData = localStorage.getItem('sofatree-data');
    const savedTab = localStorage.getItem('sofatree-activeTab');
    
    if (savedTreeData) {
      try {
        setTreeData(JSON.parse(savedTreeData));
      } catch (error) {
        console.error('Failed to load saved tree data:', error);
        localStorage.removeItem('sofatree-data');
      }
    }
    
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // حفظ البيانات في localStorage عند التغيير
  useEffect(() => {
    if (treeData) {
      localStorage.setItem('sofatree-data', JSON.stringify(treeData));
    }
  }, [treeData]);

  useEffect(() => {
    localStorage.setItem('sofatree-activeTab', activeTab);
  }, [activeTab]);

  const handleTreeGenerated = (tree) => {
    setIsLoading(true);
    // محاكاة تحميل لاختبار spinner
    setTimeout(() => {
      setTreeData(tree);
      setIsLoading(false);
    }, 500);
  };

  const handleClearData = () => {
    setTreeData(null);
    localStorage.removeItem('sofatree-data');
  };

  const handleExportTree = () => {
    if (!treeData) return;
    
    const dataStr = JSON.stringify(treeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `sofatree-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">🌳 SofaTree</h1>
            <p className="app-subtitle">Interactive Folder Tree Visualization</p>
            <span className="app-version">v{appVersion}</span>
          </div>
          
          {treeData && (
            <div className="header-actions">
              <button onClick={handleExportTree} className="action-btn export">
                Export JSON
              </button>
              <button onClick={handleClearData} className="action-btn clear">
                Clear
              </button>
            </div>
          )}
        </header>
        
        <div className="main-content">
          <div className="input-section">
            <InputForm onTreeGenerated={handleTreeGenerated} />
            
            {/* Examples Section */}
            <div className="examples-section">
              <h3>💡 Quick Examples</h3>
              <div className="example-buttons">
                <button 
                  onClick={() => handleTreeGenerated({
                    id: 'example-1',
                    name: 'Project Root',
                    type: 'folder',
                    path: 'Project Root',
                    isExpanded: true,
                    children: [
                      {
                        id: 'example-2',
                        name: 'src',
                        type: 'folder',
                        path: 'Project Root/src',
                        children: [
                          { id: 'example-3', name: 'App.js', type: 'file', path: 'Project Root/src/App.js' },
                          { id: 'example-4', name: 'index.js', type: 'file', path: 'Project Root/src/index.js' }
                        ]
                      },
                      {
                        id: 'example-5', 
                        name: 'public',
                        type: 'folder', 
                        path: 'Project Root/public',
                        children: [
                          { id: 'example-6', name: 'index.html', type: 'file', path: 'Project Root/public/index.html' }
                        ]
                      },
                      { id: 'example-7', name: 'package.json', type: 'file', path: 'Project Root/package.json' },
                      { id: 'example-8', name: 'README.md', type: 'file', path: 'Project Root/README.md' }
                    ]
                  })}
                  className="example-btn"
                >
                  Sample Project
                </button>
                
                <button 
                  onClick={() => handleTreeGenerated({
                    id: 'example-9',
                    name: 'C:',
                    type: 'folder',
                    path: 'C:',
                    isExpanded: true,
                    children: [
                      {
                        id: 'example-10',
                        name: 'Users',
                        type: 'folder',
                        path: 'C:/Users',
                        children: [
                          {
                            id: 'example-11',
                            name: 'JohnDoe',
                            type: 'folder',
                            path: 'C:/Users/JohnDoe',
                            children: [
                              { id: 'example-12', name: 'Documents', type: 'folder', path: 'C:/Users/JohnDoe/Documents' },
                              { id: 'example-13', name: 'Downloads', type: 'folder', path: 'C:/Users/JohnDoe/Downloads' }
                            ]
                          }
                        ]
                      },
                      {
                        id: 'example-14',
                        name: 'Program Files',
                        type: 'folder',
                        path: 'C:/Program Files',
                        children: []
                      }
                    ]
                  })}
                  className="example-btn"
                >
                  Windows Path
                </button>
              </div>
            </div>
          </div>
          
          <div className="visualization-section">
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'hierarchy' ? 'active' : ''}`}
                onClick={() => setActiveTab('hierarchy')}
              >
                📁 Hierarchy View
              </button>
              <button 
                className={`tab-button ${activeTab === 'svg' ? 'active' : ''}`}
                onClick={() => setActiveTab('svg')}
              >
                🎨 Interactive Tree
              </button>
            </div>

            <div className="visualization-content">
              {isLoading ? (
                <LoadingSpinner message="Generating tree visualization..." />
              ) : treeData ? (
                <>
                  {activeTab === 'hierarchy' && (
                    <TreeVisualization treeData={treeData} />
                  )}
                  {activeTab === 'svg' && (
                    <SVGTree treeData={treeData} />
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🌳</div>
                  <h3>No Tree Data</h3>
                  <p>Generate a tree using the form on the left or try one of the examples.</p>
                  <div className="empty-features">
                    <div className="feature">
                      <strong>JSON Input</strong>
                      <span>Paste your folder structure as JSON</span>
                    </div>
                    <div className="feature">
                      <strong>Path Input</strong>
                      <span>Enter a folder path to parse</span>
                    </div>
                    <div className="feature">
                      <strong>Interactive</strong>
                      <span>Zoom, pan, and explore your tree</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="app-footer">
          <p>
            Built with React • {new Date().getFullYear()} • 
            <a href="https://github.com/WaleedAlshalif/sofatree" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;