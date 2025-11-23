import React, { useState } from 'react';

const SVGTree = ({ treeData }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([treeData?.id]));

  if (!treeData) {
    return (
      <div className="svg-tree-empty">
        <p>Generate a tree to see the SVG visualization</p>
      </div>
    );
  }

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const calculateLayout = (node, level = 0, index = 0) => {
    const x = level * 120 + 50;
    const y = index * 60 + 50;
    
    const layoutNode = {
      ...node,
      x,
      y,
      children: []
    };

    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach((child, childIndex) => {
        const childLayout = calculateLayout(child, level + 1, index + childIndex);
        layoutNode.children.push(childLayout);
      });
    }

    return layoutNode;
  };

  const layoutTree = calculateLayout(treeData);

  const renderNodes = (node) => {
    const nodes = [];
    
    node.children.forEach((child) => {
      nodes.push(
        <line
          key={`line-${node.id}-${child.id}`}
          x1={node.x}
          y1={node.y}
          x2={child.x}
          y2={child.y}
          stroke="#cbd5e0"
          strokeWidth="2"
        />
      );
      
      nodes.push(...renderNodes(child));
    });

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === 'folder';

    nodes.push(
      <g key={node.id} onClick={() => hasChildren && toggleNode(node.id)}>
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill={isFolder ? '#667eea' : '#48bb78'}
          stroke="#2d3748"
          strokeWidth="2"
          className="node-circle"
        />
        

        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
        </text>


        <text
          x={node.x}
          y={node.y + 30}
          textAnchor="middle"
          fill="#2d3748"
          fontSize="12"
          fontWeight="500"
        >
          {node.name}
        </text>

        {hasChildren && (
          <text
            x={node.x + 25}
            y={node.y - 15}
            fill="#667eea"
            fontSize="14"
            fontWeight="bold"
          >
            {isExpanded ? '−' : '+'}
          </text>
        )}
      </g>
    );

    return nodes;
  };

  return (
    <div className="svg-tree-container">
      <svg 
        width="100%" 
        height="400" 
        viewBox="0 0 800 400"
        className="svg-tree"
      >
        {/* the background */}
        <rect width="100%" height="100%" fill="#f7fafc" />
        
        {/* the lines */}
        <g className="tree-links">
          {renderNodes(layoutTree).filter(node => node.type === 'line')}
        </g>
        
        {/* contact or the name ( العقد ) */}
        <g className="tree-nodes">
          {renderNodes(layoutTree).filter(node => node.type !== 'line')}
        </g>
      </svg>
    </div>
  );
};

export default SVGTree;