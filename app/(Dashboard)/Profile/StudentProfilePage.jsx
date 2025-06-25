"use client";

import { useState } from "react";
import { updateStudentProfile, deleteStudentAccount } from "@/action/editUser";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function StudentProfilePage({ student, courses }) {
  const [openCourseIds, setOpenCourseIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    name: student.name,
    level: student.level,
    semester: student.semester,
  });

  const toggleCourse = (id) => {
    setOpenCourseIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateStudentProfile({
        id: student.id,
        name: form.name.trim(),
        level: form.level,
        semester: form.semester,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    // <div className="min-h-screen bg-secondary py-10 px-4 sm:px-6 lg:px-8">

    //   <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
    //     <div className="w-full">
    //       {isEditing ? (
    //         <div className="space-y-2">
    //           <input
    //             name="name"
    //             value={form.name}
    //             onChange={handleChange}
    //             className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
    //           />
    //           <div className="flex gap-2">
    //             <select
    //               name="level"
    //               value={form.level}
    //               onChange={handleChange}
    //               className="border border-gray-300 px-3 py-2 rounded text-sm"
    //             >
    //               <option value="100">100</option>
    //               <option value="200">200</option>
    //               <option value="300">300</option>
    //               <option value="400">400</option>
    //             </select>
    //             <select
    //               name="semester"
    //               value={form.semester}
    //               onChange={handleChange}
    //               className="border border-gray-300 px-3 py-2 rounded text-sm"
    //             >
    //               <option value="First">First</option>
    //               <option value="Second">Second</option>
    //             </select>
    //           </div>
    //           <div className="flex gap-2">
    //             <button
    //               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
    //               onClick={handleSave}
    //             >
    //               Save
    //             </button>
    //             <button
    //               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
    //               onClick={() => setIsEditing(false)}
    //             >
    //               Cancel
    //             </button>
    //           </div>
    //         </div>
    //       ) : (
    //         <>
    //           <h2 className="text-3xl font-semibold text-gray-900">
    //             {student.name}
    //           </h2>
    //           <div className="mt-2 space-y-1 text-sm text-gray-600">
    //             <p>🎓 Index No: {student.indexNo}</p>
    //             <p>
    //               📚 {student.level} Level — {student.semester} Semester
    //             </p>
    //             <p className="text-gray-500">{student.email}</p>
    //           </div>
    //         </>
    //       )}
    //     </div>

    //     {!isEditing && (
    //       <div className="mt-4 sm:mt-0 flex flex-wrap sm:flex-nowrap sm:items-center gap-4 max-w-fit">
    //         <button
    //           onClick={() => setIsEditing(true)}
    //           className="text-sm font-medium text-blue-600 hover:underline whitespace-nowrap"
    //         >
    //           Edit Profile
    //         </button>
    //         <button
    //           className="text-sm font-medium text-red-500 hover:underline whitespace-nowrap"
    //           onClick={() => setShowDeleteConfirm(true)}
    //         >
    //           Delete Account
    //         </button>
    //       </div>
    //     )}
    //   </div>

    //   <h1 className="text-3xl font-bold text-center text-blue-800 py-6 border-b border-gray-200">
    //     📚 Registered Courses
    //   </h1>

    //   {/* 🔹 Courses Section */}
    //   <div className="max-w-4xl mx-auto space-y-4">
    //     {courses.length === 0 ? (
    //       <p className="text-center text-gray-500 mt-8">
    //         No courses available for your level and semester.
    //       </p>
    //     ) : (
    //       courses.map((course) => {
    //         const isOpen = openCourseIds.includes(course.id);
    //         return (
    //           <div
    //             key={course.id}
    //             className="bg-white rounded-2xl shadow border border-gray-200 mb-4 transition"
    //           >
    //             <button
    //               onClick={() => toggleCourse(course.id)}
    //               className="w-full flex justify-between items-center p-4 text-left rounded-2xl hover:bg-gray-50 transition"
    //             >
    //               <div>
    //                 <h3 className="text-lg font-bold text-indigo-700">
    //                   📘 {course.code} — {course.title}
    //                 </h3>
    //                 <p className="text-sm text-gray-500">
    //                   Level {course.level} — {course.semester} Semester
    //                 </p>
    //               </div>
    //               <span className="text-gray-500">
    //                 {isOpen ? (
    //                   <ChevronUp size={18} />
    //                 ) : (
    //                   <ChevronDown size={18} />
    //                 )}
    //               </span>
    //             </button>

    //             {isOpen && (
    //               <div className="p-4 pt-0 space-y-6">
    //                 {course.topics.map((topic) => (
    //                   <div
    //                     key={topic.id}
    //                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    //                   >
    //                     <h4 className="text-md font-semibold text-indigo-700 mb-2">
    //                       📂 {topic.title}
    //                     </h4>
    //                     {topic.description && (
    //                       <p className="text-sm text-gray-500 mb-3">
    //                         {topic.description}
    //                       </p>
    //                     )}
    //                     <ul className="space-y-2">
    //                       {topic.contents.map((content) => (
    //                         <li
    //                           key={content.id}
    //                           className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-md hover:bg-gray-100 transition text-sm"
    //                         >
    //                           <span className="text-gray-800 font-medium">
    //                             {content.title}
    //                           </span>
    //                           <a
    //                             href={`/materials/${content.id}`}
    //                             className="text-blue-600 hover:underline"
    //                           >
    //                             View
    //                           </a>
    //                         </li>
    //                       ))}
    //                     </ul>
    //                   </div>
    //                 ))}
    //               </div>
    //             )}
    //           </div>
    //         );
    //       })
    //     )}
    //   </div>

    //   {/* 🔴 Delete Account Confirmation Modal */}
    //   {showDeleteConfirm && (
    //     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-lg p-6 w-[25rem] shadow-lg">
    //         <h2 className="text-lg font-bold text-gray-800 mb-3">
    //           Confirm Account Deletion
    //         </h2>
    //         <p className="text-sm text-gray-600 mb-6">
    //           Are you sure you want to permanently delete your account? This
    //           action cannot be undone.
    //         </p>
    //         <div className="flex justify-end gap-3">
    //           <button
    //             onClick={() => setShowDeleteConfirm(false)}
    //             className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
    //           >
    //             Cancel
    //           </button>
    //           <form action={deleteStudentAccount}>
    //             <button
    //               type="submit"
    //               className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
    //             >
    //               Confirm Delete
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div className="min-h-screen bg-secondary px-4 py-6 sm:px-6 lg:px-8">
      {/* 🔸 Profile Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded text-sm"
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </select>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded text-sm"
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {student.name}
              </h2>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>🎓 Index No: {student.indexNo}</p>
                <p>
                  📚 {student.level} Level — {student.semester} Semester
                </p>
                <p className="text-gray-500">{student.email}</p>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Edit Profile
            </button>
            <button
              className="text-sm font-medium text-red-500 hover:underline"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Registered Courses Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 py-6 border-b border-gray-200">
        📚 Registered Courses
      </h1>

      {/* 🔹 Courses Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No courses available for your level and semester.
          </p>
        ) : (
          courses.map((course) => {
            const isOpen = openCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow border border-gray-200 transition"
              >
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full flex justify-between items-center p-4 text-left rounded-2xl hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-indigo-700">
                      📘 {course.code} — {course.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Level {course.level} — {course.semester} Semester
                    </p>
                  </div>
                  <span className="text-gray-500">
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 space-y-6">
                    {course.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                      >
                        <h4 className="text-md font-semibold text-indigo-700 mb-2">
                          📂 {topic.title}
                        </h4>
                        {topic.description && (
                          <p className="text-sm text-gray-500 mb-3 max-sm:text-center">
                            {topic.description}
                          </p>
                        )}
                        <ul className="space-y-2 ">
                          {topic.contents.map((content) => (
                            <li
                              key={content.id}
                              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-md hover:bg-gray-100 transition text-sm max-sm:flex-col gap-2"
                            >
                              <span className="text-gray-800 font-medium max-sm:text-center">
                                {content.title}
                              </span>
                              <a
                                href={`/materials/${content.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                View
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 🔴 Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6  w-[25rem] shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Account Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
              >
                Cancel
              </button>
              <form action={deleteStudentAccount} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="px-4 py-2 w-full sm:w-auto text-sm rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
