"use client";
import React, { useState } from "react";
import ViewTracker from "@/components/ViewTracker";
import CommentsSection from "@/components/comments/CommentsSection";
import Head from "next/head";
import { usePostLikes } from "@/hook/usePostLikes";
import {
  User,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  TrendingUp,
  BookOpen,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
} from "lucide-react";

const ArticlePageClient = ({ article, relatedArticles }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { likes, isLiked, toggleLike } = usePostLikes({
    slug: article.slug,
    initialLikes: article.likes || 0,
    initialLiked: article.initialLiked || false,
  });

  const CategoryTag = ({ type, children, isBreaking = false, size = "md" }) => {
    const sizeClasses = {
      sm: "px-2.5 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
    };

    return (
      <span
        className={`inline-block rounded-sm font-semibold uppercase tracking-wide ${
          isBreaking
            ? "bg-red-600 text-white"
            : "bg-[var(--color-primary)] text-white"
        } ${sizeClasses[size]}`}
      >
        {children}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = (platform) => {
    setShowShareMenu(false);
    // Share logic would go here
  };

  if (!article)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md text-center border shadow-sm">
          <div className="text-2xl font-bold text-gray-700 mb-4">
            Article not found
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Back to home
          </a>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        :root {
          --color-primary: #2563eb;
          --color-primary-light: #3b82f6;
          --color-primary-dark: #1e40af;
        }
      `}</style>
      <ViewTracker postId={article.id} />
      <Head>
        <title>{article.title}</title>
        <meta
          name="description"
          content={article.metaDescription || article.excerpt || ""}
        />
        <meta property="og:title" content={article.ogTitle || article.title} />
        <meta
          property="og:description"
          content={article.ogDescription || article.excerpt || ""}
        />
        <meta
          property="og:image"
          content={article.ogImage || article.coverImage || ""}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
        <meta
          name="twitter:card"
          content={article.twitterCard || "summary_large_image"}
        />
        <meta name="twitter:title" content={article.ogTitle || article.title} />
        <meta
          name="twitter:description"
          content={article.ogDescription || article.excerpt || ""}
        />
        <meta
          name="twitter:image"
          content={article.ogImage || article.coverImage || ""}
        />
      </Head>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <a
            href="/"
            className="hover:text-[var(--color-primary)] transition-colors"
          >
            Home
          </a>
          <span>/</span>

          <span className="text-gray-900 font-medium truncate">
            {article.title}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <article>
          {/* Article Header */}
          <header className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <CategoryTag
                type={article.category?.toLowerCase()}
                isBreaking={article.isBreaking}
              >
                {article.isBreaking ? "BREAKING" : article.category}
              </CategoryTag>
              {article.isBreaking && (
                <div className="flex items-center text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Breaking
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                    <User className="text-gray-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {article.author?.name || "Unknown Author"}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {article.readTime || "5 min read"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views?.toLocaleString() || "0"}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {article.commentCount?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.coverImage && (
            <div className="relative w-full overflow-hidden mb-6">
              <img
                src={article.coverImage}
                alt={article.altText || article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="mb-8">
            <div className="prose prose-lg max-w-none w-full">
              <div
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%",
                }}
                dangerouslySetInnerHTML={{
                  __html: article.content?.html || article.content,
                }}
              />
            </div>

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <a
                      key={tag.name}
                      href={`/tag/${tag.name}`}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-sm text-sm hover:bg-gray-200 transition-colors break-all"
                    >
                      #{tag.name.replace(/\s+/g, "")}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-sm transition-all ${
                  isLiked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isLiked
                      ? "fill-red-600 text-red-600"
                      : "fill-none text-gray-500"
                  }`}
                />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-sm transition-all ${
                  isBookmarked
                    ? "bg-[var(--color-primary-light)] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Bookmark
                  className={`h-5 w-5 ${
                    isBookmarked ? "fill-white text-white" : ""
                  }`}
                />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-sm shadow-lg border py-2 z-10 w-48">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600 h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 break-words">
                    {article.author?.name || "Unknown Author"}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed break-words">
                    {article.author?.bio || "No bio available"}
                  </p>
                  <div className="flex items-center space-x-3 flex-wrap gap-2">
                    <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                      Follow
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-100 transition-colors">
                      View Articles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CommentsSection postId={article.id} />

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.slice(0, 4).map((related) => (
                  <div
                    key={related.id}
                    className="border border-gray-200 rounded-sm overflow-hidden"
                  >
                    {related.coverImage && (
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">
                        <a
                          href={`/article/${related.slug}`}
                          className="hover:text-[var(--color-primary)]"
                        >
                          {related.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {formatDate(related.publishedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <a
                href="/"
                className="text-xl font-bold text-[var(--color-primary)]"
              >
                Unibok<span className="text-gray-700">.com</span>
              </a>
              <p className="text-gray-600 text-sm mt-2">
                Latest news from from your Department
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/about"
                className="text-gray-600 hover:text-[var(--color-primary)] text-sm"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-[var(--color-primary)] text-sm"
              >
                Contact
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-[var(--color-primary)] text-sm"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-[var(--color-primary)] text-sm"
              >
                Terms
              </a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs mt-6">
            © {new Date().getFullYear()} Pulse.com.gh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePageClient;
