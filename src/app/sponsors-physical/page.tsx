"use client";

import React, { useState } from "react";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { RevealText } from "@/components/ui/manifesto";
import { LimelightNav } from "@/components/ui/limelight-nav";
import { Footer } from "@/components/ui/footer";

export default function SponsorsPhysicalPage() {
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
                <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">Be part of the builders' daily life from what they eat to what they create with.</h1>
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
            <RevealText text="Where the brands of today meet the people building tomorrow." />
            <RevealText text="Inside the house, founders, creators, and engineers work, eat, and create side by side." />
            <RevealText text="This is where your brand becomes part of that story: seen in content, used by real people, and remembered by some of the most creative minds in tech." />
          </div>
        </div>
      </section>
      {/* Why sponsor section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Why sponsor</h3>
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white">
            <RevealText text="This is where brands turn into memories. From lunch tables to workstations, your product becomes part of the story, seen, shared, and remembered by some of the most creative minds in tech and content." />
            <RevealText text="Your brand fuels the experience. It's what they grab between coding sessions, what they use to film, or what's on the table when the next idea is born." />
            <RevealText text="We record, we share, and we reach an audience that includes founders and creators (with over 200,000 followers combined). People who shape what's next. The ones whose products, teams, and communities others will follow." />
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
                  { id: 'experience', label: 'Experience' },
                  { id: 'hero', label: 'Hero' },
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
                    <span className="leading-relaxed">Logo and recognition on the website and social media</span>
                  </li>
                </ul>
                <div className="flex justify-center">
                  <img 
                    src="/sponsors/investors/ally.png" 
                    alt="Experience tier" 
                    className="max-w-xs sm:max-w-sm h-auto border border-white/20 rounded-lg"
                  />
                </div>
                <ul className="text-white/80 space-y-3 max-w-xl mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Natural visibility throughout the house as your product becomes part of the daily content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Thank you mention during the week</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTabIndex === 1 && (
              <div className="space-y-6">
                <ul className="text-white/80 space-y-3 max-w-xl mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Featured presence in post-event storytelling and videos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Product integration and inclusion in event storytelling and videos. Content featuring how tech people and founders actually use your product.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50 mt-1">•</span>
                    <span className="leading-relaxed">Dedicated brand moment (meal, break, or activity) during the week</span>
                  </li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                  <div className="flex justify-center">
                    <img 
                      src="/sponsors/investors/jardin.jpeg" 
                      alt="Hero tier" 
                      className="max-w-full h-auto border border-white/20 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/sponsors/investors/partner-2.jpeg" 
                      alt="Hero tier" 
                      className="max-w-full h-auto border border-white/20 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/sponsors/investors/partner.jpeg" 
                      alt="Hero tier" 
                      className="max-w-full h-auto border border-white/20 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/sponsors/investors/salon.jpeg" 
                      alt="Hero tier" 
                      className="max-w-full h-auto border border-white/20 rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-white/60 text-center text-sm italic pt-2">Your brand will be here</p>
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
