"use client";

import React from "react";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { Footer } from "@/components/ui/footer";
import { GlowCard } from "@/components/ui/glow-card";

export default function SponsorsPage() {
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
                <div className="space-y-2">
                  <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">Invest in the builders of the future.</h1>
                  <h2 className="text-[1.5rem] sm:text-[1.8rem] text-white/70 font-light">We bring together the next generation of builders, creators, and innovators.</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Partner section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Why partner with us?</h3>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">01.</span>
              <div>
                <p className="text-white font-medium">Access</p>
                <p className="text-white/80 leading-relaxed">We curate presence. Every guest, every brand, every space is intentional. This is not about visibility. It's about belonging where the right people gather.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">02.</span>
              <div>
                <p className="text-white font-medium">Trust</p>
                <p className="text-white/80 leading-relaxed">No banners, no noise. Just authentic exchanges that build credibility and narrative over time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/50 select-none">03.</span>
              <div>
                <p className="text-white font-medium">Legacy</p>
                <p className="text-white/80 leading-relaxed">Your name becomes part of something that will outlive the event itself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Who We Work With */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Who we work with</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <GlowCard className="bg-white/5 p-4" glowColor="purple" customSize>
              <div className="space-y-2">
                <p className="text-white font-medium">Venture Capital & Angel Syndicates</p>
                <p className="text-white/80 text-sm leading-relaxed">Early investors seeking proximity to emerging founders and builders.</p>
              </div>
            </GlowCard>
            <GlowCard className="bg-white/5 p-4" glowColor="blue" customSize>
              <div className="space-y-2">
                <p className="text-white font-medium">Accelerators & Incubators</p>
                <p className="text-white/80 text-sm leading-relaxed">Programs looking to attract and connect with high-intent talent.</p>
              </div>
            </GlowCard>
            <GlowCard className="bg-white/5 p-4" glowColor="green" customSize>
              <div className="space-y-2">
                <p className="text-white font-medium">Tech Companies & SaaS Tools</p>
                <p className="text-white/80 text-sm leading-relaxed">Brands that understand influence begins with trust, not impressions.</p>
              </div>
            </GlowCard>
            <GlowCard className="bg-white/5 p-4" glowColor="orange" customSize>
              <div className="space-y-2">
                <p className="text-white font-medium">Lifestyle & Creative Brands</p>
                <p className="text-white/80 text-sm leading-relaxed">Names that value culture, precision, and quiet influence.</p>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>
      {/* Partnership Packages */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>Partnership packages</h3>
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            <GlowCard className="bg-white/5 p-5 sm:p-6" glowColor="purple" customSize>
              <div className="space-y-2">
                <p className="text-white font-semibold">FOUNDING PARTNER</p>
                <p className="text-white/80">€10,000+</p>
                <p className="text-white/80 leading-relaxed">For those who want to help define what SOTI becomes. Includes co-branded presence, roundtable access, and shared equity opportunities.</p>
              </div>
            </GlowCard>
            <GlowCard className="bg-white/5 p-5 sm:p-6" glowColor="blue" customSize>
              <div className="space-y-2">
                <p className="text-white font-semibold">EXPERIENCE SPONSOR</p>
                <p className="text-white/80">€5,000</p>
                <p className="text-white/80 leading-relaxed">For brands that want to shape the atmosphere. Includes activation space, communication presence, and private access.</p>
              </div>
            </GlowCard>
            <GlowCard className="bg-white/5 p-5 sm:p-6" glowColor="green" customSize>
              <div className="space-y-2">
                <p className="text-white font-semibold">COMMUNITY SUPPORTER</p>
                <p className="text-white/80">€3,000</p>
                <p className="text-white/80 leading-relaxed">For those who simply want to be part of the circle. Includes visibility, post-event insights, and early access to the next gathering.</p>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>
      {/* What You Receive */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>What you receive</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-white font-medium mb-4">During Events</p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• <span className="font-medium">Presence across key touchpoints</span></li>
                <li>• <span className="font-medium">Private roundtable or workshop involvement</span></li>
                <li>• <span className="font-medium">Direct access to attendees</span></li>
                <li>• <span className="font-medium">On-site documentation and coverage</span></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-4">Post-Event</p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• <span className="font-medium">Detailed report and insights</span></li>
                <li>• <span className="font-medium">Media assets for internal or external use</span></li>
                <li>• <span className="font-medium">Priority invitations for future editions</span></li>
              </ul>
            </div>
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


