import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Lightbulb, ArrowLeft, Tag } from 'lucide-react';
import Spinner from '@/components/shared/Spinner';

function S({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return <div ref={ref} className={`${visible ? 'animate-reveal' : 'opacity-0'} ${className}`}>{children}</div>;
}

export default function InnovationDetail() {
  const { id } = useParams<{ id: string }>();
  const [innovation, setInnovation] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('innovations').select('*').eq('id', id).maybeSingle(),
      supabase.from('innovation_images').select('*').eq('innovation_id', id).order('sort_order'),
    ]).then(([{ data: inn }, { data: imgs }]) => {
      setInnovation(inn);
      setImages(imgs || []);
      setLoading(false);
    });

    const channel = supabase.channel(`innovation-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'innovations', filter: `id=eq.${id}` }, () => {
        supabase.from('innovations').select('*').eq('id', id).maybeSingle().then(({ data }) => setInnovation(data));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'innovation_images' }, () => {
        supabase.from('innovation_images').select('*').eq('innovation_id', id).order('sort_order').then(({ data }) => setImages(data || []));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) return <Layout><Spinner /></Layout>;
  if (!innovation) return (
    <Layout>
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">Innovation not found.</p>
        <Link to="/innovation-hub" className="text-primary hover:underline text-sm">← Back to Innovation Hub</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Hero banner */}
      <section className="relative h-64 md:h-80 flex items-end overflow-hidden">
        {innovation.image_url ? (
          <img src={innovation.image_url} alt={innovation.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-innovation-start via-innovation-mid to-innovation-end" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container pb-8 z-10">
          <Link to="/innovation-hub" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Innovations
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">{innovation.name}</h1>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-4xl space-y-10">
          {/* Info cards */}
          <S>
            <div className="grid sm:grid-cols-2 gap-4">
              {innovation.category && (
                <div className="bg-card border rounded-lg p-5 flex items-start gap-3">
                  <Tag className="w-5 h-5 text-innovation-mid mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</div>
                    <div className="text-sm font-semibold text-foreground mt-1">{innovation.category}</div>
                  </div>
                </div>
              )}
              <div className="bg-card border rounded-lg p-5 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-innovation-accent mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</div>
                  <div className="text-sm font-semibold text-foreground mt-1">Student Innovation</div>
                </div>
              </div>
            </div>
          </S>

          {/* Description */}
          {innovation.description && (
            <S>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{innovation.description}</p>
            </S>
          )}

          {/* Image Gallery */}
          {images.length > 0 && (
            <S>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Gallery</h2>
              <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(img.image_url)}
                    className={`overflow-hidden rounded-lg border hover:shadow-md transition-shadow ${
                      images.length === 3 && i === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <img src={img.image_url} alt={`Gallery ${i + 1}`} className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300" />
                  </button>
                ))}
              </div>
            </S>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </Layout>
  );
}
