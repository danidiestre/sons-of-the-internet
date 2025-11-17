import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
        <div className="space-y-8">
          <div>
            <h4 className="text-white text-lg sm:text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>SOTI Family</h4>
            <p className="text-white/60 mr-12 mt-2" style={{ fontFamily: 'var(--font-space-mono)' }}>A global community of digital natives who build, create, and connect beyond the web.</p>
            
            <div className="flex mt-4">
              <div className="relative w-40 h-14">
                <Image
                  src="/logo-white.png"
                  alt="SOTI Isotope"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3">QUICK_LINKS</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#1" className="text-white/70 hover:text-white transition-colors">&gt; Manifesto</Link></li>
                <li><Link href="/#2" className="text-white/70 hover:text-white transition-colors">&gt; Houses</Link></li>
                <li><a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">&gt; Apply to become a member</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3">FIND_US</h5>
              <p className="text-white/50 text-sm mt-2">Only in real life.<br />We don&apos;t do social media.<br />We do moments that matter.</p>
            </div>
          </div>

          <div className="pt-6 text-white/30 text-xs">© {new Date().getFullYear()} SOTI</div>
        </div>
      </div>
    </footer>
  );
}


