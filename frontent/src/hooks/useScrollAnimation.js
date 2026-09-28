import { useEffect, useState, useRef } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

export const useScrollAnimationMultiple = (threshold = 0.1) => {
  const [visibleElements, setVisibleElements] = useState({});
  const elementsRef = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.scrollId;
            setVisibleElements((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold }
    );

    Object.values(elementsRef.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      Object.values(elementsRef.current).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [threshold]);

  const setElementRef = (id) => (ref) => {
    if (ref) {
      ref.dataset.scrollId = id;
      elementsRef.current[id] = ref;
    }
  };

  return [setElementRef, visibleElements];
};