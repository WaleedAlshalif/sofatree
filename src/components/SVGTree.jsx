import React, { useState, useRef, useCallback } from 'react';

const SVGTree = ({ treeData }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([treeData?.id]));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef();

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

  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 3)
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.3)
    }));
  };

  const handleResetZoom = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;     
    setIsDragging(true);
    setStartPan({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    setTransform({
      ...transform,
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  }, [isDragging, startPan, transform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (svgRef.current) {
      svgRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const point = {
      x: (e.clientX - rect.left - transform.x) / transform.scale,
      y: (e.clientY - rect.top - transform.y) / transform.scale
    };

    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(0.3, Math.min(3, transform.scale * Math.exp(delta)));

    setTransform({
      x: e.clientX - point.x * newScale - rect.left,
      y: e.clientY - point.y * newScale - rect.top,
      scale: newScale
    });
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
      let currentIndex = index;
      node.children.forEach((child) => {
        const childLayout = calculateLayout(child, level + 1, currentIndex);
        layoutNode.children.push(childLayout);
        currentIndex += countVisibleNodes(child);
      });
    }

    return layoutNode;
  };

  const countVisibleNodes = (node) => {
    if (!node.children || !expandedNodes.has(node.id)) {
      return 1;
    }
    return 1 + node.children.reduce((sum, child) => sum + countVisibleNodes(child), 0);
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
      <g 
        key={node.id} 
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) toggleNode(node.id);
        }}
        className="node-group"
      >
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
          className="node-label"
        >
          {node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name}
        </text>

        {hasChildren && (
          <text
            x={node.x + 25}
            y={node.y - 15}
            fill="#667eea"
            fontSize="14"
            fontWeight="bold"
            className="expand-indicator"
          >
            {isExpanded ? '−' : '+'}
          </text>
        )}

        <title>
          {node.name} ({node.type})
          {node.path && `\nPath: ${node.path}`}
        </title>
      </g>
    );

    return nodes;
  };

  return (
    <div className="svg-tree-container">
      <div className="zoom-controls">
        <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">
          <span>+</span>
        </button>
        <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">
          <span>−</span>
        </button>
        <button onClick={handleResetZoom} className="zoom-btn reset" title="Reset Zoom">
          <span>⟲</span>
        </button>
        <div className="zoom-level">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>

      <div className="interaction-hints">
        <span>🖱️ Drag to Pan • 🔄 Scroll to Zoom • 👆 Click to Expand</span>
      </div>

      <div className="svg-wrapper">
        <svg 
          ref={svgRef}
          width="100%" 
          height="500"
          viewBox="0 0 800 500"
          className="svg-tree"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            <rect width="100%" height="100%" fill="#f7fafc" />
            
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            
            <g className="tree-links">
              {renderNodes(layoutTree).filter(node => node.type === 'line')}
            </g>
            
            <g className="tree-nodes">
              {renderNodes(layoutTree).filter(node => node.type !== 'line')}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SVGTree;