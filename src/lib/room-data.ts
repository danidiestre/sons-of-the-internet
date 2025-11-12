export interface Room {
  id: string;
  number: string;
  capacity: number;
  hasPrivateBathroom: boolean;
  coordinates: {
    x: number; // percentage of image width
    y: number; // percentage of image height
    width: number; // percentage of image width
    height: number; // percentage of image height
  };
}

export interface FloorData {
  floorNumber: number;
  floorPlanPath: string;
  rooms: Room[];
}

// Room data - coordinates will need to be adjusted based on the actual floor plan
// Coordinates are in percentages (0-100) relative to the image dimensions
export const floorsData: FloorData[] = [
  {
    floorNumber: 0,
    floorPlanPath: "/floor-plan-2.svg", // Image from Piso 2
    rooms: [
      {
        id: "floor-0-room-9",
        number: "Habitación 9",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 27.55,
          y: 54.97,
          width: 6.24,
          height: 14.01,
        },
      },
      {
        id: "floor-0-room-10",
        number: "Habitación 10",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 18.3,
          y: 36.5,
          width: 18,
          height: 20.9,
        },
      },
      {
        id: "floor-0-room-11",
        number: "Habitación 11",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 33.10,
          y: 22.86,
          width: 13.38,
          height: 12.55,
        },
      },
    ],
  },
  {
    floorNumber: 1,
    floorPlanPath: "/floor-plan-4.svg", // Image from Piso 4
    rooms: [
      {
        id: "floor-1-room-6",
        number: "Habitación 6",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 17.64,
          y: 24.43,
          width: 10.44,
          height: 18.39,
        },
      },
      {
        id: "floor-1-room-12",
        number: "Habitación 12",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 28.77,
          y: 36.12,
          width: 7.88,
          height: 16.42,
        },
      },
      {
        id: "floor-1-room-5",
        number: "Habitación 5",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 28.08,
          y: 59.57,
          width: 10.15,
          height: 21.94,
        },
      },
      {
        id: "floor-1-room-4",
        number: "Habitación 4",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 38.92,
          y: 67.85,
          width: 10.34,
          height: 22.59,
        },
      },
      {
        id: "floor-1-room-3",
        number: "Habitación 3",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 50.05,
          y: 67.59,
          width: 9.66,
          height: 22.73,
        },
      },
      {
        id: "floor-1-room-2",
        number: "Habitación 2",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 60.30,
          y: 67.32,
          width: 10.25,
          height: 22.46,
        },
      },
      {
        id: "floor-1-room-1",
        number: "Habitación 1",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 70.64,
          y: 67.45,
          width: 9.75,
          height: 21.94,
        },
      },
    ],
  },
  {
    floorNumber: 2,
    floorPlanPath: "/floor-plan-5.svg", // New floor plan 5
    rooms: [
      {
        id: "floor-2-room-7",
        number: "Habitación 7",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 28.08,
          y: 46.96,
          width: 10.94,
          height: 14.06,
        },
      },
      {
        id: "floor-2-room-13",
        number: "Habitación 13",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 28.47,
          y: 61.81,
          width: 10.34,
          height: 19.05,
        },
      },
      {
        id: "floor-2-room-8",
        number: "Habitación 8",
        capacity: 2,
        hasPrivateBathroom: true,
        coordinates: {
          x: 38.92,
          y: 75.34,
          width: 9.06,
          height: 14.06,
        },
      },
    ],
  },
];

// Legacy export for backward compatibility (uses floor 1)
export const rooms: Room[] = floorsData[0]?.rooms || [];

