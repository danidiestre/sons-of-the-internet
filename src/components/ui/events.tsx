import React from "react";
import Image from "next/image";
import { GlowCard } from "@/components/ui/glow-card";

type EventStatus = "FINISHED" | "UPCOMING" | "ENCRYPTED" | "CLASSIFIED";

interface EventItem {
  id: string;
  status: EventStatus;
  date: string;
  title: string;
  location: string;
  cta: string;
  image: string;
  alt: string;
  href?: string;
  badge?: string;
}

const EVENTS: EventItem[] = [
  {
    id: "1",
    status: "FINISHED",
    date: "Sept 21, 2025",
    title: "La Settimana: Great Minds",
    location: "Taranto, Italy",
    cta: "VIEW EVENT →",
    image: "/events/italia.jpg",
    alt: "Taranto, Italy",
    href: "https://www.notion.so/valeramarcos/Taranto-La-Settimana-1f6bff6a5cda8083a794dd49975cf9ce?source=copy_link",
  },
  {
    id: "2",
    status: "UPCOMING",
    date: "Dec 15, 2025",
    title: "Barcelona Creative Week",
    location: "Barcelona, Spain",
    cta: "VIEW DETAILS →",
    image: "/events/barcelona.jpg",
    alt: "Barcelona, Spain",
    href: "https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link",
    badge: "FEW SPOTS LEFT",
  },
  {
    id: "3",
    status: "UPCOMING",
    date: "Jan 13, 2026",
    title: "Bangkok Summit: Digital Nomads",
    location: "Bangkok, Thailand",
    cta: "VIEW EVENT →",
    image: "/events/bangkok.jpg",
    alt: "Bangkok, Thailand",
  },
  {
    id: "4",
    status: "UPCOMING",
    date: "To be announced",
    title: "Bali Wellness Retreat Week",
    location: "Bali, Indonesia",
    cta: "VIEW DETAILS →",
    image: "/events/bali.jpg",
    alt: "Bali, Indonesia",
  },
];

function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, string> = {
    FINISHED: "text-emerald-300/80 border-emerald-300/20",
    UPCOMING: "text-amber-300/80 border-amber-300/20",
    ENCRYPTED: "text-sky-300/80 border-sky-300/20",
    CLASSIFIED: "text-red-300/80 border-red-300/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}

function EventCard({ item }: { item: EventItem }) {
  return (
    <GlowCard className="bg-white/5 p-3 sm:p-4 pb-3 sm:pb-4" glowColor={item.status === 'UPCOMING' ? 'purple' : 'blue'} customSize>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/40" />
      </div>
      <div className="px-4 sm:px-5 pt-2 sm:pt-3 pb-4 sm:pb-5 space-y-[6px]">
        <div className="flex items-center gap-2 flex-wrap">
          {item.badge ? (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide text-fuchsia-300/80 border-fuchsia-300/20">
              {item.badge}
            </span>
          ) : (
            <StatusBadge status={item.status} />
          )}
          <span className="text-xs text-white/50">{item.date}</span>
        </div>
        <h4 className="text-white text-base sm:text-lg font-medium">{item.title}</h4>
        <p className="text-white/60 text-sm">{item.location}</p>
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-white/80 hover:text-white transition-colors"
          >
            {item.cta}
          </a>
        ) : null}
      </div>
    </GlowCard>
  );
}

export function EventsSection() {
  return (
    <section id="2" className="w-full scroll-mt-32 md:scroll-mt-40">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
        <div className="mb-8">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Events</h3>
          <p className="text-white/60 mt-2">Mark your digital calendar. These moments only happen IRL.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {EVENTS.map((e) => (
            <EventCard key={e.id} item={e} />
          ))}
        </div>
      </div>
    </section>
  );
}


