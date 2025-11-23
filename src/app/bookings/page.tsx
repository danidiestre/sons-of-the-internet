"use client";

import React, { useState, useEffect } from "react";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { Footer } from "@/components/ui/footer";
import { FloorPlanMap } from "@/components/ui/floor-plan-map";
import { RoomDetailsPanel } from "@/components/ui/room-details-panel";
import { LimelightNav } from "@/components/ui/limelight-nav";
import { Room, floorsData } from "@/lib/room-data";

export default function BookingsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);

  // Block body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when panel closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isPanelOpen]);

  const currentFloor = floorsData[activeFloorIndex];

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Keep selectedRoom for a moment to allow animation, then clear it
    setTimeout(() => {
      setSelectedRoom(null);
    }, 300);
  };

  const handleFloorChange = (index: number) => {
    setActiveFloorIndex(index);
    // Clear selected room when switching floors
    if (isPanelOpen) {
      setIsPanelOpen(false);
    }
    setSelectedRoom(null);
  };

  return (
    <main className="bg-black">
      <section className="relative flex flex-col min-h-[50vh] md:min-h-[55vh] bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0)_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10 pt-16 sm:pt-28">
          <MiniNavbar />
          <div className="flex flex-col items-center justify-center h-full py-16 sm:py-24">
            <div className="w-full">
              <div className="w-full mx-auto max-w-2xl py-8 sm:py-12 text-center">
                <div className="space-y-10">
                  <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">Make your booking</h1>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <h2 className="text-[1.2rem] sm:text-[1.4rem] text-white/70 font-light">Reserve your spot for the next Barcelona house (15th December 2025)</h2>
                    <span className="px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white bg-red-500/20 border border-red-500/50 rounded-full" style={{ fontFamily: "var(--font-space-mono)" }}>
                      Sold out
                    </span>
                  </div>
                  <div className="relative group inline-block w-full sm:w-auto">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                    <a href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link" target="_blank" rel="noopener noreferrer" className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto cursor-pointer">
                      See details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plan Map Section */}
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
          <div className="mb-8 text-center">
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>
              Select a room
            </h3>
            <p className="text-white/60 mb-6">Click on a room to see its details</p>
            
            {/* Floor Tabs */}
            <div className="flex justify-center mb-8 w-full">
              <div className="w-full sm:w-auto">
                <LimelightNav
                  items={floorsData.map((floor) => ({
                    id: `floor-${floor.floorNumber}`,
                    label: `Floor ${floor.floorNumber + 1}`,
                  }))}
                  defaultActiveIndex={activeFloorIndex}
                  onTabChange={handleFloorChange}
                  className="bg-white/5 border-white/10 text-white w-full sm:w-auto"
                  limelightClassName="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Floor Plan Map */}
          {currentFloor && (
            <FloorPlanMap 
              onRoomClick={handleRoomClick}
              selectedRoomId={selectedRoom?.id || null}
              floorPlanPath={currentFloor.floorPlanPath}
              rooms={currentFloor.rooms}
            />
          )}
        </div>
      </section>

      {/* Room Details Panel */}
      <RoomDetailsPanel
        room={selectedRoom}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      <Footer />
    </main>
  );
}

