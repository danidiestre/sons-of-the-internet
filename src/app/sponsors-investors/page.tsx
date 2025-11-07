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
            <RevealText text="Where builders, creators, and founders spend a week turning ideas into prototypes and connections into companies." />
          </div>
        </div>
      </section>
      {/* Why sponsor section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Why sponsor</h3>
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white">
            <RevealText text="This isn't a demo day, it's a creation week. Builders prototype ideas, form teams, and share projects before anyone else sees them. You get first access to the minds shaping what's next." />
            <RevealText text="This is not deal flow, it's context flow: a rare chance to connect with high-signal founders before they raise, and with creators who build in public and influence the next generation of tech adoption." />
            <RevealText text="Gain early access to the next generation of startup talent, from indie hackers with paying users, to technical founders with PhDs building AI products that actually ship." />
          </div>
        </div>
      </section>
      {/* Opportunity section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-8 sm:py-12">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8 text-center" style={{ fontFamily: 'var(--font-space-mono)' }}>Opportunity</h3>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">01.</span>
              <div>
                <p className="text-white font-medium">Meet the Future — Be where the next wave of builders begins.</p>
                <p className="text-white/80 leading-relaxed">Gain early access to founders and projects before they scale. Connect directly with the people shaping what&apos;s next in tech and get a private look at what&apos;s being built, by who, and why it matters.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">02.</span>
              <div>
                <p className="text-white font-medium">Lead and Discover — Share your expertise, spark new ideas.</p>
                <p className="text-white/80 leading-relaxed">Host a talk or AMA about building, scaling, or funding. Join curated dinners and builder sessions to connect with founders, creators, and technical talent who align with your thesis.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">03.</span>
              <div>
                <p className="text-white font-medium">Stay in the Story — Be part of what&apos;s built next.</p>
                <p className="text-white/80 leading-relaxed">Your presence continues long after the event. Receive branded content and a professional video clip featuring your brand and contribution — ready to share across your channels. Stay visible through post-event storytelling and new startup launches born here.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">04.</span>
              <div>
                <p className="text-white font-medium">Be Recognized — Build long-term visibility.</p>
                <p className="text-white/80 leading-relaxed">Represent your fund as an ally to the ecosystem. Your brand will be highlighted across event materials and communications, positioning you as a key supporter of innovation.</p>
              </div>
            </div>
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
                <p className="text-white/80 text-center leading-relaxed">
                  Logo and name featured on event materials and digital platforms.
                </p>
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
                    <span className="leading-relaxed">Private access to project previews and networking dinners with top-tier founders, creators, and tech leads.</span>
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
                    <span className="leading-relaxed">Includes branded content, receive a professional video clip featuring your brand and role in the event, ready to share on your channels.</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTabIndex === 2 && (
              <div className="text-white/80 space-y-3 max-w-xl mx-auto">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Lead the conversation and define the experience.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Host a private investor-founder session and co-create branded storytelling around your presence.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Session naming: one of the event sessions or experiences will carry your name and be referenced in all communications.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Get early access to emerging startups and high-potential founders while positioning your fund as a catalyst for what&apos;s next.</span>
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

