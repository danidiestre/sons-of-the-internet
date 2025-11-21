import { HeroSection } from "@/components/ui/hero";
import { BarcelonaHouseSection } from "@/components/ui/barcelona-house";
import { ManifestoSection } from "@/components/ui/manifesto";
import { EventsSection } from "@/components/ui/events";
import { ScheduleSection } from "@/components/ui/schedule";
import { Footer } from "@/components/ui/footer";
import ExampleProgress from "@/components/ui/progress-1";
import { ProfileCard } from "@/components/ui/profile-card";

export default function Home() {
  return (
    <main className="bg-black">
      <HeroSection />
      <BarcelonaHouseSection />
      {/* Builders Progress Section */}
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
          <ExampleProgress value={75} />
        </div>
      </section>
      <ManifestoSection />
      <EventsSection />
      <ScheduleSection />
      {/* Led by Section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-center" style={{ fontFamily: 'var(--font-space-mono)' }}>Led by:</h3>
          <p className="text-white/60 mb-12 text-center">Meet the builders behind SOTI</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileCard
              name="Marcos Valera"
              description="GTM, community. 10k youtube + 25k linkedin. Startups and builders audience."
              imageUrl="/marcos.jpeg"
              twitterUrl="https://x.com/_MarcosValera"
              linkedinUrl="https://www.linkedin.com/in/valeramarcos/"
              youtubeUrl="https://www.youtube.com/@MarcosValera"
            />
            <ProfileCard
              name="Juan Pablo"
              description="Researcher and CTO. how research AI works"
              imageUrl="/juan-pablo.jpeg"
              twitterUrl="https://x.com/jpgallegoar"
              githubUrl="https://github.com/jpgallegoar"
              linkedinUrl="https://www.linkedin.com/in/jpgallegoar/"
            />
            <ProfileCard
              name="Dani Diestre"
              description="Co-Founder Autentic, Youtube Creator"
              imageUrl="/dani.png"
              githubUrl="https://github.com/danidiestre"
              linkedinUrl="https://www.linkedin.com/in/danidiestre/"
              youtubeUrl="https://www.youtube.com/@danidiestre"
            />
            <ProfileCard
              name="Aniol Carreras"
              description="COO at The Hero Camp (Product School Leader in Spain) , Events Creator - Leading Product Fest (Madrid, 3 editions)"
              imageUrl="/aniol.jpeg"
              twitterUrl="https://x.com/carrerasaniol"
              linkedinUrl="https://www.linkedin.com/in/aniolcarreras"
            />
            <ProfileCard
              name="Jose Saura"
              description="Indiehacker - Paellas CEO - Starting on / IG / Tiktok - Skool community $1000MRR - DJ"
              imageUrl="/saura.jpeg"
              twitterUrl="https://x.com/iamsaura_"
              githubUrl="https://github.com/eddsaura"
              linkedinUrl="https://www.linkedin.com/in/jesauraoller/"
            />
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Build something that matters</h3>
          <p className="text-white/70 mt-3">Not another communty.</p>
          <p className="text-white/70">Join the new generation of builders now</p>
          <div className="mt-8">
            <div className="relative group inline-block">
              <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
              <a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply to join the house</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
