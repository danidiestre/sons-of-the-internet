import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
        <div className="space-y-8">
          <div>
            <h4 className="text-white text-lg sm:text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Sons of The Internet</h4>
            <p className="text-white/60 mr-12 mt-2" style={{ fontFamily: 'var(--font-space-mono)' }}>A global community of digital natives who build, create, and connect beyond the web.</p>
            
            <div className="flex mt-4">
              <pre className="text-white/40 text-xs font-mono whitespace-pre leading-tight">
{`    _____ ____  _   _ _____ 
   / ____/ __ \\| \\ | / ____|
  | (___| |  | |  \\| (___ 
   \\___ \\| |  | | . \` |\\___ \\
   ____) | |__| | |\\  |____) |
  |_____/ \\____/|_| \\_|_____/`}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3">QUICK_LINKS</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/#1" className="text-white/70 hover:text-white transition-colors">&gt; Manifesto</a></li>
                <li><a href="/#2" className="text-white/70 hover:text-white transition-colors">&gt; Events</a></li>
                <li><a href="/sponsors" className="text-white/70 hover:text-white transition-colors">&gt; Sponsors</a></li>
                <li><a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">&gt; Apply to become a member</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white/80 text-xs tracking-wider mb-3">FIND_US</h5>
              <p className="text-white/50 text-sm mt-2">Only in real life.<br />We don't do social media.<br />We do moments that matter.</p>
            </div>
          </div>

          <div className="pt-6 text-white/30 text-xs">© {new Date().getFullYear()} Sons of The Internet</div>
        </div>
      </div>
    </footer>
  );
}


