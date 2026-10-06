import React from 'react';
import {
  YoutubeIcon,
  LinkedinIcon,
  TwitterXIcon,
  InstagramIcon,
  PinterestIcon,
  WhatsAppIcon,
} from './SocialIcons';

export function CommunitySection() {
  const socials = [
    {
      name: 'YouTube',
      handle: '@upgraderboy',
      url: 'https://youtube.com/@upgraderboy',
      icon: YoutubeIcon,
      color: 'text-red-500',
    },
    {
      name: 'LinkedIn',
      handle: '/in/upgraderboy',
      url: 'https://www.linkedin.com/in/upgraderboy/',
      icon: LinkedinIcon,
      color: 'text-blue-500',
    },
    {
      name: 'Twitter / X',
      handle: '@upgraderboy',
      url: 'https://x.com/upgraderboy',
      icon: TwitterXIcon,
      color: 'text-slate-900 dark:text-slate-200',
    },
    {
      name: 'Instagram',
      handle: '@upgraderboy',
      url: 'https://instagram.com/@upgraderboy',
      icon: InstagramIcon,
      color: 'text-pink-500',
    },
    {
      name: 'Pinterest',
      handle: '@upgraderboy',
      url: 'https://pinterest.com/upgraderboy',
      icon: PinterestIcon,
      color: 'text-red-600',
    },
    {
      name: 'WhatsApp',
      handle: '+91 91662 71496',
      url: 'https://wa.me/+919166271496',
      icon: WhatsAppIcon,
      color: 'text-green-500',
    },
  ];

  return (
    <section id="community" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Connect & Follow
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            Join the Upgrader Boy Community
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Follow @upgraderboy across all major platforms for epic coding tutorials, tech hacks, and developer memes.
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl text-center hover:border-[var(--accent-color)] hover:scale-105 hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-xl mx-auto flex items-center justify-center ${s.color} text-2xl mb-4 group-hover:animate-bounce`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mt-1">{s.handle}</span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
