// import React, { useState, useRef, useCallback } from 'react';
// import Tooltip from './Tooltip';

// const SVGTree = ({ treeData }) => {
//   const [expandedNodes, setExpandedNodes] = useState(new Set([treeData?.id]));
//   const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [startPan, setStartPan] = useState({ x: 0, y: 0 });
//   const svgRef = useRef();

//   if (!treeData) {
//     return (
//       <div className="svg-tree-empty">
//         <p>Generate a tree to see the SVG visualization</p>
//       </div>
//     );
//   }

//   const toggleNode = (nodeId) => {
//     const newExpanded = new Set(expandedNodes);
//     if (newExpanded.has(nodeId)) {
//       newExpanded.delete(nodeId);
//     } else {
//       newExpanded.add(nodeId);
//     }
//     setExpandedNodes(newExpanded);
//   };

//   const handleZoomIn = () => {
//     setTransform(prev => ({
//       ...prev,
//       scale: Math.min(prev.scale * 1.2, 3)
//     }));
//   };

//   const handleZoomOut = () => {
//     setTransform(prev => ({
//       ...prev,
//       scale: Math.max(prev.scale / 1.2, 0.3)
//     }));
//   };

//   const handleResetZoom = () => {
//     setTransform({ x: 0, y: 0, scale: 1 });
//   };

//   const handleMouseDown = (e) => {
//     if (e.button !== 0) return;     
//     setIsDragging(true);
//     setStartPan({
//       x: e.clientX - transform.x,
//       y: e.clientY - transform.y
//     });
//     e.currentTarget.style.cursor = 'grabbing';
//   };

//   const handleMouseMove = useCallback((e) => {
//     if (!isDragging) return;
    
//     setTransform({
//       ...transform,
//       x: e.clientX - startPan.x,
//       y: e.clientY - startPan.y
//     });
//   }, [isDragging, startPan, transform]);

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//     if (svgRef.current) {
//       svgRef.current.style.cursor = 'grab';
//     }
//   }, []);

//   const handleWheel = (e) => {
//     e.preventDefault();
//     const rect = e.currentTarget.getBoundingClientRect();
//     const point = {
//       x: (e.clientX - rect.left - transform.x) / transform.scale,
//       y: (e.clientY - rect.top - transform.y) / transform.scale
//     };

//     const delta = -e.deltaY * 0.001;
//     const newScale = Math.max(0.3, Math.min(3, transform.scale * Math.exp(delta)));

//     setTransform({
//       x: e.clientX - point.x * newScale - rect.left,
//       y: e.clientY - point.y * newScale - rect.top,
//       scale: newScale
//     });
//   };

//   const calculateLayout = (node, level = 0, index = 0) => {
//     const x = level * 120 + 50;
//     const y = index * 60 + 50;
    
//     const layoutNode = {
//       ...node,
//       x,
//       y,
//       children: []
//     };

//     if (node.children && expandedNodes.has(node.id)) {
//       let currentIndex = index;
//       node.children.forEach((child) => {
//         const childLayout = calculateLayout(child, level + 1, currentIndex);
//         layoutNode.children.push(childLayout);
//         currentIndex += countVisibleNodes(child);
//       });
//     }

//     return layoutNode;
//   };

//   const countVisibleNodes = (node) => {
//     if (!node.children || !expandedNodes.has(node.id)) {
//       return 1;
//     }
//     return 1 + node.children.reduce((sum, child) => sum + countVisibleNodes(child), 0);
//   };

//   const layoutTree = calculateLayout(treeData);

//   // محتوى الـ Tooltip للعقدة
//   const getTooltipContent = (node) => (
//     <div className="node-tooltip">
//       <div className="tooltip-header">
//         <strong>{node.name || 'Unnamed Node'}</strong>
//         <span className={`node-type ${node.type || 'file'}`}>
//           {node.type || 'file'}
//         </span>
//       </div>
//       {node.path && (
//         <div className="tooltip-path">
//           📍 <span>{node.path}</span>
//         </div>
//       )}
//       <div className="tooltip-info">
//         <div>ID: <code>{(node.id || 'unknown').substring(0, 8)}...</code></div>
//         {node.children && node.children.length > 0 && (
//           <div>Children: {node.children.length}</div>
//         )}
//       </div>
//     </div>
//   );

