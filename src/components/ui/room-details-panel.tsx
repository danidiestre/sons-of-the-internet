"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Room } from "@/lib/room-data";
import { cn } from "@/lib/utils";

interface RoomDetailsPanelProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomDetailsPanel({ room, isOpen, onClose }: RoomDetailsPanelProps) {
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Reset booking expanded state when room changes
  useEffect(() => {
    setIsBookingExpanded(false);
  }, [room?.id]);

  const handleCopyIban = async () => {
    const iban = "IE49 REVO 9903 6021 1747 60";
    try {
      await navigator.clipboard.writeText(iban);
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy IBAN:", err);
    }
  };

  const handleBookRoomClick = () => {
    setIsBookingExpanded(!isBookingExpanded);
    if (!isBookingExpanded) {
      // Scroll to the booking section after a short delay to allow expansion
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  if (!room) return null;

  const isSoldOut = room.isSoldOut;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[500px] bg-black border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>
              Room Details
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Room Image */}
          {room.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden border border-white/10">
              <div className="relative w-full aspect-video">
                <Image
                  src={room.imageUrl}
                  alt={`Room ${room.number.replace("Habitación ", "")}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Accordion with room details */}
          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            <AccordionItem value="details" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">Room {room.number.replace("Habitación ", "")}</span>
                  {/* Room type tag */}
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded uppercase tracking-wide",
                    room.roomType === "shared" 
                      ? "bg-blue-500/80 text-white" 
                      : "bg-green-500/80 text-white"
                  )}>
                    {room.roomType === "shared" ? "Shared" : "Individual"}
                  </span>
                  {isSoldOut && (
                    <span className="text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide bg-red-500/80 text-white">
                      Sold Out
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/80 space-y-4">
                {/* Price */}
                <div className="pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">€{room.roomPrice}</p>
                    <p className="text-sm text-white/60">per room</p>
                  </div>
                  <p className="text-sm text-white/60 mt-1">€{room.pricePerPerson} per person</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Capacity</p>
                    <p className="text-base">{room.capacity} {room.capacity === 1 ? "person" : "people"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Floor</p>
                    <p className="text-base">Floor {room.floor + 1}</p>
                  </div>
                </div>

                {/* Bed Type */}
                <div>
                  <p className="text-sm text-white/60 mb-1">Bed Type</p>
                  <p className="text-base">{room.bedType}</p>
                </div>

                {/* Bathroom */}
                <div>
                  <p className="text-sm text-white/60 mb-1">Bathroom</p>
                  <p className="text-base">
                    {room.bathroomType === "private" ? "Private bathroom" : "Shared bathroom"} (Bathroom {room.bathroomNumber})
                  </p>
                </div>

                {/* Room Size */}
                <div>
                  <p className="text-sm text-white/60 mb-1">Room Size</p>
                  <p className="text-base capitalize">{room.roomSize}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Book this room CTA */}
          <div className="mt-2" ref={bookingRef}>
            <button
              onClick={isSoldOut ? undefined : handleBookRoomClick}
              disabled={isSoldOut}
              className={cn(
                "w-full px-4 py-3 font-semibold rounded-lg transition-colors",
                isSoldOut
                  ? "bg-white/10 text-white/60 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90 cursor-pointer"
              )}
            >
              {isSoldOut ? "Sold Out" : "Book this room"}
            </button>

            {/* Expanded booking information */}
            {!isSoldOut && isBookingExpanded && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                <p className="text-white/80 text-sm">
                  To save the spot send the payment via Revolut full payment with "Your name  - Booking Room {room.number.replace("Habitación ", "")}".
                </p>
                <div className="space-y-2">
                  <div>
                    <a
                      href={`https://revolut.me/sokram98?amount=${room.roomPrice * 100}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-white/80 text-sm"
                    >
                      https://revolut.me/sokram98?amount={room.roomPrice * 100}
                    </a>
                  </div>
                  <div>
                    <span className="text-white/80 text-sm">or IBAN: </span>
                    <button
                      onClick={handleCopyIban}
                      className="inline-flex items-center gap-1 text-white underline hover:text-white/80 font-mono text-sm"
                    >
                      IE49 REVO 9903 6021 1747 60
                      {ibanCopied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-white/80 text-sm">
                  We'll send you a message once we receive the payment, and your room will then be confirmed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

