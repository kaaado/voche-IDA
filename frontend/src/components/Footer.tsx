import { Link } from 'react-router-dom';
import { Mail, Linkedin, Globe } from 'lucide-react';
import idaLogo from '../assets/ida.webp';

export default function Footer() {
  return (
    <footer className="bg-transparent py-10 mt-12 relative overflow-hidden border-0">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-color/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-color/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 lg:px-8 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform duration-300 group w-fit cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-color/20 rounded-xl blur-md group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
                <img
                  src={idaLogo}
                  alt="Voche Logo"
                  className="w-10 h-10 relative z-10 object-contain rounded-xl shadow-md transition-transform group-hover:rotate-6 duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter uppercase italic leading-none text-foreground group-hover:text-primary-color transition-colors">
                  VOCHE
                </span>
                <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mt-0.5">
                  Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A comprehensive clinical trial match and health resource platform connecting patients, doctors, and organizations to advance medical research.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://voche.org"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-gradient-to-br hover:from-teal-600 hover:to-emerald-500 hover:text-white active:scale-95 hover:scale-105 transition-all duration-300 text-muted-foreground cursor-pointer"
                aria-label="Website"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-gradient-to-br hover:from-blue-600 hover:to-sky-500 hover:text-white active:scale-95 hover:scale-105 transition-all duration-300 text-muted-foreground cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:support@voche.com"
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-gradient-to-br hover:from-rose-600 hover:to-orange-500 hover:text-white active:scale-95 hover:scale-105 transition-all duration-300 text-muted-foreground cursor-pointer"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links (Split on Two Columns) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Platform</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trials" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Clinical Trials
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Patient Forums
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Health Resources
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-sm text-foreground/80 hover:text-primary-color dark:hover:text-primary-color hover:translate-x-2 hover:scale-105 active:scale-95 inline-block transition-all duration-300 cursor-pointer">
                  Voche Assistant
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 text-center border-0">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VOCHE Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
