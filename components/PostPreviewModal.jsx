// // components/PostPreviewModal.jsx
// "use client";

// export default function PostPreviewModal({ onClose, post }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="float-right text-2xl leading-none"
//         >
//           &times;
//         </button>

//         {post.coverImageUrl && (
//           <img
//             src={post.coverImageUrl}
//             alt={post.altText || ""}
//             className="w-full h-64 object-cover rounded mb-4"
//           />
//         )}

//         <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//         {post.subtitle && (
//           <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
//             {post.subtitle}
//           </p>
//         )}

//         <div className="mb-4 space-x-2">
//           {post.categories.map((c) => (
//             <span
//               key={c.id}
//               className="inline-block px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
//             >
//               {c.name}
//             </span>
//           ))}
//           {post.tags.map((t) => (
//             <span
//               key={t.id}
//               className="inline-block px-2 py-1 rounded text-xs bg-neutral-100 dark:bg-neutral-700"
//             >
//               {t.name}
//             </span>
//           ))}
//         </div>

//         <div
//           className="prose dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: post.content }}
//         />

//         <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
//           <p>Excerpt: {post.excerpt}</p>
//         </div>
//       </div>
//     </div>
//   );

// }

// components/PostPreviewModal.jsx

// "use client";

// export default function PostPreviewModal({ onClose, post }) {
//   /* Helper to safely render HTML */
//   const safeHtml = (html) => ({ __html: html || "" });

//   const {
//     title,
//     subtitle,
//     excerpt,
//     content,
//     coverImageUrl,
//     altText,
//     categories = [],
//     tags = [],
//     difficulty,
//     language,
//     series,
//     seriesOrder,
//     videoUrl,
//     audioUrl,
//     gallery = [],
//   } = post || {};

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-6 py-3 flex justify-between items-center z-10 border-b">
//           <h2 className="font-bold text-lg">Preview</h2>
//           <button
//             onClick={onClose}
//             className="text-2xl leading-none text-neutral-500 hover:text-neutral-800"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 md:p-8 space-y-6">
//           {/* Cover */}
//           {coverImageUrl && (
//             <img
//               src={coverImageUrl}
//               alt={altText || "Cover image"}
//               className="w-full h-64 md:h-96 object-cover rounded-lg"
//             />
//           )}

//           {/* Title + subtitle */}
//           <header>
//             <h1 className="text-3xl md:text-5xl font-extrabold leading-tight break-words whitespace-normal">
//               {title || "Untitled Post"}
//             </h1>
//             {subtitle && (
//               <p className="mt-2 text-xl text-neutral-600">{subtitle}</p>
//             )}
//           </header>

//           {/* Taxonomies */}
//           {(categories.length > 0 || tags.length > 0) && (
//             <div className="flex flex-wrap gap-2">
//               {categories.map((c) => (
//                 <span
//                   key={c.id}
//                   className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                 >
//                   {c.name}
//                 </span>
//               ))}
//               {tags.map((t) => (
//                 <span
//                   key={t.id}
//                   className="inline-block px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-800"
//                 >
//                   {t.name}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Optional meta */}
//           <div className="text-sm text-neutral-500">
//             {series && (
//               <p>
//                 Part {seriesOrder || 1} of{" "}
//                 <span className="font-medium">{series}</span>
//               </p>
//             )}
//             {difficulty && (
//               <p className="capitalize">Difficulty: {difficulty}</p>
//             )}
//             {language && <p>Language: {language}</p>}
//           </div>

//           {/* Main content */}
//           <article
//             className="prose max-w-none"
//             dangerouslySetInnerHTML={safeHtml(content)}
//           />

