import React from "react";

export function ManifestoSection() {
  return (
    <section id="1" className="w-full scroll-mt-32 md:scroll-mt-40">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-10 sm:py-12">
        <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>The Manifesto</h3>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <span className="text-white/50 select-none">01</span>
            <p className="text-white/80 leading-relaxed">We grew up online, through forums, pixels and late-night calls.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-white/50 select-none">02</span>
            <p className="text-white/80 leading-relaxed">We build in public, meet offline, and chase that first feeling of discovering the internet.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-white/50 select-none">03</span>
            <p className="text-white/80 leading-relaxed">We're digital natives who enjoy disconnecting with other passionate builders.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-white/50 select-none">04</span>
            <p className="text-white/80 leading-relaxed">Our community is global, our connections are real, and our gatherings never forget.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


