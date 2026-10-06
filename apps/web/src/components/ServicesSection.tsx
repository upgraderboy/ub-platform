import React from 'react';
import { Laptop, Smartphone, Cloud, Palette, Brain, TrendingUp } from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: Laptop,
      title: 'Full-Stack Web Dev',
      description:
        'High-performance web applications built with React, Next.js 15, Node.js, and MongoDB with lightning-fast SSR and responsive design.',
      tags: ['MERN', 'Next.js 15'],
    },
    {
      icon: Smartphone,
      title: 'Mobile App Dev',
      description:
        'Cross-platform and native Android/iOS mobile apps engineered for fluid user interactions and seamless API integration.',
      tags: ['React Native', 'Android Apps'],
    },
    {
      icon: Cloud,
      title: 'DevOps & Cloud Services',
      description:
        'Automated CI/CD pipelines, containerization, cloud server deployment, and secure scalable infrastructure.',
      tags: ['Docker', 'AWS / Cloud'],
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description:
        'Cyber-modern aesthetics, clean typography, wireframing, and user-centered interface crafting in Figma.',
      tags: ['Figma', 'Design Systems'],
    },
    {
      icon: Brain,
      title: 'AI & ML Models',
      description:
        'Integrating intelligent machine learning models, Gemini APIs, and automated data solutions to supercharge your business.',
      tags: ['Python', 'AI Agents'],
    },
    {
      icon: TrendingUp,
      title: 'SEO & Speed Optimization',
      description:
        'Boost your digital visibility, technical page speed (CWV 100/100), and organic search ranking across regional and global markets.',
      tags: ['Core Web Vitals', 'Ranking'],
    },
  ];

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Our Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            World-Class Software Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            From intuitive UI/UX design to robust cloud-backed full-stack applications, we deliver solutions tailored for startups and enterprises.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl hover:border-[var(--accent-color)] hover:shadow-xl transition-all group"
              >
                <div className="text-[var(--accent-color)] text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                  {s.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
