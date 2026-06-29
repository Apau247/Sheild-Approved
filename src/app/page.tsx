'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, ChevronRight, Menu, X, ChevronDown } from 'lucide-react';
import { testimonials, faqs } from '@/lib/data';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 py-6 px-8 flex justify-between items-center ${scrolled ? 'bg-[#020609]/95 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3">
        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="h-10 w-10 rounded-full" />
        <span className="font-bold uppercase tracking-widest text-xl text-white">
          Shield <span className="text-gold">Approved</span>
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-sm uppercase font-semibold text-slate-300">
        <a href="#services" className="hover:text-gold transition">Operations</a>
        <a href="#testimonials" className="hover:text-gold transition">Testimonials</a>
        <a href="#contact" className="hover:text-gold transition">Contact</a>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/login" className="px-6 py-2 rounded-full border border-gold text-gold text-sm font-bold hover:bg-gold hover:text-[#020609] transition">
          PORTAL ACCESS
        </Link>
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020609]/95 backdrop-blur-xl border-t border-white/5 p-6 flex flex-col gap-4 md:hidden">
          <a href="#services" className="text-slate-300 hover:text-gold" onClick={() => setMobileOpen(false)}>Operations</a>
          <a href="#testimonials" className="text-slate-300 hover:text-gold" onClick={() => setMobileOpen(false)}>Testimonials</a>
          <a href="#contact" className="text-slate-300 hover:text-gold" onClick={() => setMobileOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020609]/80 to-[#020609]" />
      <div className="container mx-auto px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-widest">
            MILITARY GRADE SECURITY
          </div>
          <h1 className="text-5xl lg:text-7xl leading-tight text-white">
            Fortified Protection For <span className="gold-gradient-text">Legacy Assets</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl">
            The world&apos;s most discreet vaulting system. We provide institutional-grade custody for gold, gems, and digital sovereignty.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/signup" className="btn-luxury px-10 py-4 rounded-full">INITIALIZE ONBOARDING</Link>
            <a href="#services" className="glass-card px-10 py-4 rounded-full text-white font-bold">VIEW OPERATIONS</a>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="glass-card p-2 rounded-3xl security-scan relative">
            <Image src="/hero-queen.jpg" alt="Vault Security" width={600} height={400} className="rounded-2xl w-full object-cover" />
          </div>
          <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl w-64 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">SYSTEM STATUS</span>
              <span className="text-[10px] text-emerald-500 font-bold">● ACTIVE</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-3/4" />
            </div>
            <p className="text-sm font-bold text-white">VAULT CAPACITY: 78%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const counters = [
    { label: 'Assets Secured', target: 2500 },
    { label: 'Private Vaults', target: 1200 },
    { label: 'Active Agents', target: 300 },
    { label: 'Countries Served', target: 42 },
    { label: 'Years Experience', target: 15 },
  ];
  const [counts, setCounts] = useState(counters.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        counters.forEach((c, i) => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          const duration = 2000;
          const steps = 60;
          const increment = c.target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= c.target) {
              current = c.target;
              clearInterval(timer);
            }
            setCounts(prev => {
              const next = [...prev];
              next[i] = Math.floor(current);
              return next;
            });
          }, duration / steps);
        });
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-[#050a0f]">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {counters.map((c, i) => (
            <div key={c.label} className="text-center space-y-2">
              <p className="text-4xl font-bold gold-gradient-text">{counts[i].toLocaleString()}</p>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-[#020609]">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-gold mb-4">Core Specializations</p>
          <h2 className="text-4xl font-semibold text-white">Elite <span className="text-gold">Custody Solutions</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Vaulting Facilities', img: 'https://picsum.photos/seed/vault-facility/400/300', desc: 'Grade 10 deep underground storage with biometric airlocks and institutional-grade climate control for precious assets.' },
            { title: 'Diamond & Jewellery', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&h=300&q=80', desc: 'Specialized handling and discreet storage for rare gemstones, fine jewelry, and luxury watch collections.' },
            { title: 'Precious Metals', img: 'https://picsum.photos/seed/gold-bullion/400/300', desc: 'Secure custody for gold, silver, and platinum bullion with fully insured transit and international accreditation.' },
          ].map((s, i) => (
            <div key={i} className="glass-card group overflow-hidden rounded-[2rem] border border-white/5">
              <div className="h-72 overflow-hidden relative">
                <Image src={s.img} alt={s.title} width={400} height={300} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020609]/90 via-[#020609]/20 to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{s.desc}</p>
                <Link href="/login" className="text-gold text-xs font-bold uppercase tracking-widest hover:text-white transition inline-flex items-center gap-2">
                  Explore Facility <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm italic mb-6">&ldquo;See what we can offer just for your needs&rdquo;</p>
          <Link href="/signup" className="px-8 py-3 rounded-full border border-gold/30 text-gold font-bold uppercase text-xs hover:bg-gold hover:text-[#020609] transition">
            More Services
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 border-t border-white/5 bg-[#020609]">
      <h2 className="text-3xl text-white text-center mb-16">Trusted by <span className="text-gold">Elite Clients</span></h2>
      <div className="marquee-wrapper">
        <div className="flex w-max gap-8" style={{ animation: 'marquee-scroll 40s linear infinite' }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl w-[400px] flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <Image src={t.image} alt={t.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-gold text-sm">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#050a0f]">
      <div className="container mx-auto px-8 max-w-4xl">
        <h2 className="text-3xl text-white text-center mb-12">Intelligence <span className="text-gold">Briefing</span></h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button
                className="w-full p-6 flex justify-between items-center text-left text-white font-bold"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={20} className={`transition-transform duration-300 text-gold ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-16">
        <div className="glass-card p-10 rounded-3xl space-y-8">
          <h3 className="text-2xl text-white">Secure Communication</h3>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); alert('Transmission sent. Our team will respond within 24 hours.'); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Designation" className="w-full bg-[#081018] border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition text-white" />
              <input type="email" placeholder="Encrypted Email" className="w-full bg-[#081018] border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition text-white" />
            </div>
            <textarea rows={4} placeholder="Transmission Details" className="w-full bg-[#081018] border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition text-white" />
            <button type="submit" className="btn-luxury w-full py-4 rounded-xl uppercase">Transmit Signal</button>
          </form>
        </div>
        <div className="space-y-8">
          <h3 className="text-2xl text-white">Global Command</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 glass-card p-6 rounded-2xl">
              <Shield className="text-gold mt-1" size={20} />
              <p className="text-slate-400 text-sm">45 Bankside Lane, London EC2V 7NQ, UK</p>
            </div>
            <div className="flex items-start gap-4 glass-card p-6 rounded-2xl border-l-4 border-red-500">
              <div className="text-red-500 font-bold text-sm">24/7</div>
              <p className="text-white text-lg font-bold">+44 20 7946 0958</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden h-64 grayscale contrast-125 brightness-50 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 border border-white/10">
            <iframe
              width="100%"
              height="100%"
              style={{ filter: 'invert(90%) hue-rotate(180deg) opacity(0.7)' }}
              src="https://maps.google.com/maps?q=45%20Bankside%20Lane%2C%20London%20EC2V%207NQ%2C%20UK&t=&z=14&ie=UTF8&iwloc=&output=embed"
              title="Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-full" />
          <span className="text-sm text-slate-400">© {new Date().getFullYear()} Shield Approved. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-xs text-slate-500 uppercase tracking-widest">
          <Link href="/login" className="hover:text-gold transition">Client Portal</Link>
          <Link href="/signup" className="hover:text-gold transition">Enrolment</Link>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
}
