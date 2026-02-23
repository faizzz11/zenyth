'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { MemeHistoryItem } from '../types';

interface MemeHistoryProps {
  userId: string;
}

export default function MemeHistory({ userId }: MemeHistoryProps) {
  const [historyItems, setHistoryItems] = useState<MemeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchHistory = useCallback(async (pageNum: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/meme-agent/api/history?userId=${userId}&page=${pageNum}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setHistoryItems((prev) => 
          pageNum === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.pagination.hasMore);
      } else {
        setError(data.error || 'Failed to load history');
      }
    } catch (err) {
      setError('Failed to load history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  // Initial load
  useEffect(() => {
    fetchHistory(1);
  }, [userId]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchHistory(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, fetchHistory]);

  if (historyItems.length === 0 && !isLoading && !error) {
    return (
      <div className="w-full text-center py-12 text-[rgba(55,50,47,0.60)]">
        No memes generated yet. Create your first meme above!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#37322F] font-serif">
        Your Meme History
      </h2>

      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {historyItems.map((item) => (
          <LazyMemeCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-[rgba(55,50,47,0.60)]">
              <div className="w-5 h-5 border-2 border-[rgba(55,50,47,0.20)] border-t-[rgba(55,50,47,0.60)] rounded-full animate-spin"></div>
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface LazyMemeCardProps {
  item: MemeHistoryItem;
}

function LazyMemeCard({ item }: LazyMemeCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full bg-white border border-[rgba(55,50,47,0.12)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {isVisible ? (
          <Image
            src={item.output.memeImage}
            alt={item.output.memeCaption}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[rgba(55,50,47,0.40)]">
            <div className="w-8 h-8 border-2 border-[rgba(55,50,47,0.20)] border-t-[rgba(55,50,47,0.40)] rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-medium text-[#37322F] line-clamp-2">
          {item.output.memeCaption}
        </p>
        <div className="flex items-center gap-2 text-xs text-[rgba(55,50,47,0.60)]">
          <span className="px-2 py-1 bg-gray-100 rounded">
            {item.style}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            {item.mode === 'ai-suggested' ? 'AI' : 'Custom'}
          </span>
        </div>
        <p className="text-xs text-[rgba(55,50,47,0.50)] mt-1">
          {new Date(item.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
