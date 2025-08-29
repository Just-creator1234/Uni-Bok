"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPost, saveDraft } from "@/app/actions/createPost";
import { getAllCategories } from "@/app/actions/getCategories";
import { formatDistanceToNow } from "date-fns";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import PostPreviewModal from "@/components/PostPreviewModal";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { debounce } from "lodash";
import {
  Flame,
  FileText,
  Icon,
  ChevronDown,
  BookOpen,
  ThumbsUp,
  Share2,
  TrendingUp,
  MessageCircle,
  Clock,
  AlertCircle,
  Eye,
  Code2,
  Palette,
  Type,
  Layout,
  Zap,
  Tag,
  Star,
  Heart,
  Search,
  Bell,
  User,
  Menu,
  X,
  Play,
  Image as ImageIcon,
  Pause,
  Volume2,
} from "lucide-react";

/* --------------------------------------------------
   Tiny helpers
-------------------------------------------------- */
const useDebounce = (fn, delay) => {
  const timer = useRef();
  return (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
};

/* --------------------------------------------------
   Main component
-------------------------------------------------- */
export default function EnhancedCreatePostPage() {
  const router = useRouter();

  /* ---------- Content ---------- */
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  /* ---------- Media ---------- */
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [gallery, setGallery] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverProgress, setCoverProgress] = useState(0);

  /* ---------- Meta ---------- */
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState("DRAFT");
  const [publishDate, setPublishDate] = useState("");

  /* ---------- SEO & Social ---------- */
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [targetKeywords, setTargetKeywords] = useState([]);

  /* ---------- Advanced ---------- */
  const [difficulty, setDifficulty] = useState("beginner");
  const [language, setLanguage] = useState("en");
  const [series, setSeries] = useState("");
  const [seriesOrder, setSeriesOrder] = useState(1);
  const [visibility, setVisibility] = useState("public");
  const [password, setPassword] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [coAuthors, setCoAuthors] = useState([]);
  const [editorNotes, setEditorNotes] = useState("");
  const [customFields, setCustomFields] = useState({});

  /* ---------- UI ---------- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [showPreview, setShowPreview] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [draftId, setDraftId] = useState(null);
  const [breaking, setBreaking] = useState(false);

  const debouncedSetContent = useCallback(debounce(setContent, 300), []);

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (title.trim() || content.trim()) setIsDirty(true);
  }, [title, content]);

  /* ---------- Category ---------- */
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  /* ---------- Slug uniqueness ---------- */
  const checkSlug = useDebounce(async (s) => {
    if (!s) return;
    const res = await fetch(`/api/unique-slug?slug=${encodeURIComponent(s)}`);
    const { available } = await res.json();
    setValidationErrors((v) => ({
      ...v,
      slug: available ? undefined : "Slug already taken",
    }));
  }, 400);
  useEffect(() => {
    checkSlug(slug);
  }, [slug]);

  /* ---------- Keyboard shortcut ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, []);

  /* ---------- Media ---------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropAccepted: ([file]) => uploadCover(file),
  });

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
      setCoverImageUrl(data.url);
      setCoverImageFile(file);
      setValidationErrors((v) => ({ ...v, coverImage: undefined }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setCoverProgress(0);
    }
  };

  /* ---------- Tags ---------- */
  const handleTagAdd = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };
  const handleTagRemove = (t) => setTags(tags.filter((x) => x !== t));

  /* ---------- Validation ---------- */
  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!content.trim()) errs.content = "Content is required";
    if (!excerpt.trim()) errs.excerpt = "Excerpt is required";
    if (selectedCategories.length === 0)
      errs.categories = "Pick at least one category";
    if (status === "SCHEDULED" && !publishDate) errs.publishDate = "Set a date";
    if (selectedCategories.length === 0)
      errs.categories = "Pick at least one category";
    if (coverImageFile && coverImageFile.size > 5 * 1024 * 1024)
      errs.coverImage = "Image must be ≤ 5 MB";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---------- Submit / Draft ---------- */
  const handleSaveDraft = () => {
    if (!validate()) {
      const firstErrorName = Object.keys(validationErrors)[0];
      if (firstErrorName) {
        document
          .querySelector(`[name="${firstErrorName}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Fix errors before saving");
      return false;
    }

    setIsSubmitting(true);
    submitForm("DRAFT");
  };

  const handleSubmit = (action) => {
    if (!validate()) {
      toast.error("Fix errors before publishing");
      return false;
    }
    setIsSubmitting(true);
    submitForm(action);
  };

  const submitForm = async (status) => {
    const fd = new FormData();
    fd.append("status", status);
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("content", content);
    fd.append("excerpt", excerpt);
    fd.append("categories", JSON.stringify(selectedCategories));
    fd.append("tags", JSON.stringify(tags));
    fd.append("metaTitle", metaTitle);
    fd.append("metaDescription", metaDescription);
    fd.append("focusKeyword", focusKeyword);
    fd.append("ogTitle", ogTitle);
    fd.append("ogDescription", ogDescription);
    fd.append("ogImage", ogImage);
    fd.append("twitterCard", twitterCard);
    if (status === "PUBLISHED" || status === "SCHEDULED")
      fd.append("publishDate", new Date().toISOString());
    if (coverImageUrl) fd.append("coverImage", coverImageUrl);
    fd.append("breaking", String(breaking));

    /* Advanced payload */
    subtitle && fd.append("subtitle", subtitle);
    difficulty && fd.append("difficulty", difficulty);
    language && fd.append("language", language);
    canonicalUrl && fd.append("canonicalUrl", canonicalUrl);
    series && fd.append("series", series);
    seriesOrder && fd.append("seriesOrder", String(seriesOrder));
    fd.append("visibility", visibility);
    password && fd.append("password", password);
    fd.append("featured", String(featured));
    fd.append("sticky", String(sticky));
    fd.append("allowComments", String(allowComments));
    fd.append("allowSharing", String(allowSharing));
    fd.append("targetKeywords", JSON.stringify(targetKeywords));
    fd.append("coAuthors", JSON.stringify(coAuthors));
    editorNotes && fd.append("editorNotes", editorNotes);
    videoUrl && fd.append("videoUrl", videoUrl);
    audioUrl && fd.append("audioUrl", audioUrl);
    gallery.forEach((file, idx) => fd.append(`gallery_${idx}`, file));
    fd.append("customFields", JSON.stringify(customFields));

    try {
      const res = await createPost(fd);
      toast.success(res.message || "Post created!");
      router.push("/My-blogs");
    } catch {
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- UI helpers ---------- */
  const wordCount = useMemo(
    () =>
      content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length,
    [content]
  );
  const readingTime = useMemo(() => Math.ceil(wordCount / 200), [wordCount]);

  const tabs = [
    { id: "content", label: "Content", icon: BookOpen },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Layout },
    { id: "seo", label: "SEO", icon: TrendingUp },
  ];

  /* --------------------------------------------------
     Render with updated styles
  -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 -right-60 w-60 h-60 bg-gradient-to-bl from-amber-400/15 to-purple-400/15 rounded-full filter blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create New Post
                  </h1>
                  {lastSaved && (
                    <p className="text-xs text-gray-500">
                      Last saved{" "}
                      {formatDistanceToNow(lastSaved, { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleSubmit(status)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {status === "DRAFT" ? "Saving..." : "Publishing..."}
                    </>
                  ) : status === "DRAFT" ? (
                    "Save Draft"
                  ) : status === "SCHEDULED" ? (
                    "Schedule"
                  ) : (
                    "Publish Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main area */}
            <div className="lg:col-span-3">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-6">
                <nav className="flex space-x-6 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-4 pt-5 text-sm font-medium border-b-2 ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
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

              {/* Content Tab */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Post title..."
                      className={`w-full text-3xl font-bold p-4 rounded-xl border ${
                        validationErrors.title
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50`}
                    />
                    {validationErrors.title && (
                      <Error>{validationErrors.title}</Error>
                    )}
                  </div>

                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="url-slug"
                      className={`w-full p-4 rounded-xl border ${
                        validationErrors.slug
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50`}
                    />
                    {validationErrors.slug && (
                      <Error>{validationErrors.slug}</Error>
                    )}
                  </div>

                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <TiptapEditor
                      content={content}
                      onChange={debouncedSetContent}
                      placeholder="Start writing..."
                      className="min-h-[400px] bg-white/50 p-6"
                    />
                    {validationErrors.content && (
                      <Error className="px-6 pb-4">
                        {validationErrors.content}
                      </Error>
                    )}
                  </div>

                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Excerpt (max 300 chars)"
                      maxLength={300}
                      className={`w-full p-4 rounded-xl border ${
                        validationErrors.excerpt
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50`}
                      rows={4}
                    />
                    {validationErrors.excerpt && (
                      <Error>{validationErrors.excerpt}</Error>
                    )}
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
                      {coverImageUrl ? (
                        <Image
                          src={coverImageUrl}
                          alt={altText || "cover"}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto text-3xl text-gray-400" />
                          <p className="text-gray-500">
                            Drag or click to upload
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                        </div>
                      )}
                    </div>
                    {coverProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${coverProgress}%` }}
                        ></div>
                        {validationErrors.coverImage && (
                          <Error>{validationErrors.coverImage}</Error>
                        )}
                      </div>
                    )}

                    <input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Alt text for accessibility"
                      className="w-full p-4 mt-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                    />
                  </div>

               
              

                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <SelectNative
                      label="Status"
                      value={status}
                      onChange={setStatus}
                      options={["DRAFT", "PUBLISHED", "SCHEDULED"]}
                    />
                    {status === "SCHEDULED" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Publish Date
                        </label>
                        <input
                          type="datetime-local"
                          value={publishDate}
                          onChange={(e) => setPublishDate(e.target.value)}
                          className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                        />
                        {validationErrors.publishDate && (
                          <Error>{validationErrors.publishDate}</Error>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <Input
                      label="Meta Title"
                      value={metaTitle}
                      onChange={setMetaTitle}
                      max={60}
                    />
                  </div>
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <Textarea
                      label="Meta Description"
                      value={metaDescription}
                      onChange={setMetaDescription}
                      max={160}
                    />
                  </div>
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <Input
                      label="Focus Keyword"
                      value={focusKeyword}
                      onChange={setFocusKeyword}
                    />
                  </div>
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <Input
                      label="Canonical URL"
                      value={canonicalUrl}
                      onChange={setCanonicalUrl}
                    />
                  </div>
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                    <TagInput
                      value={targetKeywords}
                      onChange={setTargetKeywords}
                      placeholder="Add target keyword"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Post Stats
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-gray-500" />
                      Words
                    </span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Read time
                    </span>
                    <span className="font-medium">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      Status
                    </span>
                    <span className="font-medium capitalize bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Analyzer */}
              <SEOAnalyzer
                title={title}
                content={content}
                metaDescription={metaDescription}
                focusKeyword={focusKeyword}
              />

              {/* Categories */}
              <CategoryList
                categories={categories}
                selected={selectedCategories}
                onToggle={(id) =>
                  setSelectedCategories((prev) =>
                    prev.includes(id)
                      ? prev.filter((x) => x !== id)
                      : [...prev, id]
                  )
                }
                breaking={breaking}
                setBreaking={setBreaking}
                validationErrors={validationErrors}
              />

              {/* Tags */}
              <TagManager
                tags={tags}
                onAdd={handleTagAdd}
                onRemove={handleTagRemove}
                newTag={newTag}
                setNewTag={setNewTag}
              />
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <PostPreviewModal
          onClose={() => setShowPreview(false)}
          post={{
            title,
            subtitle,
            excerpt,
            content,
            coverImageUrl,
            altText,
            categories: categories.filter((c) =>
              selectedCategories.includes(c.id)
            ),
            tags: tags.map((t, i) => ({ id: String(i), name: t })),
          }}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------
   Re-usable UI bits with updated styles
-------------------------------------------------- */
const Input = ({
  label,
  value,
  onChange,
  max,
  type = "text",
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
      maxLength={max}
    />
  </div>
);

const Textarea = ({ label, value, onChange, max, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
      rows={3}
      maxLength={max}
    />
  </div>
);

const SelectNative = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const ImageUpload = ({ label, url, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onChange(URL.createObjectURL(file));
      }}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-semibold
        file:bg-gray-100 file:text-gray-700
        hover:file:bg-gray-200"
    />
    {url && (
      <div className="mt-3">
        <img
          src={url}
          alt=""
          className="h-32 rounded-xl object-cover border border-gray-200"
        />
      </div>
    )}
  </div>
);

const Error = ({ children, className = "" }) => (
  <p className={`text-sm text-red-600 mt-2 ${className}`}>{children}</p>
);

function CategoryList({
  categories,
  selected,
  onToggle,
  breaking,
  setBreaking,
  validationErrors,
}) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-600" />
        Categories
      </h3>

      <div className="space-y-2 text-sm mb-4">
        {categories.map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50/50 rounded-lg"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => onToggle(c.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-gray-700">{c.name}</span>
          </label>
        ))}
      </div>

      {validationErrors.categories && (
        <Error className="mt-2">{validationErrors.categories}</Error>
      )}
    </div>
  );
}

function TagManager({ tags, onAdd, onRemove, newTag, setNewTag }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <Tag className="h-5 w-5 text-blue-600" />
        Tags
      </h3>
      <div className="flex gap-2 mb-3">
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder="Add tag"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-1"
          >
            {t}
            <button
              onClick={() => onRemove(t)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function TagInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            onChange([...value, input.trim()]);
            setInput("");
          }
        }}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-200 rounded-xl mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
      />
      <div className="flex flex-wrap gap-2">
        {value.map((v, i) => (
          <span
            key={i}
            className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center"
          >
            {v}
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------
   SEO Analyzer with updated styles
-------------------------------------------------- */
function SEOAnalyzer({ title, content, metaDescription, focusKeyword }) {
  const [analysis, setAnalysis] = useState({
    titleScore: 0,
    contentScore: 0,
    keywordDensity: 0,
    readabilityScore: 0,
    suggestions: [],
  });

  useEffect(() => {
    const analyzeContent = () => {
      const suggestions = [];
      if (title.length < 30) suggestions.push("Title is too short");
      if (title.length > 60) suggestions.push("Title is too long");
      if (
        focusKeyword &&
        !title.toLowerCase().includes(focusKeyword.toLowerCase())
      )
        suggestions.push("Include focus keyword in title");

      const wordCount = content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length;
      if (wordCount < 300) suggestions.push("Content is too short for SEO");

      if (focusKeyword) {
        const keyword = focusKeyword.toLowerCase();
        const keywordCount = content.toLowerCase().split(keyword).length - 1;
        const density = (keywordCount / wordCount) * 100;
        if (density < 0.5) suggestions.push("Keyword density is too low");
        if (density > 3) suggestions.push("Keyword density is too high");
      }

      setAnalysis({
        titleScore: Math.min(100, Math.max(0, 100 - suggestions.length * 20)),
        contentScore: Math.min(100, Math.max(0, 100 - suggestions.length * 15)),
        keywordDensity: 2.1,
        readabilityScore: 85,
        suggestions,
      });
    };
    analyzeContent();
  }, [title, content, metaDescription, focusKeyword]);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        SEO Analysis
      </h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Type className="h-4 w-4 text-gray-500" />
            Title Score
          </span>
          <span
            className={
              analysis.titleScore > 70
                ? "text-emerald-600 font-medium"
                : "text-amber-600 font-medium"
            }
          >
            {analysis.titleScore}/100
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            Content Score
          </span>
          <span
            className={
              analysis.contentScore > 70
                ? "text-emerald-600 font-medium"
                : "text-amber-600 font-medium"
            }
          >
            {analysis.contentScore}/100
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            Readability
          </span>
          <span className="text-emerald-600 font-medium">
            {analysis.readabilityScore}/100
          </span>
        </div>
      </div>
      {analysis.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Suggestions:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1.5">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
