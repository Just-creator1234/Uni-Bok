"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Clock,
  MessageCircle,
  Eye,
  BookOpen,
  ImageOff,
} from "lucide-react";

// Server actions
import { getAllPublishedPosts, getMorePosts } from "@/app/actions/getPosts";
import Navbar from "@/components/Navbar";

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef();
  const loadMoreRef = useRef();

  /* ---------- Utility Functions ---------- */
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      politics: "bg-blue-600 text-white",
      tech: "bg-purple-600 text-white",
      sports: "bg-green-600 text-white",
      business: "bg-amber-600 text-white",
      world: "bg-gray-600 text-white",
    };
    return colors[categoryName] || "bg-gray-600 text-white";
  };

  /* ---------- Data Fetching ---------- */
  useEffect(() => {
    startTransition(async () => {
      try {
        const publishedPosts = await getAllPublishedPosts();
        const postsData = normalizePostData(publishedPosts) || [];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isFetchingMore) return;

    const observerOptions = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    }, observerOptions);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isFetchingMore, activeCategory]);

  const loadMorePosts = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const newPosts = await getMorePosts({
        page: page + 1,
        category: activeCategory === "all" ? null : activeCategory,
      });

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, activeCategory, isFetchingMore, hasMore]);

  // Helper functions
  const normalizePostData = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.success && Array.isArray(data.data)) return data.data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return null;
  };

  const hasCategory = (post, categorySlug) => {
    return post.categories?.some(
      (cat) =>
        cat.slug === categorySlug ||
        cat.name.toLowerCase() === categorySlug.toLowerCase()
    );
  };

  const getPostsByCategory = (categorySlug) => {
    return categorySlug === "all"
      ? posts
      : posts.filter((post) => hasCategory(post, categorySlug));
  };

  // Reset pagination when category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [activeCategory]);

  // Derived state
  const categoryPosts = getPostsByCategory(activeCategory);

  /* ---------- Render ---------- */
  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Loading skeletons */}
          <div className="h-12 w-full mb-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="sticky top-16 z-10 bg-white py-4 border-b border-gray-200 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {["all", "politics", "tech", "sports", "business", "world"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat === "all"
                    ? "All News"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categoryPosts.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              getCategoryColor={getCategoryColor}
              getTimeAgo={getTimeAgo}
            />
          ))}
        </div>

        {/* No articles message */}
        {categoryPosts.length === 0 && !isFetchingMore && (
          <div className="bg-white rounded-lg p-8 text-center border">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="h-10 w-full">
          {isFetchingMore && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Article Card Component
const ArticleCard = ({ article, getCategoryColor, getTimeAgo }) => (
  <Link href={`/${article.slug}`} className="group">
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-200">
      {/* Image Section */}
      {article.coverImage ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {article.categories?.[0] && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                article.categories[0].name
              )}`}
            >
              {article.categories[0].name.toUpperCase()}
            </span>
          )}
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center border border-dashed border-gray-300 bg-gray-100">
          <ImageOff className="w-10 h-10 text-gray-400" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getTimeAgo(article.createdAt)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author and Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {article.author?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {article.viewCount?.toLocaleString() || "0"}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              {article.commentCount?.toLocaleString() || "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);
