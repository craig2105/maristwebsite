import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/shared/PageHeader';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BookOpen, Heart, Award } from 'lucide-react';

function S({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return <div ref={ref} className={`${visible ? 'animate-reveal' : 'opacity-0'} ${className}`}>{children}</div>;
}

export default function About() {
  return (
    <Layout>
      <PageHeader title="About Our School" subtitle="A proud tradition of Marist education in Dete, Zimbabwe" bannerKey="about" />
      <section className="py-16">
        <div className="container max-w-4xl space-y-16">
          <S>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Marist Brothers High School Dete is a Catholic institution rooted in the Marist tradition of St. Marcellin Champagnat. We are dedicated to providing holistic education that nurtures the spiritual, academic, and social development of every student. Located in the scenic Dete area of Hwange District, our school has been a beacon of learning and character formation for decades.
            </p>
          </S>
          <S>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To educate and form young people in the Marist way — making Jesus Christ known and loved — through a quality education that emphasises academic excellence, moral integrity, and service to others.
            </p>
          </S>
          <S>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: 'Academic Excellence', desc: 'Rigorous curriculum preparing students for O-Level and A-Level examinations.' },
                { icon: Heart, title: 'Faith Formation', desc: 'Grounded in Catholic values and the Marist charism of simplicity and humility.' },
                { icon: Award, title: 'Character Building', desc: 'Developing responsible citizens through sports, clubs, and community service.' },
              ].map((v, i) => (
                <div key={i} className={`text-center p-6 rounded-lg bg-card border animate-reveal-delay-${i + 1}`}>
                  <v.icon className="w-8 h-8 mx-auto text-secondary mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </S>
        </div>
      </section>
    </Layout>
  );
}
