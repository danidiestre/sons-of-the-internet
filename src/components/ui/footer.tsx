import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TALLY_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10" style={{ background: '#000000' }}>
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
        <div className="space-y-8">
          <div>
            <div className="flex mb-4">
              <div className="relative w-40 h-14">
                <Image src="/logo-white-simple.png" alt="SOTI Isotope" fill className="object-contain" priority={false} />
              </div>
            </div>
            <p className="text-white/60 mr-12 text-sm" style={{ fontFamily: 'var(--font-dm-mono)' }}>people you&apos;d actually want to spend a night, a week, or a lifetime building with.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>QUICK_LINKS</h5>
              <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                <li><Link href="/#1" className="text-white/70 hover:text-white transition-colors">&gt; Manifesto</Link></li>
                <li><Link href="/#2" className="text-white/70 hover:text-white transition-colors">&gt; Houses</Link></li>
                <li><a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">&gt; Apply to become a member</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>FIND_US</h5>
              <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>only in real life.<br />we don&apos;t do social media.<br />we do moments that matter.</p>
            </div>
          </div>

          <div className="pt-6 text-white/30 text-xs" style={{ fontFamily: 'var(--font-dm-mono)' }}>&copy; {new Date().getFullYear()} SOTI</div>
        </div>
      </div>
    </footer>
  );
}