//   // شكل مجلد SVG
//   const FolderIcon = ({ x, y, isExpanded }) => (
//     <g transform={`translate(${x - 15}, ${y - 10})`}>
//       {/* جسم المجلد */}
//       <rect x="2" y="8" width="26" height="14" fill="#667eea" stroke="#2d3748" strokeWidth="1"/>
//       {/* غطاء المجلد */}
//       <path d="M2 8 L12 2 L28 8" fill="#5a67d8" stroke="#2d3748" strokeWidth="1"/>
//       {/* خطوط داخل المجلد */}
//       {isExpanded && (
//         <>
//           <line x1="8" y1="12" x2="22" y2="12" stroke="#2d3748" strokeWidth="1"/>
//           <line x1="8" y1="15" x2="22" y2="15" stroke="#2d3748" strokeWidth="1"/>
//           <line x1="8" y1="18" x2="22" y2="18" stroke="#2d3748" strokeWidth="1"/>
//         </>
//       )}
//     </g>
//   );

//   // شكل ملف SVG
//   const FileIcon = ({ x, y }) => (
//     <g transform={`translate(${x - 12}, ${y - 10})`}>
//       {/* جسم الملف */}
//       <rect x="2" y="2" width="20" height="16" fill="#48bb78" stroke="#2d3748" strokeWidth="1"/>
//       {/* زاوية الملف */}
//       <polygon points="2,2 8,2 2,8" fill="#38a169"/>
//       {/* خطوط داخل الملف */}
//       <line x1="6" y1="6" x2="18" y2="6" stroke="#2d3748" strokeWidth="1"/>
//       <line x1="6" y1="9" x2="18" y2="9" stroke="#2d3748" strokeWidth="1"/>
//       <line x1="6" y1="12" x2="14" y2="12" stroke="#2d3748" strokeWidth="1"/>
//     </g>
//   );

//   const renderNodes = (node) => {
//     const nodes = [];
    
//     node.children.forEach((child) => {
//       nodes.push(
//         <line
//           key={`line-${node.id || 'node'}-${child.id || 'child'}`}
//           x1={node.x}
//           y1={node.y}
//           x2={child.x}
//           y2={child.y}
//           stroke="#cbd5e0"
//           strokeWidth="2"
//           className="tree-link"
//         />
//       );
      
//       nodes.push(...renderNodes(child));
//     });

//     const isExpanded = expandedNodes.has(node.id);
//     const hasChildren = node.children && node.children.length > 0;
//     const isFolder = node.type === 'folder';

//     nodes.push(
//       <Tooltip
//         key={`tooltip-${node.id || 'node'}`}
//         content={getTooltipContent(node)}
//         position="top"
//         delay={150}
//       >
//         <g 
//           key={node.id || `node-${Math.random()}`} 
//           onClick={(e) => {
//             e.stopPropagation();
//             if (hasChildren) toggleNode(node.id);
//           }}
//           className="node-group"
//         >
//           {/* أيقونة المجلد أو الملف */}
//           {isFolder ? (
//             <FolderIcon x={node.x} y={node.y} isExpanded={isExpanded} />
//           ) : (
//             <FileIcon x={node.x} y={node.y} />
//           )}

//           {/* اسم العقدة */}
//           <text
//             x={node.x}
//             y={node.y + 25}
//             textAnchor="middle"
//             fill="#2d3748"
//             fontSize="11"
//             fontWeight="500"
//             className="node-label"
//           >
//             {(node.name || 'Unnamed').length > 10 ? (node.name || 'Unnamed').substring(0, 10) + '...' : (node.name || 'Unnamed')}
//           </text>

