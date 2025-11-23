import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ content, children, position = 'top', delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef();
  const tooltipRef = useRef();

  const showTooltip = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // إغلاق الـ Tooltip عند الضغط على ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        hideTooltip();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let x = coords.x;
      let y = coords.y;

      if (x + tooltipRect.width > viewport.width - 10) {
        x = viewport.width - tooltipRect.width - 10;
      }
      if (x < 10) {
        x = 10;
      }
      if (y - tooltipRect.height < 10) {
        y = coords.y + 30; 
      }

      setCoords({ x, y });
    }
  }, [isVisible, coords]);

  if (!content) return children;

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`tooltip tooltip-${position}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y - 10}px`,
          }}
          role="tooltip"
        >
          <div className="tooltip-content">
            {content}
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;