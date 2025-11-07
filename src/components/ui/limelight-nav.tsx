"use client";

import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;

const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;

const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

export type NavItem = {
  id: string | number;
  icon?: React.ReactElement;
  label: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const updateLimelight = () => {
      const limelight = limelightRef.current;
      const activeItem = navItemRefs.current[activeIndex];
      
      if (limelight && activeItem && activeItem.offsetWidth > 0) {
        const itemWidth = activeItem.offsetWidth;
        const limelightWidth = itemWidth * 0.8; // 80% of item width
        const newLeft = activeItem.offsetLeft + itemWidth / 2 - limelightWidth / 2;
        limelight.style.left = `${newLeft}px`;
        limelight.style.width = `${limelightWidth}px`;
        if (!isReady) {
          setTimeout(() => setIsReady(true), 50);
        }
      }
    };

    // Initial update
    updateLimelight();

    // Update on resize
    window.addEventListener('resize', updateLimelight);
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updateLimelight();
    });

    return () => {
      window.removeEventListener('resize', updateLimelight);
    };
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={`relative flex items-center h-16 rounded-lg bg-card text-foreground border px-2 ${className}`}>
      {items.map(({ id, icon, label, onClick }, index) => (
          <a
            key={id}
            ref={el => { navItemRefs.current[index] = el; }}
            className={`relative z-20 flex h-full cursor-pointer items-center justify-center px-3 sm:px-5 text-center ${iconContainerClassName}`}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {icon ? (
              cloneElement(icon as React.ReactElement<any>, {
                className: `w-6 h-6 transition-opacity duration-100 ease-in-out ${
                  activeIndex === index ? 'opacity-100' : 'opacity-40'
                } ${(icon.props as any)?.className || ''} ${iconClassName || ''}`,
              })
            ) : (
              <span className={`text-sm font-medium transition-opacity duration-100 ease-in-out whitespace-nowrap ${
                activeIndex === index ? 'opacity-100' : 'opacity-40'
              } ${iconClassName || ''}`}>
                {label}
              </span>
            )}
          </a>
      ))}
      <div 
        ref={limelightRef}
        className={`absolute top-0 z-10 h-[5px] rounded-full ${
          limelightClassName || 'bg-primary'
        } ${
          isReady ? 'transition-[left,width] duration-400 ease-in-out' : ''
        }`}
        style={{ 
          left: '-999px', 
          width: '0px',
          boxShadow: limelightClassName ? '0 50px 15px rgba(255, 255, 255, 0.3)' : undefined
        }}
      >
        <div 
          className={`absolute left-[-30%] top-[5px] w-[160%] h-14 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] pointer-events-none ${
            limelightClassName ? 'bg-gradient-to-b from-white/30 to-transparent' : 'bg-gradient-to-b from-primary/30 to-transparent'
          }`} 
        />
      </div>
    </nav>
  );
};

