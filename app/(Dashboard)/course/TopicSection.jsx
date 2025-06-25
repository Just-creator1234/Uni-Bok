import { FileText, FileQuestion, FileCheck2, Archive } from "lucide-react";
import Link from "next/link";

// const iconMap = {
//   SLIDES: <FileText className="w-5 h-5 text-blue-600" />,
//   ASSIGNMENT: <FileCheck2 className="w-5 h-5 text-green-600" />,
//   QUIZ: <FileQuestion className="w-5 h-5 text-yellow-500" />,
//   PAST_QUESTION: <Archive className="w-5 h-5 text-purple-500" />,
// };

const iconMap = {
  SLIDES: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
  ASSIGNMENT: <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
  QUIZ: <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />,
  PAST_QUESTION: <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />,
};

const order = ["SLIDES", "ASSIGNMENT", "QUIZ", "PAST_QUESTION"];

export default function TopicSection({ topic }) {
  const sortedContents = [...topic.contents].sort(
    (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
  );

  return (
    // <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow transition">
    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition text-sm sm:text-base">
      <summary className="font-semibold text-lg text-primary cursor-pointer list-none flex items-center justify-between">
        {topic.title}
        <span className="text-gray-500 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {topic.description && (
        <p className="text-sm text-gray-500 mt-2">{topic.description}</p>
      )}

      <ul className="mt-4 space-y-3">
        {sortedContents.map((content) => (
          <li
            key={content.id}
            className="bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl text-indigo-600 mt-1">
                {iconMap[content.type]}
              </div>
              <div className="flex-1">
                <h2 className="text-md font-semibold text-indigo-700">
                  {content.title}
                </h2>
                <p className="text-sm text-gray-600">{content.description}</p>
                {/* <div className="mt-2 flex gap-4 text-sm"> */}
                <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                  <Link
                    href={`/materials/${content.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={content.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
