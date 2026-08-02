import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/lib/site-settings";

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const logoSrc = settings?.logo_url || logo;
  const brandName = settings?.restaurant_name || "Crunzify";
  return (
    <footer className="bg-gradient-dark text-ivory mt-24">
      <div className="hairline" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-2xl text-ivory">{brandName}</span>
          </div>
          <p className="mt-4 text-sm text-ivory/60 leading-relaxed">
            Where great food meets great moments. Crafted with care since 2022.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-gold transition-colors">Menu</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/visit" className="hover:text-gold transition-colors">Visit Us</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-ivory/80">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 text-gold shrink-0" /> Add cafe address here</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-gold shrink-0" /> +00 000 000 0000</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 text-gold shrink-0" /> hello@crunzify.com</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full glass-dark flex items-center justify-center hover:text-gold transition-colors"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="h-10 w-10 rounded-full glass-dark flex items-center justify-center hover:text-gold transition-colors"><Facebook size={18} /></a>
            <a href="#" aria-label="TikTok" className="h-10 w-10 rounded-full glass-dark flex items-center justify-center hover:text-gold transition-colors text-sm font-bold">TT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row gap-2 justify-between text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} Crunzify Coffee. All rights reserved.</p>
          <p className="tracking-wider uppercase">Est. 2022 — Crafted with care</p>
        </div>
      </div>
    </footer>
  );
}