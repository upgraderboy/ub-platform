'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Get in Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            Let&apos;s Build Something Epic Together
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Have a project in mind or want to collaborate? Drop us a message or visit our agency office in Jhunjhunu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                Agency Headquarters
              </h3>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Location</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Near Toll Tax, Sikar Road, Jhunjhunu, Rajasthan, 333001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Phone / WhatsApp</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">+91 91662 71496</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Operating Hours</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Monday – Saturday: 08:00 – 20:00 IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Working Inquiry Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl space-y-6 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ankit Bhuria"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:border-[var(--accent-color)] focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ankit@upgraderboy.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:border-[var(--accent-color)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  Project Type / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Full-Stack MERN Application / Next.js Development"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:border-[var(--accent-color)] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project requirements, scope, or idea..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:border-[var(--accent-color)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[var(--accent-color)] text-slate-900 font-extrabold rounded-xl glow-btn transition-all text-sm shadow-md flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>

              {submitted && (
                <div className="flex items-center justify-center space-x-2 text-green-500 font-semibold text-sm font-mono pt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message sent successfully! Ankit & team will get back to you shortly.</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
