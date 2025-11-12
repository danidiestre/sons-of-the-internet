"use client";

import React, { useState } from "react";
import { FloorPlanCoordHelper } from "@/components/ui/floor-plan-coord-helper";
import { floorsData } from "@/lib/room-data";
import { LimelightNav } from "@/components/ui/limelight-nav";

export default function BookingsHelperPage() {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const currentFloor = floorsData[activeFloorIndex];

  return (
    <main className="bg-black min-h-screen py-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Floor Plan Coordinate Helper</h1>
          <p className="text-white/70 mb-6">
            Use this page to measure room coordinates. Click and drag on the image to create rectangles.
          </p>
          
          {/* Floor Tabs */}
          <div className="flex justify-center mb-8 w-full">
            <div className="w-full sm:w-auto">
              <LimelightNav
                items={floorsData.map((floor) => ({
                  id: `floor-${floor.floorNumber}`,
                  label: `Piso ${floor.floorNumber}`,
                }))}
                defaultActiveIndex={activeFloorIndex}
                onTabChange={setActiveFloorIndex}
                className="bg-white/5 border-white/10 text-white w-full sm:w-auto"
                limelightClassName="bg-white"
              />
            </div>
          </div>
        </div>

        {currentFloor && (
          <FloorPlanCoordHelper floorPlanPath={currentFloor.floorPlanPath} />
        )}
      </div>
    </main>
  );
}

