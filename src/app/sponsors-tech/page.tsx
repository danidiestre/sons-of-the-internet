"use client";

import React, { useState } from "react";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { RevealText } from "@/components/ui/manifesto";
import { LimelightNav } from "@/components/ui/limelight-nav";
import { Footer } from "@/components/ui/footer";

export default function SponsorsTechPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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
                <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">Your product powering what gets built, used, shared, and remembered.</h1>
                <div className="mt-8">
                  <div className="relative group inline-block">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                    <a href="https://tally.so/r/waboyB" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply for sponsorship</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Text section with RevealText */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white">
            <RevealText text="Where the tools of the future meet the people who build it." />
            <RevealText text="Inside a house full of founders, content creators, and engineers working side by side; building new products, new companies, and new stories that spread fast online." />
            <RevealText text="This is where your software powers what's next and gets discovered by the kind of talent every tech company wants to hire." />
          </div>
        </div>
      </section>
      {/* Why sponsor section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Why sponsor</h3>
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white">
            <RevealText text="Your platform isn't just showcased. It's used by founders, creators, and engineers building what's next. Real projects, real users, real visibility." />
            <RevealText text="Inside the house, people don't just talk about the future. They build it. Teams create together, launch early versions, and share the journey online." />
            <RevealText text="Your product becomes part of that story. It powers new launches, gets discovered and earns trust through use (and people will see that online)." />
            <RevealText text="You're not sponsoring a hackerhouse. You're stepping into the ecosystem where tomorrow's teams, tools, and startups are born." />
          </div>
        </div>
      </section>
      {/* Partnership Tiers section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-8 sm:py-12">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8 text-center" style={{ fontFamily: 'var(--font-space-mono)' }}>Partnership Tiers</h3>
          <div className="flex justify-center mb-8 w-full">
            <div className="w-full sm:w-auto">
              <LimelightNav
                items={[
                  { id: 'supporter', label: 'Supporter' },
                  { id: 'core', label: 'Core' },
                  { id: 'main-stack', label: 'Main Stack' },
                ]}
                defaultActiveIndex={activeTabIndex}
                onTabChange={setActiveTabIndex}
                className="bg-white/5 border-white/10 text-white w-full sm:w-auto"
                limelightClassName="bg-white"
              />
            </div>
          </div>
          <div className="mt-8">
            {activeTabIndex === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-white/60 text-sm uppercase tracking-wide mb-1">PRICE</p>
                  <p className="text-white text-xl font-semibold">€3K</p>
                </div>
                <ul className="text-white/80 space-y-3 max-w-xl mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Be part of it. Logo and name featured across event materials, comms, and digital platforms.</span>
                  </li>
                </ul>
                <div className="flex justify-center">
                  <img 
                    src="/sponsors/investors/ally.png" 
                    alt="Community Ally" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                </div>
              </div>
            )}
            {activeTabIndex === 1 && (
              <div className="text-white/80 space-y-3 max-w-xl mx-auto">
                <div className="text-center mb-4">
                  <p className="text-white/60 text-sm uppercase tracking-wide mb-1">PRICE</p>
                  <p className="text-white text-xl font-semibold">€5K</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Option to host a short talk, workshop, or builder challenge</span>
                  </li>
                </ul>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/partner-2.jpeg" 
                    alt="Talks location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">Talks will happen here</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/salon.jpeg" 
                    alt="Salon location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">and also here</p>
                </div>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Included in the official Builder Stack used by founders, creators, and GTM people. Builders use your tools live. real usage, real visibility (if you&apos;re here, it&apos;s because we know they can use it).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">We&apos;ll capture it all: <strong>photos and clips</strong> of people actually building with your product.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Want to bring people to your own community platform? Let us know, we&apos;ll mention it in the videos</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTabIndex === 2 && (
              <div className="text-white/80 space-y-3 max-w-xl mx-auto">
                <div className="text-center mb-4">
                  <p className="text-white/60 text-sm uppercase tracking-wide mb-1">PRICE</p>
                  <p className="text-white text-xl font-semibold">€10K</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Lead the room. Co-create the story around your presence; storytelling, behind-the-scenes, featured content.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Post-event analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Option to share open roles with attendees or collaborate on hiring spotlight</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">One event or session or experience carries your name and is referenced in all communications.</span>
                  </li>
                </ul>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/partner.jpeg" 
                    alt="Events location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">events will happen here</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/jardin.jpeg" 
                    alt="Jardin location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">and also here</p>
                </div>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Want your own tennis tournament or party? We can make it happen! 🎾</span>
                  </li>
                </ul>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/headline.jpeg" 
                    alt="Tennis tournaments location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">Tennis tournments will happen here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Build something that matters</h3>
          <p className="text-white/70 mt-3">Not another sponsorship.</p>
          <p className="text-white/70">A shared moment of relevance.</p>
          <div className="mt-8">
            <div className="relative group inline-block">
              <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
              <a href="https://tally.so/r/waboyB" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply for sponsorship</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
