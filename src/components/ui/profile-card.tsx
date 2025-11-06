import React from "react";
import Image from "next/image";
import { Twitter, Github, Linkedin } from "lucide-react";

interface ProfileCardProps {
  name: string;
  description: string;
  imageUrl: string;
  twitterUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function ProfileCard({
  name,
  description,
  imageUrl,
  twitterUrl,
  githubUrl,
  linkedinUrl,
}: ProfileCardProps) {
  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Image */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Name */}
        <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>
          {name}
        </h4>

        {/* Social Links */}
        <div className="flex gap-4 items-center">
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Twitter size={18} />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Github size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Linkedin size={18} />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

