"use client";

import React, { useState } from "react";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { RevealText } from "@/components/ui/manifesto";
import { LimelightNav } from "@/components/ui/limelight-nav";
import { Footer } from "@/components/ui/footer";

export default function SponsorsInvestorsPage() {
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
                <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">Where the next wave of founders spend a week, not pitching, but building.</h1>
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
            <RevealText text="The future of the ecosystem doesn't start at conferences, it starts here." />
            <RevealText text="A week where builders, creators, and founders turn ideas into products and connections into companies." />
          </div>
        </div>
      </section>
      {/* Why sponsor section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Why sponsor</h3>
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white">
            <RevealText text="This isn't a demo day, it's a build week." />
            <RevealText text="Builders ship fast, team up, and drop projects before anyone else even hears about them." />
            <RevealText text="You get first access to the minds shaping what's next." />
            <RevealText text="Not deal flow, context flow. Meet founders before they raise, creators who build in public, and the minds shaping the next wave of adoption." />
            <RevealText text="You're not sponsoring an event, you're joining the story early, where indie hackers with paying users meet PhDs and CTOs building AI products." />
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
                  { id: 'analyst', label: 'Analyst' },
                  { id: 'principal', label: 'Principal' },
                  { id: 'partner', label: 'Partner' },
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
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Private access to project previews and invite-only dinners with top-tier founders, creators, and tech leads.</span>
                  </li>
                </ul>
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img 
                    src="/sponsors/investors/partner.jpeg" 
                    alt="Networking dinners location" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                  <p className="text-white/60 text-sm italic">Dinners will happen here</p>
                </div>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Want intros? Done.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Host a talk or AMA about building, scaling, or funding.</span>
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
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">You&apos;ll get a short branded video. We&apos;ll capture your story and give you the content ready to share.</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTabIndex === 2 && (
              <div className="text-white/80 space-y-3 max-w-xl mx-auto">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Lead the room. You can run a founder–investor session and create with us the story around your presence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Session naming: one of the event sessions or experiences will carry your name and be referenced in communications.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Get in early. Meet founders before they scale, and products before they even have names.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Want your own tennis tournament? We can make it happen! 🎾</span>
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

