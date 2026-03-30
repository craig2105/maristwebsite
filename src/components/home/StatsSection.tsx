import { Calendar, Users, Trophy, GraduationCap } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { icon: Users, label: 'Students', val: '850+' },
  { icon: GraduationCap, label: 'ZIMSEC Pass Rate', val: '95%' },
  { icon: Trophy, label: 'Sports Teams', val: '12' },
  { icon: Calendar, label: 'Years of Excellence', val: '40+' },
];

export default function StatsSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} className={`py-16 bg-primary text-primary-foreground ${visible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} className={`animate-reveal-delay-${i + 1}`}>
            <s.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <div className="text-3xl md:text-4xl font-bold font-display">{s.val}</div>
            <div className="text-sm opacity-75 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
