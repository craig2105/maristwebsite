import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src={schoolLogo} alt="Marist Brothers Dete" className="w-10 h-10" />
            <h3 className="font-display text-lg font-bold">Marist Brothers High School</h3>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Scientia et Virtus — Empowering young minds through knowledge and virtue since our founding. A proud member of the Marist Brothers educational tradition.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Quick Links</h4>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {['About', 'Academics', 'Admissions', 'News', 'Gallery', 'Contact'].map(l => (
              <Link key={l} to={`/${l.toLowerCase()}`} className="opacity-80 hover:opacity-100 py-1 transition-opacity">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Contact Info</h4>
          <div className="space-y-2 text-sm opacity-80">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> Dete, Hwange District, Zimbabwe</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> +263 XX XXX XXXX</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> info@maristdete.ac.zw</div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <div className="container py-4 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Marist Brothers High School Dete. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
