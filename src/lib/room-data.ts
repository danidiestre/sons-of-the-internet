export interface Room {
  id: string;
  number: string;
  capacity: number;
  isSoldOut?: boolean;
  currentOccupancy?: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  floor: number;
  bedType: string;
  bathroomType: string;
  roomType: "shared" | "individual";
  roomSize: "small" | "large";
  beds: number;
  roomPrice: number;
  pricePerPerson: number;
  imageUrl?: string;
  paymentUrl?: string;
}

export interface FloorData {
  floorNumber: number;
  floorPlanPath: string;
  rooms: Room[];
}

// Static room data — coordinates are layout-only, everything else comes from the API
export const floorsData: FloorData[] = [
  {
    floorNumber: 0,
    floorPlanPath: "/valencia-rooms/1-planta-inferior-valencia.png",
    rooms: [
      {
        id: "floor-0-room-1",
        number: "Habitación 1",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 0,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 18.50, y: 49.45, width: 14.30, height: 17.30 },
      },
      {
        id: "floor-0-room-2",
        number: "Habitación 2",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 0,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 23.52, y: 22.81, width: 9.00, height: 13.89 },
      },
      {
        id: "floor-0-room-3",
        number: "Habitación 3",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 0,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 22.95, y: 37.33, width: 9.56, height: 11.87 },
      },
      {
        id: "floor-0-room-4",
        number: "Habitación 4",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 0,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 38.01, y: 82.45, width: 13.92, height: 11.49 },
      },
      {
        id: "floor-0-room-5",
        number: "Habitación 5",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 0,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 27.78, y: 82.45, width: 10.04, height: 10.98 },
      },
    ],
  },
  {
    floorNumber: 1,
    floorPlanPath: "/valencia-rooms/2-planta-media-valencia.png",
    rooms: [
      {
        id: "floor-1-room-7",
        number: "Habitación 7",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 1,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 21.34, y: 42.05, width: 26.04, height: 18.31 },
      },
      {
        id: "floor-1-room-8",
        number: "Habitación 8",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 1,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 56.76, y: 14.90, width: 21.40, height: 25.13 },
      },
      {
        id: "floor-1-room-9",
        number: "Habitación 9",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 1,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 22.00, y: 18.94, width: 14.49, height: 22.60 },
      },
    ],
  },
  {
    floorNumber: 2,
    floorPlanPath: "/valencia-rooms/3-planta-superior-valencia.png",
    rooms: [
      {
        id: "floor-2-room-6",
        number: "Habitación 6",
        capacity: 0,
        beds: 0,
        isSoldOut: false,
        floor: 2,
        bedType: "",
        bathroomType: "",
        roomType: "shared",
        roomSize: "small",
        roomPrice: 0,
        pricePerPerson: 0,
        coordinates: { x: 44.35, y: 14.44, width: 29.17, height: 68.56 },
      },
    ],
  },
];

// Legacy export for backward compatibility (uses floor 1)
export const rooms: Room[] = floorsData[0]?.rooms || [];
