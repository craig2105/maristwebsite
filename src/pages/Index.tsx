import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/shared/Spinner';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/shared/SearchBar';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import heroImg from '@/assets/hero-home.png';
import schoolLogo from '@/assets/school-logo.png';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { useSiteContent } from '@/hooks/useSiteContent';

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} className={`${visible ? 'animate-reveal' : 'opacity-0'} ${className}`}>
      {children}
    </section>
  );
}

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const motto = useSiteContent('homepage_motto', 'Scientia et Virtus — Knowledge and Virtue in the heart of Zimbabwe.');
  const intro = useSiteContent('homepage_intro', '');

  useEffect(() => {
    supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(3).then(({ data, error }) => {
      if (error) console.error('Failed to load posts:', error);
      setPosts(data || []);
      setLoadingPosts(false);
    });
    supabase.from('events').select('*').order('event_date', { ascending: true }).limit(4).then(({ data, error }) => {
      if (error) console.error('Failed to load events:', error);
      setEvents(data || []);
    });
    supabase.from('clubs').select('*').limit(4).then(({ data, error }) => {
      if (error) console.error('Failed to load clubs:', error);
      setClubs(data || []);
    });
    supabase.from('sports').select('*').limit(4).then(({ data, error }) => {
      if (error) console.error('Failed to load sports:', error);
      setSports(data || []);
    });

    const channel = supabase.channel('home-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(3).then(({ data }) => setPosts(data || []));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clubs' }, () => {
        supabase.from('clubs').select('*').limit(4).then(({ data }) => setClubs(data || []));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sports' }, () => {
        supabase.from('sports').select('*').limit(4).then(({ data }) => setSports(data || []));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <img src={heroImg} alt="School campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-school-dark/65" />
        <div className="relative container z-10 animate-reveal">
          <img src={schoolLogo} alt="Marist Brothers Dete" className="w-24 h-24 md:w-32 md:h-32 mb-4 drop-shadow-lg" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-3xl" style={{ lineHeight: 1.1 }}>
            Marist Brothers<br />High School Dete
          </h1>
          <p className="mt-4 text-lg text-white/85 max-w-xl">
            {motto}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admissions" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.97]">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/15 text-white font-medium text-sm backdrop-blur-sm hover:bg-white/25 transition-all active:scale-[0.97]">
              Learn More
            </Link>
          </div>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Intro */}
      {intro && (
        <Section className="py-8 bg-card border-b">
          <div className="container max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed">{intro}</p>
          </div>
        </Section>
      )}

      {/* Stats */}
      <Section className="py-12 bg-card border-b">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, label: 'Students', val: '850+' },
            { icon: Trophy, label: 'Sports Teams', val: '12' },
            { icon: Calendar, label: 'Years of Excellence', val: '40+' },
            { icon: Users, label: 'Clubs', val: '15+' },
          ].map((s, i) => (
            <div key={i} className={`animate-reveal-delay-${i + 1}`}>
              <s.icon className="w-6 h-6 mx-auto text-secondary mb-2" />
              <div className="text-2xl font-bold font-display text-foreground">{s.val}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Latest News */}
      <Section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Latest News</h2>
            <Link to="/news" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {loadingPosts ? <Spinner /> : posts.length === 0 ? (
            <p className="text-muted-foreground">No news articles yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article key={post.id} className={`group bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-reveal-delay-${i + 1}`}>
                  {post.image_url && <img src={post.image_url} alt={post.title} className="h-48 w-full object-cover" />}
                  <div className="p-5">
                    <span className="text-xs font-medium text-secondary uppercase tracking-wider">{post.category}</span>
                    <h3 className="font-display text-lg font-semibold mt-1 text-foreground">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Clubs & Sports */}
      <Section className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Life at Marist</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Clubs */}
            <div>
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Clubs
              </h3>
              {clubs.length === 0 ? <p className="text-muted-foreground text-sm">No clubs listed yet.</p> : (
                <div className="space-y-3">
                  {clubs.map(c => (
                    <Link to={`/clubs/${c.id}`} key={c.id} className="flex items-center gap-4 bg-card rounded-lg p-3 border hover:shadow-sm transition-shadow">
                      {c.image_url ? <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-md object-cover" /> : <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>}
                      <div>
                        <div className="font-semibold text-sm text-foreground">{c.name}</div>
                        {c.meeting_days && <div className="text-xs text-muted-foreground">{c.meeting_days}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/clubs" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline items-center gap-1">All clubs <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {/* Sports */}
            <div>
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" /> Sports
              </h3>
              {sports.length === 0 ? <p className="text-muted-foreground text-sm">No sports listed yet.</p> : (
                <div className="space-y-3">
                  {sports.map(s => (
                    <Link to={`/sports/${s.id}`} key={s.id} className="flex items-center gap-4 bg-card rounded-lg p-3 border hover:shadow-sm transition-shadow">
                      {s.image_url ? <img src={s.image_url} alt={s.name} className="w-14 h-14 rounded-md object-cover" /> : <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center"><Trophy className="w-6 h-6 text-primary" /></div>}
                      <div>
                        <div className="font-semibold text-sm text-foreground">{s.name}</div>
                        {s.season && <div className="text-xs text-muted-foreground">Season: {s.season}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/sports" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline items-center gap-1">All sports <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Upcoming Events */}
      <Section className="py-16 md:py-20">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events at this time.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {events.map((e, i) => (
                <div key={e.id} className={`bg-card border rounded-lg p-5 hover:shadow-sm transition-shadow animate-reveal-delay-${i + 1}`}>
                  <div className="text-xs font-bold text-secondary uppercase">{new Date(e.event_date).toLocaleDateString('en-ZW', { month: 'short', day: 'numeric' })}</div>
                  <h4 className="font-display font-semibold text-foreground mt-1">{e.title}</h4>
                  {e.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
}
