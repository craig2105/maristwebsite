import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';
import cyrisLogo from '@/assets/cyris-logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src={schoolLogo} alt="Marist Brothers Dete" className="w-10 h-10 shrink-0 object-contain" />
            <h3 className="font-display text-base sm:text-lg font-bold">Marist Brothers High School</h3>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Scientia et Virtus — Empowering young minds through knowledge and virtue since our founding. A proud member of the Marist Brothers educational tradition.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-2 md:mb-3">Quick Links</h4>
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            {['About', 'Academics', 'Admissions', 'News', 'Gallery', 'Contact'].map(l => (
              <Link key={l} to={`/${l.toLowerCase()}`} className="opacity-80 hover:opacity-100 py-2.5 md:py-1 transition-opacity">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-2 md:mb-3">Contact Info</h4>
          <div className="space-y-1 md:space-y-2 text-sm opacity-80">
            <div className="flex items-start gap-2 py-1.5 md:py-0"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Dete, Hwange District, Zimbabwe</div>
            <a href="tel:+263000000000" className="flex items-center gap-2 py-1.5 md:py-0 hover:opacity-100"><Phone className="w-4 h-4 shrink-0" /> +263 XX XXX XXXX</a>
            <a href="mailto:info@maristdete.ac.zw" className="flex items-center gap-2 py-1.5 md:py-0 break-all hover:opacity-100"><Mail className="w-4 h-4 shrink-0" /> info@maristdete.ac.zw</a>
          </div>
        </div>
      </div>

      {/* Cyris branding bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs opacity-60 text-center sm:text-left">
          <span>© {new Date().getFullYear()} Marist Brothers High School Dete. All rights reserved.</span>
          <div className="flex items-center gap-2 shrink-0">
            <span>Powered by</span>
            <img src={cyrisLogo} alt="Cyris" className="h-5 w-auto object-contain" />
            <span className="font-semibold">Cyris</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
