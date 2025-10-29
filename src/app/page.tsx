import { HeroSection } from "@/components/ui/hero";
import { ManifestoSection } from "@/components/ui/manifesto";
import { EventsSection } from "@/components/ui/events";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <main className="bg-black">
      <HeroSection />
      <ManifestoSection />
      <EventsSection />
      {/* Final CTA */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight">Build something that matters</h3>
          <p className="text-white/70 mt-3">Not another communty.</p>
          <p className="text-white/70">Join the new generation of builders now</p>
          <div className="mt-8">
            <div className="relative group inline-block">
              <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
              <a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply as a member</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