//           {/* Gallery */}
//           {gallery.length > 0 && (
//             <section>
//               <h3 className="text-lg font-semibold mb-2">Gallery</h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                 {gallery.map((file, idx) => (
//                   <img
//                     key={idx}
//                     src={URL.createObjectURL(file)}
//                     alt={`Gallery ${idx + 1}`}
//                     className="rounded object-cover aspect-square"
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Video */}
//           {videoUrl && (
//             <section>
//               <h3 className="text-lg font-semibold mb-2">Video</h3>
//               <div className="aspect-video">
//                 <iframe
//                   src={videoUrl}
//                   title="Post video"
//                   className="w-full h-full rounded-lg"
//                   allowFullScreen
//                 />
//               </div>
//             </section>
//           )}

//           {/* Audio */}
//           {audioUrl && (
//             <section>
//               <h3 className="text-lg font-semibold mb-2">Audio</h3>
//               <audio controls src={audioUrl} className="w-full rounded-lg" />
//             </section>
//           )}

//           {/* Excerpt */}
//           {excerpt && (
//             <footer className="pt-6 border-t">
//               <h4 className="font-semibold mb-1">Excerpt</h4>
//               <p className="text-neutral-600 italic">{excerpt}</p>
//             </footer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Flame,
  ChevronDown,
  BookOpen,
  Clock,
  Eye,
  Code2,
  Palette,
  Type,
  Layout,
  Zap,
  Star,
  Heart,
  X,
  Tag,
  FileText,
} from "lucide-react";

export default function PostPreviewModal({ onClose, post }) {
  /* Helper to safely render HTML */
  const safeHtml = (html) => ({ __html: html || "" });

  const {
    title,
    subtitle,
    excerpt,
    content,
    coverImageUrl,
    altText,
    categories = [],
    tags = [],
    difficulty,
    language,
    series,
    seriesOrder,
    videoUrl,
    audioUrl,
    gallery = [],
    breaking = false,
  } = post || {};

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg px-6 py-4 flex justify-between items-center z-10 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Post Preview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100/50 transition-colors text-gray-500 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Cover */}
          {coverImageUrl && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
              <img
                src={coverImageUrl}
                alt={altText || "Cover image"}
                className="w-full h-full object-cover"
              />
              {breaking && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Flame className="h-3 w-3" />
                    BREAKING NEWS
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Title + subtitle */}
          <header className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight break-words whitespace-normal bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title || "Untitled Post"}
            </h1>
            {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
          </header>

          {/* Taxonomies */}
          {(categories.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800"
                >
                  <BookOpen className="h-3 w-3" />
                  {c.name}
                </span>
              ))}
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag className="h-3 w-3" />
                  {t.name}
                </span>
              ))}
            </div>
          )}

          {/* Optional meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {series && (
              <div className="flex items-center gap-1 bg-blue-50/50 px-3 py-1.5 rounded-lg">
                <Code2 className="h-4 w-4 text-blue-600" />
                <span>
                  Part {seriesOrder || 1} of{" "}
                  <span className="font-medium">{series}</span>
                </span>
              </div>
            )}
            {difficulty && (
              <div className="flex items-center gap-1 bg-purple-50/50 px-3 py-1.5 rounded-lg capitalize">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Difficulty: {difficulty}</span>
              </div>
            )}
            {language && (
              <div className="flex items-center gap-1 bg-emerald-50/50 px-3 py-1.5 rounded-lg">
                <Type className="h-4 w-4 text-emerald-600" />
                <span>Language: {language}</span>
              </div>
            )}
          </div>

          {/* Main content */}
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={safeHtml(content)}
          />

          {/* Gallery */}
          {gallery.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video */}
          {videoUrl && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Video
              </h3>
              <div className="aspect-video bg-black/5 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={videoUrl}
                  title="Post video"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Audio */}
          {audioUrl && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-600" />
                Audio
              </h3>
              <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-md">
                <audio controls src={audioUrl} className="w-full" />
              </div>
            </section>
          )}

          {/* Excerpt */}
          {excerpt && (
            <footer className="pt-6 border-t border-gray-200/50 space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Excerpt
              </h4>
              <p className="text-gray-600 bg-blue-50/30 p-4 rounded-lg">
                {excerpt}
              </p>
            </footer>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg px-6 py-3 flex justify-end z-10 border-t border-white/20">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
