// "use client";

// import { useState } from "react";
// import DeleteButton from "./DeleteButton";
// import UpdateButton from "./UpdateButton";
// import Link from "next/link";

// export default function ContentTable({ grouped }) {
//   const [filterCourse, setFilterCourse] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");
//   const [filterSemester, setFilterSemester] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const query = searchTerm.toLowerCase();

//   const allCourses = new Set();
//   const allTypes = new Set();
//   const allLevels = new Set();
//   const allSemesters = new Set();

//   Object.entries(grouped).forEach(([level, semesters]) => {
//     allLevels.add(level);
//     Object.entries(semesters).forEach(([semester, contents]) => {
//       allSemesters.add(semester);
//       contents.forEach((c) => {
//         allCourses.add(c.course.code);
//         allTypes.add(c.type);
//       });
//     });
//   });

//   return (

//     <div>
//       {/* 🔹 Filter Controls */}
//       <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
//         {[
//           {
//             value: filterLevel,
//             setValue: setFilterLevel,
//             label: "All Levels",
//             options: allLevels,
//           },
//           {
//             value: filterSemester,
//             setValue: setFilterSemester,
//             label: "All Semesters",
//             options: allSemesters,
//           },
//           {
//             value: filterCourse,
//             setValue: setFilterCourse,
//             label: "All Courses",
//             options: allCourses,
//           },
//           {
//             value: filterType,
//             setValue: setFilterType,
//             label: "All Types",
//             options: allTypes,
//           },
//         ].map(({ value, setValue, label, options }, i) => (
//           <select
//             key={i}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             className="w-full md:w-auto px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">{label}</option>
//             {[...options].map((opt) => (
//               <option key={opt}>{opt}</option>
//             ))}
//           </select>
//         ))}
//       </div>

//       {/* 🔍 Search Bar */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by title, topic, or course..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* 📘 Grouped Table */}
//       {Object.entries(grouped).map(([level, semesters]) =>
//         Object.entries(semesters).map(([semester, contents]) => {
//           const filtered = contents.filter(
//             (c) =>
//               (!filterLevel || level === filterLevel) &&
//               (!filterSemester || semester === filterSemester) &&
//               (!filterCourse || c.course.code === filterCourse) &&
//               (!filterType || c.type === filterType) &&
//               (!searchTerm ||
//                 c.title.toLowerCase().includes(query) ||
//                 c.topicTitle.toLowerCase().includes(query) ||
//                 c.course.title.toLowerCase().includes(query))
//           );

//           if (!filtered.length) return null;

//           return (
//             <div key={`${level}-${semester}`} className="mb-10">
//               <h2 className="text-xl font-semibold text-blue-800 mb-2">
//                 {level} Level — {semester} Semester
//               </h2>

//               <div className="overflow-x-auto border rounded-lg shadow-sm">
//                 <table className="min-w-full text-sm text-left bg-white border border-gray-200">
//                   <thead className="bg-blue-50 text-blue-800">
//                     <tr>
//                       {["Title", "Type", "Course", "Topic", "Actions"].map(
//                         (h) => (
//                           <th
//                             key={h}
//                             className="px-4 py-3 border border-gray-200 font-medium whitespace-nowrap"
//                           >
//                             {h}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 border whitespace-nowrap">
//                           <Link
//                             href={`/materials/${item.id}`}
//                             className="text-gray-700 hover:underline"
//                           >
//                             {item.title}
//                           </Link>
//                         </td>
//                         <td className="px-4 py-3 border">{item.type}</td>
//                         <td className="px-4 py-3 border whitespace-nowrap">
//                           {item.course.code} — {item.course.title}
//                         </td>
//                         <td className="px-4 py-3 border">{item.topicTitle}</td>
//                         <td className="px-4 py-3 border">
//                           <div className="flex flex-wrap gap-2">
//                             <UpdateButton content={item} />
//                             <DeleteButton id={item.id} />
//                             <Link
//                               href={`/materials/${item.id}`}
//                               className="text-blue-600 hover:underline text-sm"
//                             >
//                               View
//                             </Link>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";
import Link from "next/link";

export default function ContentTable({ grouped }) {
  const [filterCourse, setFilterCourse] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const query = searchTerm.toLowerCase();

  const allCourses = new Set();
  const allTypes = new Set();
  const allLevels = new Set();
  const allSemesters = new Set();

  Object.entries(grouped).forEach(([level, semesters]) => {
    allLevels.add(level);
    Object.entries(semesters).forEach(([semester, contents]) => {
      allSemesters.add(semester);
      contents.forEach((c) => {
        allCourses.add(c.course.code);
        allTypes.add(c.type);
      });
    });
  });

  return (
    <div>
      {/* 🔹 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            value: filterLevel,
            setValue: setFilterLevel,
            label: "All Levels",
            options: allLevels,
          },
          {
            value: filterSemester,
            setValue: setFilterSemester,
            label: "All Semesters",
            options: allSemesters,
          },
          {
            value: filterCourse,
            setValue: setFilterCourse,
            label: "All Courses",
            options: allCourses,
          },
          {
            value: filterType,
            setValue: setFilterType,
            label: "All Types",
            options: allTypes,
          },
        ].map(({ value, setValue, label, options }, i) => (
          <select
            key={i}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{label}</option>
            {[...options].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        ))}
      </div>

      {/* 🔍 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, topic, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 📘 Table */}
      {Object.entries(grouped).map(([level, semesters]) =>
        Object.entries(semesters).map(([semester, contents]) => {
          const filtered = contents.filter(
            (c) =>
              (!filterLevel || level === filterLevel) &&
              (!filterSemester || semester === filterSemester) &&
              (!filterCourse || c.course.code === filterCourse) &&
              (!filterType || c.type === filterType) &&
              (!searchTerm ||
                c.title.toLowerCase().includes(query) ||
                c.topicTitle.toLowerCase().includes(query) ||
                c.course.title.toLowerCase().includes(query))
          );

          if (!filtered.length) return null;

          return (
            <div key={`${level}-${semester}`} className="mb-10">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {level} Level — {semester} Semester
              </h2>

              <div className="w-full overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-[700px] md:min-w-full text-sm text-left bg-white border border-gray-200">
                  <thead className="bg-blue-50 text-blue-800 whitespace-nowrap">
                    <tr>
                      {["Title", "Type", "Course", "Topic", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 border border-gray-200 font-medium"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border whitespace-nowrap">
                          <Link
                            href={`/materials/${item.id}`}
                            className="text-blue-700 hover:underline"
                          >
                            {item.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 border">{item.type}</td>
                        <td className="px-4 py-3 border whitespace-nowrap">
                          {item.course.code} — {item.course.title}
                        </td>
                        <td className="px-4 py-3 border">{item.topicTitle}</td>
                        <td className="px-4 py-3 border">
                          <div className="flex flex-wrap gap-2">
                            <UpdateButton content={item} />
                            <DeleteButton id={item.id} />
                            <Link
                              href={`/materials/${item.id}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      <div className="text-sm text-gray-400 italic mb-2 block md:hidden text-center">
        Btter viewon on Pc. Swipe left/right to see more columns →
      </div>
    </div>
  );
}
