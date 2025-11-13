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

          {/* Dark overlay layer */}
          <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

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
                  "absolute cursor-pointer transition-all duration-200 border-2 rounded z-20",
                  isSelected
                    ? "bg-yellow-400/60 border-yellow-400"
                    : isHovered
                    ? "bg-yellow-400/20 border-yellow-400/60"
                    : "bg-yellow-300/5 border-yellow-400 opacity-100"
                )}
                style={getRoomStyle(room)}
                aria-label={`Habitación ${room.number}`}
              >
                {/* Room number label - always visible but more prominent on hover/select */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
                  <span className={cn(
                    "text-white text-xs font-medium bg-black/40 px-1.5 py-0.5 rounded transition-opacity",
                    (isSelected || isHovered) ? "opacity-100 bg-black/10 text-sm" : "opacity-100"
                  )}>
                    Room {room.number.replace("Habitación ", "")}
                  </span>
                  {/* Room type tag - hidden on mobile */}
                  <span className={cn(
                    "hidden sm:inline-block text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide",
                    room.roomType === "shared" 
                      ? "bg-blue-500/80 text-white" 
                      : "bg-green-500/80 text-white"
                  )}>
                    {room.roomType === "shared" ? "Shared" : "Individual"}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

