import { useCallback, useState } from 'react';

export function useScrollReveal() {
  const [visible, setVisible] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
  }, []);

  return { ref, visible };
}
