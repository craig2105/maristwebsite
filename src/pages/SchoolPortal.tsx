import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import schoolLogo from '@/assets/school-logo.png';
import scholasticLogo from '@/assets/scholastic-logo.png';
import { GraduationCap, Users, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const tiles = [
  {
    key: 'student',
    label: 'Student Portal',
    icon: GraduationCap,
    message:
      'Dear Student, you are about to be redirected to the Scholastic Services page where you can log in and access your academic information.',
  },
  {
    key: 'parent',
    label: 'Parent Portal',
    icon: Users,
    message:
      'Dear Parent, you are about to be redirected to the Scholastic Services page where you can log in and view your child\'s academic information.',
  },
  {
    key: 'staff',
    label: 'Staff Portal',
    icon: Briefcase,
    message:
      'Dear Staff Member, you are about to be redirected to the Scholastic Services page where you can log in and access relevant school data.',
  },
];

export default function SchoolPortal() {
  const [selected, setSelected] = useState<(typeof tiles)[number] | null>(null);

  const handleContinue = () => {
    window.open('https://scholasticservices.online/#/login', '_blank');
    setSelected(null);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
        {/* Branding header */}
        <div className="flex items-center gap-4 mb-10 animate-fade-in">
          <img src={schoolLogo} alt="Marist Brothers" className="h-16 w-16 object-contain" />
          <span className="text-2xl text-muted-foreground font-light select-none">×</span>
          <img src={scholasticLogo} alt="Scholastic Services" className="h-16 w-16 object-contain" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2 text-center">
          School Portal
        </h1>
        <p className="text-muted-foreground mb-12 text-center max-w-md">
          Select your portal to access Scholastic Services
        </p>

        {/* Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.key}
                onClick={() => setSelected(tile)}
                className="group flex flex-col items-center gap-4 p-8 rounded-xl border bg-card shadow-sm hover:shadow-lg hover:scale-[1.04] hover:border-primary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <span className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Redirect modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">{selected?.label}</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              {selected?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
