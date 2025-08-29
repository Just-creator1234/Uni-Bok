import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";
import {
  Calendar,
  ImageOff,
  Twitter,
  Linkedin,
  Mail,
  User,
  Tag,
  Clock,
  ArrowLeft,
  Edit3,
  Eye,
  Flame,
  BookOpen,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";

import PublishButton from "./PublishButton";

export const dynamic = "force-dynamic"; // always fetch latest

export default async function DraftPostPage({ params }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: true,
      tags: true,
      author: true,
    },
  });

  if (!post || post.status !== "DRAFT") {
    notFound();
  }

  const readingTime = Math.ceil(
    post.content.replace(/<[^>]*>/g, "").split(" ").length / 200
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/My-blogs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/Blogs/edit/${post.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white text-gray-700 rounded-xl transition-colors border-2 border-gray-200 hover:border-blue-300"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <PublishButton post={post} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 lg:py-12">
        {/* Enhanced Header Section */}
        <header className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          {/* Status and Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                DRAFT
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye size={14} />
                <span>Preview Mode</span>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Last updated{" "}
              {format(
                new Date(post.updatedAt || post.createdAt),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </div>
          </div>

          {/* Title and Excerpt */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight break-words">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-4xl">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Enhanced Meta Information */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <User size={14} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">
                {post.author?.name ?? "Unknown Author"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span>
                Created {format(new Date(post.createdAt), "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.categories.map((category, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-200 transition-colors"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.coverImage ? (
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
              <Image
                src={post.coverImage}
                alt={post.altText || post.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 rounded-2xl"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="flex items-center justify-center h-64 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <ImageOff className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No cover image</p>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 lg:p-12">
            <div
              className="prose prose-lg max-w-none break-words whitespace-normal
             prose-headings:text-gray-900 
             prose-p:text-gray-700 
             prose-a:text-blue-600 hover:prose-a:text-blue-800
             prose-strong:text-gray-900
             prose-blockquote:border-l-blue-500
             prose-blockquote:text-gray-600
             prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Tags Section */}
        {post.tags.length > 0 && (
          <div className="mb-8 p-6 sm:p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-800 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Draft Actions */}
        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-lg rounded-2xl border-2 border-blue-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to Publish?
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                This post is currently in draft mode and not visible to the
                public. You can continue editing or publish it to make it live.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Link
                href={`/Blogs/edit/${post.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl transition-all font-medium border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
              >
                <Edit3 size={16} />
                Continue Editing
              </Link>
              <PublishButton post={post} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
