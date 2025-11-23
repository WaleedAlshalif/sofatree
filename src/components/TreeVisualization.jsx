import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Info } from 'lucide-react';
import Tooltip from './Tooltip';

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
          <Tooltip content="Click folders to expand/collapse • Hover for details">
            <div className="legend-item hint">
              <Info size={14} />
              <span>Hover for info</span>
            </div>
          </Tooltip>
        </div>
      </div>
      
      <div className="tree-content">
        <TreeNode node={treeData} level={0} />
      </div>
    </div>
  );
};

// مكون العقدة الفردية مع Animations
const TreeNode = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = React.useState(node.isExpanded || false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';

  const handleToggle = async () => {
    if (isFolder && hasChildren) {
      setIsAnimating(true);
      // تأخير بسيط لتظهر Animation بشكل أفضل
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsExpanded(!isExpanded);
      // إنهاء حالة Animation بعد انتهاء الانتقال
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const paddingLeft = level * 20 + 10;

  // محتوى الـ Tooltip - مصحح
  const tooltipContent = (
    <div className="node-tooltip">
      <div className="tooltip-header">
        <strong>{node.name || 'Unnamed Node'}</strong>
        <span className={`node-type ${node.type || 'file'}`}>
          {node.type || 'file'}
        </span>
      </div>
      {node.path && (
        <div className="tooltip-path">
          📍 <span>{node.path}</span>
        </div>
      )}
      <div className="tooltip-info">
        {/* التصحيح هنا - التحقق من وجود node.id أولاً */}
        <div>ID: <code>{(node.id || 'unknown').substring(0, 8)}...</code></div>
        {hasChildren && (
          <div>Children: {node.children.length}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`tree-node ${isAnimating ? 'animating' : ''}`}>
      <Tooltip content={tooltipContent} delay={200}>
        <div 
          className={`node-content ${isFolder ? 'folder' : 'file'} ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={handleToggle}
        >
          {isFolder && hasChildren && (
            <span className="expand-icon">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          
          {!isFolder && hasChildren && (
            <span className="expand-icon placeholder"></span>
          )}
          
          <span className="node-icon">
            {isFolder ? <Folder size={18} /> : <File size={18} />}
          </span>
          
          <span className="node-name" title={node.name || 'Unnamed'}>
            {node.name || 'Unnamed Node'}
          </span>
          
          {node.path && (
            <span className="node-path">
              {node.path.split('/').pop()}
            </span>
          )}

          {/* مؤشرات إضافية */}
          {hasChildren && (
            <span className="children-count">
              ({node.children.length})
            </span>
          )}
        </div>
      </Tooltip>

      <div className={`node-children ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {isExpanded && hasChildren && (
          <div className="children-content">
            {node.children.map((child) => (
              <TreeNode 
                key={child.id || Math.random().toString()} 
                node={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualization;