"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Room } from "@/lib/room-data";
import { cn } from "@/lib/utils";

interface FloorPlanMapProps {
  onRoomClick: (room: Room) => void;
  selectedRoomId: string | null;
  floorPlanPath: string;
  rooms: Room[];
}

export function FloorPlanMap({ onRoomClick, selectedRoomId, floorPlanPath, rooms }: FloorPlanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setImageDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleRoomClick = (room: Room) => {
    onRoomClick(room);
  };

  const getRoomStyle = (room: Room) => {
    const { x, y, width, height } = room.coordinates;
    return {
      position: "absolute" as const,
      left: `${x}%`,
      top: `${y}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full bg-white/5 rounded-lg overflow-hidden border border-white/10"
        style={{ aspectRatio: "4/3" }}
      >
          {/* Floor plan image */}
          <div className="absolute inset-0">
            <Image
              src={floorPlanPath}
              alt="Plano de la casa"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Clickable room areas */}
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const isHovered = hoveredRoomId === room.id;

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => handleRoomClick(room)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId(null)}
                className={cn(
                  "absolute cursor-pointer transition-all duration-200 border-2 rounded",
                  isSelected
                    ? "bg-yellow-400/60 border-yellow-400 z-10"
                    : isHovered
                    ? "bg-yellow-400/20 border-yellow-400/60 z-10"
                    : "bg-yellow-400/10 border-yellow-400/40 opacity-60 hover:opacity-100"
                )}
                style={getRoomStyle(room)}
                aria-label={`Habitación ${room.number}`}
              >
                {/* Room number label - always visible but more prominent on hover/select */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={cn(
                    "text-white text-xs font-medium bg-black/40 px-1.5 py-0.5 rounded transition-opacity",
                    (isSelected || isHovered) ? "opacity-100 bg-black/70 text-sm" : "opacity-60"
                  )}>
                    {room.number.replace("Habitación ", "")}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