//           {/* مؤشر التوسيع للمجلدات */}
//           {hasChildren && (
//             <circle
//               cx={node.x + 25}
//               cy={node.y - 8}
//               r="8"
//               fill="#667eea"
//               stroke="#2d3748"
//               strokeWidth="1"
//             />
//           )}
//           {hasChildren && (
//             <text
//               x={node.x + 25}
//               y={node.y - 5}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="white"
//               fontSize="10"
//               fontWeight="bold"
//             >
//               {isExpanded ? '-' : '+'}
//             </text>
//           )}
//         </g>
//       </Tooltip>
//     );

//     return nodes;
//   };

//   return (
//     <div className="svg-tree-container">
//       <div className="zoom-controls">
//         <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">
//           <span>+</span>
//         </button>
//         <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">
//           <span>−</span>
//         </button>
//         <button onClick={handleResetZoom} className="zoom-btn reset" title="Reset Zoom">
//           <span>⟲</span>
//         </button>
//         <div className="zoom-level">
//           {Math.round(transform.scale * 100)}%
//         </div>
//       </div>

//       <div className="interaction-hints">
//         <span>🖱️ Drag to Pan • 🔄 Scroll to Zoom • 👆 Click Folders to Expand</span>
//       </div>

//       <div className="svg-wrapper">
//         <svg 
//           ref={svgRef}
//           width="100%" 
//           height="500"
//           viewBox="0 0 800 500"
//           className="svg-tree"
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           onWheel={handleWheel}
//           style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//         >
//           <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
//             {/* الخلفية */}
//             <rect width="100%" height="100%" fill="#f7fafc" />
            
//             {/* الشبكة الخلفية */}
//             <defs>
//               <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
//                 <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
            
//             {/* الخطوط */}
//             <g className="tree-links">
//               {renderNodes(layoutTree).filter(node => node.type === 'line')}
//             </g>
            
//             {/* العقد */}
//             <g className="tree-nodes">
//               {renderNodes(layoutTree).filter(node => node.type !== 'line')}
//             </g>
//           </g>
//         </svg>
//       </div>

//       {/* معلومات إضافية */}
//       <div className="tree-stats">
//         <div className="stat-item">
//           <span className="stat-label">Total Nodes:</span>
//           <span className="stat-value">{countVisibleNodes(treeData)}</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-label">Zoom:</span>
//           <span className="stat-value">{Math.round(transform.scale * 100)}%</span>
//         </div>
//       </div>

//       {/* وسيلة الإيضاح */}
//       <div className="tree-legend">
//         <div className="legend-item">
//           <svg width="20" height="20" style={{marginRight: '8px'}}>
//             <FolderIcon x={10} y={10} isExpanded={false} />
//           </svg>
//           <span>Folder</span>
//         </div>
//         <div className="legend-item">
//           <svg width="20" height="20" style={{marginRight: '8px'}}>
//             <FileIcon x={10} y={10} />
//           </svg>
//           <span>File</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SVGTree;


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

  // حساب مواضع العقد
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

  // رسم العقد والخطوط
  const renderNodes = (node) => {
    const nodes = [];
    
    // رسم الخطوط للأطفال أولاً (تحت العقد)
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
      
      // رسم الأطفال بشكل متكرر
      nodes.push(...renderNodes(child));
    });

    // رسم العقدة الحالية
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === 'folder';

    nodes.push(
      <g key={node.id} onClick={() => hasChildren && toggleNode(node.id)}>
        {/* دائرة الخلفية */}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill={isFolder ? '#667eea' : '#48bb78'}
          stroke="#2d3748"
          strokeWidth="2"
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
        >
          {node.name}
        </text>

        {/* مؤشر التوسيع للمجلدات */}
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
        {/* الخلفية */}
        <rect width="100%" height="100%" fill="#f7fafc" />
        
        {/* الخطوط */}
        <g className="tree-links">
          {renderNodes(layoutTree).filter(node => node.type === 'line')}
        </g>
        
        {/* العقد */}
        <g className="tree-nodes">
          {renderNodes(layoutTree).filter(node => node.type !== 'line')}
        </g>
      </svg>
    </div>
  );
};

export default SVGTree;