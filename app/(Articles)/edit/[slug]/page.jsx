"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { updatePost, getPostBySlug } from "@/app/actions/editPost";
import { getAllCategories } from "@/app/actions/getCategories";
import { formatDistanceToNow } from "date-fns";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import PostPreviewModal from "@/components/PostPreviewModal";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";
import { Flame, Zap, ChevronDown } from "lucide-react";

import {
  FiEdit,
  FiEye,
  FiSave,
  FiSettings,
  FiCalendar,
  FiTag,
  FiFileText,
  FiClock,
  FiUser,
  FiGlobe,
  FiShare2,
  FiTrendingUp,
  FiImage,
} from "react-icons/fi";

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState({
    title: "",
    subtitle: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    altText: "",
    tags: [],
    categories: [],
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    canonicalUrl: "",
    targetKeywords: [],
    difficulty: "beginner",
    language: "en",
    series: "",
    seriesOrder: 1,
    visibility: "public",
    password: "",
    allowComments: true,
    allowSharing: true,
    featured: false,
    sticky: false,
    coAuthors: [],
    editorNotes: "",
    customFields: {},
    videoUrl: "",
    audioUrl: "",
    gallery: [],
    breaking: false,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropAccepted: ([file]) => uploadCover(file),
  });

  const [coverProgress, setCoverProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchPost = async () => {
      setLoading(true);
      const data = await getPostBySlug(slug);

      if (data) {
        setPost({
          title: data.title || "",
          subtitle: data.subtitle || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          coverImage: data.coverImage || "",
          altText: data.altText || "",
          tags: data.tags?.map((t) => t.name) || [],
          categories: data.categories?.map((c) => c.slug) || [],
          status: data.status || "DRAFT",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          focusKeyword: data.focusKeyword || "",
          ogTitle: data.ogTitle || "",
          ogDescription: data.ogDescription || "",
          ogImage: data.ogImage || "",
          twitterCard: data.twitterCard || "summary_large_image",
          canonicalUrl: data.canonicalUrl || "",
          targetKeywords: data.targetKeywords || [],
          difficulty: data.difficulty || "beginner",
          language: data.language || "en",
          series: data.series || "",
          seriesOrder: data.seriesOrder || 1,
          visibility: data.visibility || "public",
          password: data.password || "",
          allowComments: data.allowComments ?? true,
          allowSharing: data.allowSharing ?? true,
          featured: data.featured || false,
          sticky: data.sticky || false,
          coAuthors: data.coAuthors || [],
          editorNotes: data.editorNotes || "",
          customFields: data.customFields || {},
          videoUrl: data.videoUrl || "",
          audioUrl: data.audioUrl || "",
          gallery: data.gallery || [],
          breaking: data.breaking || false,
        });
      }
      setLoading(false);
    };

    fetchCategories();
    fetchPost();
  }, [slug]);

  const uploadCover = async (file) => {
    setCoverProgress(0);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const { data } = await axios.post("/api/img-uploads", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) =>
          setCoverProgress(Math.round((p.loaded / p.total) * 100)),
      });
      setPost((prev) => ({ ...prev, coverImage: data.url }));
      setValidationErrors((v) => ({ ...v, coverImage: undefined }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setCoverProgress(0);
    }
  };

  const removeImage = () => {
    setPost((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleTagAdd = () => {
    const trimmed = post.newTag?.trim();
    if (trimmed && !post.tags.includes(trimmed)) {
      setPost((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
        newTag: "",
      }));
    }
  };

  const handleTagRemove = (tag) => {
    setPost((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const validate = () => {
    const errs = {};
    if (!post.title.trim()) errs.title = "Title is required";
    if (!post.content.trim()) errs.content = "Content is required";
    if (!post.excerpt.trim()) errs.excerpt = "Excerpt is required";
    if (post.categories.length === 0)
      errs.categories = "Pick at least one category";
    if (post.status === "SCHEDULED" && !post.publishDate)
      errs.publishDate = "Set a date";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return toast.error("Fix errors before saving");
    setIsSubmitting(true);

    try {
      await updatePost(slug, post);
      toast.success("Post updated successfully!");
      setLastSaved(new Date());
      router.push("/My-blogs");
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = useMemo(
    () =>
      post.content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length,
    [post.content]
  );

  const readingTime = useMemo(() => Math.ceil(wordCount / 200), [wordCount]);

  const tabs = [
    { id: "content", label: "Content", icon: FiFileText },
    { id: "media", label: "Media", icon: FiImage },
    { id: "settings", label: "Settings", icon: FiSettings },
    { id: "seo", label: "SEO", icon: FiGlobe },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Post
            </h1>
            {lastSaved && (
              <p className="text-sm text-gray-500">
                Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 hover:scale-105 transition-all duration-300"
            >
              <FiEye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
        {/* Main area */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <nav className="flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-2 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            {activeTab === "content" && (
              <div className="space-y-6">
                <input
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="Post title..."
                  className={`w-full text-3xl font-bold p-4 rounded-xl border-2 ${
                    validationErrors.title
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-400"
                  } focus:ring-2 focus:ring-blue-200 bg-white/50`}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-600">
                    {validationErrors.title}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Unibok.com/</span>
                  <input
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                    placeholder="url-slug"
                    className={`flex-1 p-3 rounded-lg border-2 ${
                      validationErrors.slug
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-400"
                    } focus:ring-2 focus:ring-blue-200 bg-white/50`}
                  />
                </div>
                {validationErrors.slug && (
                  <p className="text-sm text-red-600">
                    {validationErrors.slug}
                  </p>
                )}

                <TiptapEditor
                  content={post.content}
                  onChange={(html) => setPost({ ...post, content: html })}
                  placeholder="Start writing..."
                  className="min-h-[400px] bg-white/50 rounded-xl border-2 border-gray-200"
                />
                {validationErrors.content && (
                  <p className="text-sm text-red-600">
                    {validationErrors.content}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Excerpt (max 300 chars)
                  </label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) =>
                      setPost({ ...post, excerpt: e.target.value })
                    }
                    maxLength={300}
                    className={`w-full p-3 rounded-lg border-2 ${
                      validationErrors.excerpt
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-400"
                    } focus:ring-2 focus:ring-blue-200 bg-white/50`}
                    rows={4}
                  />
                  {validationErrors.excerpt && (
                    <p className="text-sm text-red-600">
                      {validationErrors.excerpt}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cover image
                </h2>
                <div
                  {...getRootProps()}
                  className={`h-64 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300"
                  } relative overflow-hidden`}
                >
                  <input {...getInputProps()} />
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.altText || "cover"}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FiImage className="mx-auto text-3xl text-gray-400" />
                      <p className="text-gray-500">Drag or click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                    </div>
                  )}
                </div>
                {coverProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${coverProgress}%` }}
                    ></div>
                  </div>
                )}
                {validationErrors.coverImage && (
                  <p className="text-sm text-red-600">
                    {validationErrors.coverImage}
                  </p>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={post.status}
                      onChange={(e) =>
                        setPost({ ...post, status: e.target.value })
                      }
                      className="w-full p-3 pr-8 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50 appearance-none"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="SCHEDULED">Scheduled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                {post.status === "SCHEDULED" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={post.publishDate}
                      onChange={(e) =>
                        setPost({ ...post, publishDate: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Meta Title
                  </label>
                  <input
                    value={post.metaTitle}
                    onChange={(e) =>
                      setPost({ ...post, metaTitle: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    maxLength={60}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    value={post.metaDescription}
                    onChange={(e) =>
                      setPost({ ...post, metaDescription: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    rows={3}
                    maxLength={160}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Focus Keyword
                  </label>
                  <input
                    value={post.focusKeyword}
                    onChange={(e) =>
                      setPost({ ...post, focusKeyword: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Canonical URL
                  </label>
                  <input
                    value={post.canonicalUrl}
                    onChange={(e) =>
                      setPost({ ...post, canonicalUrl: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Target Keywords
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={post.newTag}
                      onChange={(e) =>
                        setPost({ ...post, newTag: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
                      placeholder="Add keyword"
                      className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    />
                    <button
                      onClick={handleTagAdd}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-md hover:scale-105 transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.targetKeywords.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full flex items-center gap-1 border border-blue-100"
                      >
                        {t}
                        <button
                          onClick={() => handleTagRemove(t)}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-blue-600" />
              Post Stats
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words</span>
                <span className="font-medium">{wordCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Read time</span>
                <span className="font-medium">{readingTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full text-blue-800">
                  {post.status.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* SEO Analyzer */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-emerald-600" />
              SEO Analysis
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Title Score</span>
                <span className="font-medium text-emerald-600">85/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Content Score</span>
                <span className="font-medium text-emerald-600">78/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Readability</span>
                <span className="font-medium text-emerald-600">92/100</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FiTag className="w-5 h-5 text-purple-600" />
              Categories
            </h3>
            <div className="space-y-2 text-sm mb-4">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50/50 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={post.categories.includes(c.slug)}
                    onChange={() =>
                      setPost((prev) => ({
                        ...prev,
                        categories: prev.categories.includes(c.slug)
                          ? prev.categories.filter((slug) => slug !== c.slug)
                          : [...prev.categories, c.slug],
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {c.name}
                </label>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200/50">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-red-50/50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={post.breaking}
                  onChange={(e) =>
                    setPost({ ...post, breaking: e.target.checked })
                  }
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FiTag className="w-5 h-5 text-amber-600" />
              Tags
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                value={post.newTag}
                onChange={(e) => setPost({ ...post, newTag: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
                placeholder="Add tag"
                className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white/50"
              />
              <button
                onClick={handleTagAdd}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1.5 rounded-full flex items-center gap-1 border border-amber-200"
                >
                  {t}
                  <button
                    onClick={() => handleTagRemove(t)}
                    className="text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <PostPreviewModal
          onClose={() => setShowPreview(false)}
          post={{
            title: post.title,
            subtitle: post.subtitle,
            excerpt: post.excerpt,
            content: post.content,
            coverImageUrl: post.coverImage,
            altText: post.altText,
            categories: categories.filter((c) =>
              post.categories.includes(c.slug)
            ),
            tags: post.tags.map((t, i) => ({ id: String(i), name: t })),
            breaking: post.breaking,
          }}
        />
      )}
    </div>
  );
}
