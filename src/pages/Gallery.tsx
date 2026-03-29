import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/shared/PageHeader';
import Spinner from '@/components/shared/Spinner';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function S({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return <div ref={ref} className={`${visible ? 'animate-reveal' : 'opacity-0'} ${className}`}>{children}</div>;
}

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = supabase.from('gallery').select('*').order('uploaded_at', { ascending: false });
    if (filter !== 'all') q.eq('category', filter);
    q.then(({ data, error }) => {
      if (error) console.error('Failed to load gallery:', error);
      setImages(data || []);
      setLoading(false);
    });
  }, [filter]);

  useEffect(() => {
    const channel = supabase.channel('gallery-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
        const q = supabase.from('gallery').select('*').order('uploaded_at', { ascending: false });
        if (filter !== 'all') q.eq('category', filter);
        q.then(({ data, error }) => {
          if (error) { console.error('Realtime gallery refetch failed:', error); return; }
          setImages(data || []);
        });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  const categories = ['all', 'general', 'sports', 'events', 'academics'];

  return (
    <Layout>
      <PageHeader title="Photo Gallery" subtitle="Capturing moments at Marist Brothers" bannerKey="gallery" />
      <section className="py-16">
        <div className="container">
          <S>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors active:scale-[0.97] ${filter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </S>
          {loading ? <Spinner /> : images.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No images in the gallery yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <S key={img.id}>
                  <div className="group relative overflow-hidden rounded-lg aspect-square bg-muted">
                    <img src={img.image_url} alt={img.caption || 'Gallery image'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-xs font-medium">{img.caption}</p>
                      </div>
                    )}
                  </div>
                </S>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
