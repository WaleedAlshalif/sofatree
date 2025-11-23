import React, { useState, useRef, useCallback } from 'react';
import Tooltip from './Tooltip';

const SVGTree = ({ treeData }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([treeData?.id]));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [activeTooltip, setActiveTooltip] = useState(null);
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

  // محتوى الـ Tooltip للعقدة
  const getTooltipContent = (node) => (
    <div className="node-tooltip">
      <div className="tooltip-header">
        <strong>{node.name}</strong>
        <span className={`node-type ${node.type}`}>
          {node.type}
        </span>
      </div>
      {node.path && (
        <div className="tooltip-path">
          📍 <span>{node.path}</span>
        </div>
      )}
      <div className="tooltip-info">
        <div>ID: <code>{node.id.substring(0, 8)}...</code></div>
        {node.children && node.children.length > 0 && (
          <div>Children: {node.children.length}</div>
        )}
        <div>Position: ({Math.round(node.x)}, {Math.round(node.y)})</div>
      </div>
    </div>
  );

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
          className="tree-link"
        />
      );
      
      nodes.push(...renderNodes(child));
    });

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === 'folder';

    nodes.push(
      <Tooltip
        key={`tooltip-${node.id}`}
        content={getTooltipContent(node)}
        position="top"
        delay={150}
      >
        <g 
          key={node.id} 
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleNode(node.id);
          }}
          className="node-group"
          onMouseEnter={() => setActiveTooltip(node.id)}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* دائرة الخلفية مع تأثير hover */}
          <circle
            cx={node.x}
            cy={node.y}
            r="20"
            fill={isFolder ? '#667eea' : '#48bb78'}
            stroke={activeTooltip === node.id ? '#2d3748' : '#4a5568'}
            strokeWidth={activeTooltip === node.id ? '3' : '2'}
            className="node-circle"
          />
          
          {/* أيقونة المجلد/الملف */}
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            className="node-emoji"
          >
            {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
          </text>

          {/* اسم العقدة */}
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

          {/* مؤشر التوسيع للمجلدات */}
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

          {/* دائرة تأثير hover إضافية */}
          {activeTooltip === node.id && (
            <circle
              cx={node.x}
              cy={node.y}
              r="24"
              fill="none"
              stroke="#667eea"
              strokeWidth="2"
              strokeDasharray="3,3"
              className="node-hover-ring"
            />
          )}
        </g>
      </Tooltip>
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
        <span>🖱️ Drag to Pan • 🔄 Scroll to Zoom • 👆 Click to Expand • 🎯 Hover for Details</span>
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
            {/* الخلفية */}
            <rect width="100%" height="100%" fill="#f7fafc" />
            
            {/* الشبكة الخلفية */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            
            {/* الخطوط */}
            <g className="tree-links">
              {renderNodes(layoutTree).filter(node => node.type === 'line')}
            </g>
            
            {/* العقد */}
            <g className="tree-nodes">
              {renderNodes(layoutTree).filter(node => node.type !== 'line')}
            </g>
          </g>
        </svg>
      </div>

      {/* معلومات إضافية */}
      <div className="tree-stats">
        <div className="stat-item">
          <span className="stat-label">Total Nodes:</span>
          <span className="stat-value">{countVisibleNodes(treeData)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Zoom:</span>
          <span className="stat-value">{Math.round(transform.scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SVGTree;