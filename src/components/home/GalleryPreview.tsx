import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function GalleryPreview() {
  const [images, setImages] = useState<any[]>([]);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    supabase.from('gallery').select('*').order('uploaded_at', { ascending: false }).limit(6)
      .then(({ data }) => setImages(data || []));
  }, []);

  if (images.length === 0) return null;

  return (
    <section ref={ref} className={`py-20 md:py-28 ${visible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">Campus Life</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Photo Gallery</h2>
          </div>
          <Link to="/gallery" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => (
            <Link
              to="/gallery"
              key={img.id}
              className={`group relative overflow-hidden rounded-xl aspect-[4/3] ${i === 0 ? 'md:row-span-2 md:aspect-auto' : ''}`}
            >
              <img
                src={img.image_url}
                alt={img.caption || 'School photo'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {img.caption}
                </div>
              )}
            </Link>
          ))}
        </div>

        <Link to="/gallery" className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          View Full Gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
