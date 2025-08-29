// app/announcements/page.js
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getAnnouncementPosts } from "@/app/actions/getAnnouncements";
import {
  User,
  Clock,
  MessageCircle,
  Eye,
  Calendar,
  Megaphone,
} from "lucide-react";

export default async function AnnouncementsPage() {
  const posts = await getAnnouncementPosts();

  console.log(posts, "jjjjjjjjjjjjjjjjjjj")

  const getTimeAgo = (dateString) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Announcements Yet
            </h1>
            <p className="text-gray-600 mb-8">
              There are currently no announcements available. Check back later
              for updates.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-white rounded-lg shadow-2xl border-2 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <Navbar />
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Announcements
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Important updates and announcements from the department
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
            >
              <Link href={`/${post.slug}`}>
                <div className="p-6">
                  {/* Post Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {post.author?.name || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.author?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <time
                        className="text-sm text-gray-500"
                        dateTime={post.publishedAt}
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      <p className="text-xs text-gray-400">
                        {getTimeAgo(post.publishedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    {post.subtitle && (
                      <p className="text-gray-600 mb-4 font-medium">
                        {post.subtitle}
                      </p>
                    )}

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.viewCount || 0} views
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments?.length || 0} comments
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {post.categories?.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Megaphone className="h-3 w-3 mr-1" />
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
