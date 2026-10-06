import React from 'react';
import { GraduationCap, Cpu, Users } from 'lucide-react';

export function AboutSection() {
  const values = [
    {
      icon: GraduationCap,
      title: 'Learn in Public',
      description:
        "We don't just write code behind closed doors. We share our developer journey, open-source projects, and tutorials with the world to grow together.",
    },
    {
      icon: Cpu,
      title: 'Technical Excellence',
      description:
        'Specialized mastery in MERN stack, Next.js 15, and robust cloud DevOps architecture ensuring high performance, security, and scalability.',
    },
    {
      icon: Users,
      title: 'Community Mentorship',
      description:
        'Empowering aspiring programmers across India and beyond with actionable insights, coding hacks, and open-source contributions.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-slate-100/70 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Who We Are
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            Architecting Dreams Into Reality
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Founded in April 2024 by a passionate team of college students in Jhunjhunu, Rajasthan, led by{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">Ankit Bhuria</strong>. Upgrader Boy bridges
            cutting-edge software engineering with transparent community mentorship.
          </p>
        </div>

        {/* 3 Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl hover:border-[var(--accent-color)] hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
