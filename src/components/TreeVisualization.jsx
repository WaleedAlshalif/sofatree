import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const TreeVisualization = ({ treeData }) => {
  if (!treeData) {
    return (
      <div className="empty-state">
        <p>No tree data to display. Please generate a tree first.</p>
      </div>
    );
  }

  return (
    <div className="tree-container">
      <div className="tree-header">
        <h3>Folder Tree Visualization</h3>
        <div className="tree-legend">
          <div className="legend-item">
            <Folder size={16} />
            <span>Folder</span>
          </div>
          <div className="legend-item">
            <File size={16} />
            <span>File</span>
          </div>
        </div>
      </div>
      
      <div className="tree-content">
        <TreeNode node={treeData} level={0} />
      </div>
    </div>
  );
};

// مكون العقدة الفردية
const TreeNode = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = React.useState(node.isExpanded || false);
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';

  const handleToggle = () => {
    if (isFolder && hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const paddingLeft = level * 20 + 10;

  return (
    <div className="tree-node">
      <div 
        className={`node-content ${isFolder ? 'folder' : 'file'} ${hasChildren ? 'has-children' : ''}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
      >
        {isFolder && hasChildren && (
          <span className="expand-icon">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        
        <span className="node-icon">
          {isFolder ? <Folder size={18} /> : <File size={18} />}
        </span>
        
        <span className="node-name" title={node.path}>
          {node.name}
        </span>
        
        {node.path && (
          <span className="node-path">({node.path})</span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="node-children">
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeVisualization;