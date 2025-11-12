"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface CoordHelperProps {
  floorPlanPath: string;
}

export function FloorPlanCoordHelper({ floorPlanPath }: CoordHelperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [rectangles, setRectangles] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
  }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);

  useEffect(() => {
    const updateImageSize = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const img = containerRef.current.querySelector('img');
        if (img) {
          setImageSize({
            width: containerRect.width,
            height: containerRect.height,
            naturalWidth: img.naturalWidth || 0,
            naturalHeight: img.naturalHeight || 0,
          });
        }
      }
    };

    // Wait a bit for image to load
    const timer = setTimeout(updateImageSize, 100);
    window.addEventListener('resize', updateImageSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateImageSize);
    };
  }, [floorPlanPath]);

  // Handle space key to save current selection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentPos && startPos && isDrawing) {
        e.preventDefault();
        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);

        if (width > 1 && height > 1) {
          setRectangles([...rectangles, {
            x,
            y,
            width,
            height,
            id: `room-${rectangles.length + 1}`,
          }]);
        }

        setIsDrawing(false);
        setStartPos(null);
        setCurrentPos(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPos, startPos, isDrawing, rectangles]);

  const getRelativeCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getRelativeCoords(e.clientX, e.clientY);
    setStartPos(coords);
    setCurrentPos(coords);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos) return;
    const coords = getRelativeCoords(e.clientX, e.clientY);
    setCurrentPos(coords);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos || !currentPos) return;
    
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width > 1 && height > 1) {
      setRectangles([...rectangles, {
        x,
        y,
        width,
        height,
        id: `room-${rectangles.length + 1}`,
      }]);
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const getCurrentRect = () => {
    if (!startPos || !currentPos) return null;
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);
    return { x, y, width, height };
  };

  const currentRect = getCurrentRect();

  const copyToClipboard = (rect: typeof rectangles[0]) => {
    const code = `{
  id: "${rect.id}",
  number: "Habitación X",
  capacity: 2,
  hasPrivateBathroom: true,
  coordinates: {
    x: ${rect.x.toFixed(2)},
    y: ${rect.y.toFixed(2)},
    width: ${rect.width.toFixed(2)},
    height: ${rect.height.toFixed(2)},
  },
},`;
    navigator.clipboard.writeText(code);
    alert("Coordinates copied to clipboard!");
  };

  return (
    <div className="w-full p-6">
      <div className="mb-4 space-y-2">
        <h3 className="text-white text-xl font-semibold">Floor Plan Coordinate Helper</h3>
        <p className="text-white/70 text-sm">
          Click and drag on the image to create rectangles. Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd> to save the current selection, or release mouse to save automatically. Click on a rectangle to copy its coordinates.
        </p>
        
        {/* Image Size Info */}
        {imageSize && (
          <div className="p-3 bg-white/5 rounded border border-white/10 text-white/80 text-sm font-mono">
            <div className="font-semibold mb-1">📐 Tamaño de la imagen:</div>
            <div>Contenedor: {imageSize.width.toFixed(0)} x {imageSize.height.toFixed(0)} px</div>
            {imageSize.naturalWidth > 0 && (
              <div>Tamaño natural: {imageSize.naturalWidth} x {imageSize.naturalHeight} px</div>
            )}
          </div>
        )}
        
        <button
          onClick={() => setRectangles([])}
          className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
        >
          Clear All
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-white/5 rounded-lg overflow-hidden border border-white/10 cursor-crosshair"
        style={{ aspectRatio: "4/3" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Floor plan image */}
        <div className="absolute inset-0">
          <Image
            src={floorPlanPath}
            alt="Plano de la casa"
            fill
            className="object-contain"
            priority
            onLoad={(e) => {
              if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const img = e.currentTarget;
                setImageSize({
                  width: containerRect.width,
                  height: containerRect.height,
                  naturalWidth: img.naturalWidth || 0,
                  naturalHeight: img.naturalHeight || 0,
                });
              }
            }}
          />
        </div>

        {/* Existing rectangles */}
        {rectangles.map((rect) => (
          <div
            key={rect.id}
            onClick={() => copyToClipboard(rect)}
            className="absolute border-2 border-blue-400 bg-blue-400/20 cursor-pointer hover:bg-blue-400/30 transition-colors"
            style={{
              left: `${rect.x}%`,
              top: `${rect.y}%`,
              width: `${rect.width}%`,
              height: `${rect.height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 text-xs text-blue-400 font-mono whitespace-nowrap">
              {rect.id}: x:{rect.x.toFixed(1)}% y:{rect.y.toFixed(1)}% w:{rect.width.toFixed(1)}% h:{rect.height.toFixed(1)}%
            </div>
          </div>
        ))}

        {/* Current drawing rectangle */}
        {currentRect && (
          <div
            className="absolute border-2 border-yellow-400 bg-yellow-400/20 pointer-events-none"
            style={{
              left: `${currentRect.x}%`,
              top: `${currentRect.y}%`,
              width: `${currentRect.width}%`,
              height: `${currentRect.height}%`,
            }}
          />
        )}
      </div>

      {/* Coordinates list */}
      {rectangles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-white font-semibold">Created Rectangles:</h4>
          {rectangles.map((rect) => (
            <div
              key={rect.id}
              className="p-3 bg-white/5 rounded border border-white/10 text-white/80 text-sm font-mono"
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>{rect.id}:</strong> x: {rect.x.toFixed(2)}%, y: {rect.y.toFixed(2)}%, 
                  width: {rect.width.toFixed(2)}%, height: {rect.height.toFixed(2)}%
                </div>
                <button
                  onClick={() => copyToClipboard(rect)}
                  className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

