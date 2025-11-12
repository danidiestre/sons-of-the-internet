"use client";

import React from "react";
import { X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Room } from "@/lib/room-data";
import { cn } from "@/lib/utils";

interface RoomDetailsPanelProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomDetailsPanel({ room, isOpen, onClose }: RoomDetailsPanelProps) {
  if (!room) return null;

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
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-black border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>
              Detalles de la habitación
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Accordion with room details */}
          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            <AccordionItem value="details" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80 py-4">
                <span className="text-lg font-medium">Habitación {room.number.replace("Habitación ", "")}</span>
              </AccordionTrigger>
              <AccordionContent className="text-white/80 space-y-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Capacidad</p>
                  <p className="text-base">{room.capacity} {room.capacity === 1 ? "persona" : "personas"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Baño</p>
                  <p className="text-base">
                    {room.hasPrivateBathroom ? "Baño privado" : "Baño compartido"}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}

