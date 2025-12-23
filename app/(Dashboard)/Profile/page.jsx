// // app/(Dashboard)/Profile/page.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import {
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   User,
//   Mail,
//   GraduationCap,
//   Hash,
// } from "lucide-react";
// import { signIn } from "next-auth/react";

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [student, setStudent] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [openCourseIds, setOpenCourseIds] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isLinking, setIsLinking] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     level: "",
//     semester: "",
//     indexNo: "", // ADDED
//   });

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/signin");
//     }
//   }, [status, router]);

//   // Fetch user profile and courses
//   useEffect(() => {
//     if (status === "authenticated") {
//       fetchProfileData();
//     }
//   }, [status]);

//   const fetchProfileData = async () => {
//     setIsLoading(true);
//     try {
//       // Fetch user profile
//       const profileRes = await fetch("/api/user/profile");
//       if (profileRes.ok) {
//         const profileData = await profileRes.json();
//         setStudent(profileData);
//         setForm({
//           name: profileData.name || "",
//           level: profileData.level || "",
//           semester: profileData.semester || "",
//           indexNo: profileData.indexNo || "", // ADDED
//         });
//       }

//       // Fetch courses
//       const coursesRes = await fetch("/api/user/courses");
//       if (coursesRes.ok) {
//         const coursesData = await coursesRes.json();
//         setCourses(coursesData);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLinkGoogle = async () => {
//     setIsLinking(true);
//     try {
//       await signIn("google", { callbackUrl: "/Profile" });
//     } catch (error) {
//       console.error("Google linking failed:", error);
//     } finally {
//       setIsLinking(false);
//     }
//   };

//   const handleSave = async () => {
//     setIsUpdating(true);
//     try {
//       const res = await fetch("/api/user/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name.trim(),
//           level: form.level,
//           semester: form.semester,
//           indexNo: form.indexNo.trim(),
//         }),
//       });

//       if (res.ok) {
//         const updatedUser = await res.json();
//         setStudent(updatedUser);
//         setIsEditing(false);
//         // Refresh courses after profile update
//         const coursesRes = await fetch("/api/user/courses");
//         if (coursesRes.ok) {
//           const coursesData = await coursesRes.json();
//           setCourses(coursesData);
//         }
//       } else {
//         const error = await res.json();
//         alert(error.error || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Profile update failed:", error);
//       alert("Failed to update profile");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       const res = await fetch("/api/user/delete", {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         alert("Account deleted successfully");
//         router.push("/");
//       } else {
//         const error = await res.json();
//         alert(error.error || "Failed to delete account");
//       }
//     } catch (error) {
//       console.error("Account deletion failed:", error);
//       alert("Failed to delete account");
//     }
//   };

//   const toggleCourse = (id) => {
//     setOpenCourseIds((prev) =>
//       prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
//     );
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   if (status === "loading" || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Failed to load profile</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* Profile Header Card */}
//         <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
//             <h1 className="text-3xl font-bold text-white">Student Profile</h1>
//           </div>

//           <div className="p-8">
//             {isEditing ? (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Index Number
//                   </label>
//                   <input
//                     name="indexNo"
//                     value={form.indexNo}
//                     onChange={handleChange}
//                     className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
//                     placeholder="Enter your index number"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Level
//                     </label>
//                     <select
//                       name="level"
//                       value={form.level}
//                       onChange={handleChange}
//                       className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
//                     >
//                       <option value="">Select Level</option>
//                       <option value="100">Level 100</option>
//                       <option value="200">Level 200</option>
//                       <option value="300">Level 300</option>
//                       <option value="400">Level 400</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Semester
//                     </label>
//                     <select
//                       name="semester"
//                       value={form.semester}
//                       onChange={handleChange}
//                       className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
//                     >
//                       <option value="">Select Semester</option>
//                       <option value="First">First Semester</option>
//                       <option value="Second">Second Semester</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-3 pt-2">
//                   <button
//                     onClick={handleSave}
//                     disabled={isUpdating}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md disabled:opacity-50"
//                   >
//                     {isUpdating ? "Saving..." : "Save Changes"}
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
//                 <div className="flex-1">
//                   <h2 className="text-4xl font-bold text-gray-800 mb-4">
//                     {student.name}
//                   </h2>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
//                     <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Hash className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Index Number</p>
//                         <p className="font-semibold text-gray-800">
//                           {student.indexNo || "Not set"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <GraduationCap className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Academic Level</p>
//                         <p className="font-semibold text-gray-800">
//                           {student.level && student.semester
//                             ? `Level ${student.level} - ${student.semester} Semester`
//                             : "Not set"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl sm:col-span-2">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Mail className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Email Address</p>
//                         <p className="font-semibold text-gray-800">
//                           {student.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-3 lg:min-w-fit">
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md"
//                   >
//                     Edit Profile
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     className="px-6 py-3 bg-white text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 font-semibold transition-colors"
//                   >
//                     Delete Account
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Google Account Linking Section */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Account Settings
//               </h3>
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                 <div className="flex items-center gap-3">
//                   <img src="/google.svg" alt="Google" className="w-8 h-8" />
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       Google Account
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Link for easier sign-in
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleLinkGoogle}
//                   disabled={isLinking}
//                   className="px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-colors disabled:opacity-50"
//                 >
//                   {isLinking ? "Linking..." : "Link Account"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Courses Section - Only show if courses exist */}
//         {courses.length > 0 && (
//           <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
//               <h2 className="text-3xl font-bold text-white flex items-center gap-3">
//                 <span>📚</span>
//                 Registered Courses
//               </h2>
//             </div>

//             <div className="p-8">
//               <div className="space-y-6">
//                 {courses.map((course) => {
//                   const isOpen = openCourseIds.includes(course.id);
//                   return (
//                     <div
//                       key={course.id}
//                       className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors"
//                     >
//                       <button
//                         onClick={() => toggleCourse(course.id)}
//                         className="w-full flex justify-between items-center p-6 text-left hover:bg-blue-50 transition-colors"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                             <span className="text-blue-600 text-xl font-bold">
//                               📖
//                             </span>
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-bold text-blue-700">
//                               {course.code}
//                             </h3>
//                             <p className="text-gray-800 font-semibold">
//                               {course.title}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               Level {course.level} • {course.semester} Semester
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-blue-600">
//                           {isOpen ? (
//                             <ChevronUp size={24} />
//                           ) : (
//                             <ChevronDown size={24} />
//                           )}
//                         </div>
//                       </button>

//                       {isOpen && course.topics && (
//                         <div className="border-t border-gray-100 bg-gray-50 p-6">
//                           <div className="space-y-6">
//                             {course.topics.map((topic) => (
//                               <div
//                                 key={topic.id}
//                                 className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
//                               >
//                                 <div className="flex items-center gap-3 mb-4">
//                                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                     <span className="text-blue-600 text-sm">
//                                       📂
//                                     </span>
//                                   </div>
//                                   <h4 className="text-lg font-bold text-blue-700">
//                                     {topic.title}
//                                   </h4>
//                                 </div>

//                                 {topic.description && (
//                                   <p className="text-gray-600 mb-4 leading-relaxed">
//                                     {topic.description}
//                                   </p>
//                                 )}

//                                 {topic.contents &&
//                                   topic.contents.length > 0 && (
//                                     <div className="space-y-3">
//                                       {topic.contents.map((content) => (
//                                         <div
//                                           key={content.id}
//                                           className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors"
//                                         >
//                                           <span className="text-gray-800 font-semibold">
//                                             {content.title}
//                                           </span>
//                                           <a
//                                             href={`/materials/${content.id}`}
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
//                                           >
//                                             View Material
//                                           </a>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Show message if no courses and profile incomplete */}
//         {courses.length === 0 && (
//           <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100 p-8 text-center">
//             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//               <GraduationCap className="h-12 w-12 text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Complete Your Profile
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Set your level and semester to see your registered courses.
//             </p>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md"
//             >
//               Complete Profile Now
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-100">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-red-600 text-2xl">⚠️</span>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Delete Account?
//               </h2>
//               <p className="text-gray-600 leading-relaxed">
//                 This action cannot be undone. All your data will be permanently
//                 removed from our servers.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
//               >
//                 Keep Account
//               </button>
//               <button
//                 onClick={handleDeleteAccount}
//                 className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
//               >
//                 Delete Forever
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/(Dashboard)/Profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  GraduationCap,
  Hash,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { signIn } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [openCourseIds, setOpenCourseIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // ADDED: For success prompt

  const [form, setForm] = useState({
    name: "",
    level: "",
    semester: "",
    indexNo: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch user profile and courses
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const profileRes = await fetch("/api/user/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setStudent(profileData);
        setForm({
          name: profileData.name || "",
          level: profileData.level || "",
          semester: profileData.semester || "",
          indexNo: profileData.indexNo || "",
        });
      }

      // Fetch courses
      const coursesRes = await fetch("/api/user/courses");
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    setIsLinking(true);
    try {
      await signIn("google", { callbackUrl: "/Profile" });
    } catch (error) {
      console.error("Google linking failed:", error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          level: form.level,
          semester: form.semester,
          indexNo: form.indexNo.trim(),
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setStudent(updatedUser);
        setIsEditing(false);

        // Show success message
        setShowSuccessMessage(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowSuccessMessage(false), 5000);

        // Refresh courses after profile update
        const coursesRes = await fetch("/api/user/courses");
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Account deleted successfully");
        router.push("/");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert("Failed to delete account");
    }
  };

  const toggleCourse = (id) => {
    setOpenCourseIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load profile</p>
      </div>
    );
  }

  // Check if profile is complete
  const hasCompleteProfile = student.level && student.semester;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* PROMPT 1: Incomplete Profile Banner */}
        {!hasCompleteProfile && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-700" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-800">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-blue-600">
                    Set your academic level and semester to see your registered
                    courses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
              >
                Complete Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* PROMPT 2: Success Message (Temporary) */}
        {showSuccessMessage && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">
                  Profile Updated Successfully!
                </h3>
                <p className="text-sm text-green-600">
                  Your courses have been refreshed based on your new level and
                  semester.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Student Profile</h1>
          </div>

          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Index Number
                  </label>
                  <input
                    name="indexNo"
                    value={form.indexNo}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Enter your index number"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
                    >
                      <option value="">Select Level</option>
                      <option value="100">Level 100</option>
                      <option value="200">Level 200</option>
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={form.semester}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-0 transition-colors"
                    >
                      <option value="">Select Semester</option>
                      <option value="First">First Semester</option>
                      <option value="Second">Second Semester</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {student.name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Hash className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Index Number</p>
                        <p className="font-semibold text-gray-800">
                          {student.indexNo || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Academic Level</p>
                        <p className="font-semibold text-gray-800">
                          {student.level && student.semester
                            ? `Level ${student.level} - ${student.semester} Semester`
                            : "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl sm:col-span-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-800">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-fit">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-white text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 font-semibold transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Google Account Linking Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Settings
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src="/google.svg" alt="Google" className="w-8 h-8" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Google Account
                    </p>
                    <p className="text-sm text-gray-600">
                      Link for easier sign-in
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLinkGoogle}
                  disabled={isLinking}
                  className="px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-colors disabled:opacity-50"
                >
                  {isLinking ? "Linking..." : "Link Account"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section - Only show if courses exist */}
        {courses.length > 0 ? (
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span>📚</span>
                  Registered Courses
                </h2>
                <div className="text-blue-100 text-sm font-medium">
                  {courses.length} course{courses.length !== 1 ? "s" : ""}
                </div>
              </div>
              {hasCompleteProfile && (
                <p className="text-blue-100 text-sm mt-2">
                  Showing courses for Level {student.level}, {student.semester}{" "}
                  Semester
                </p>
              )}
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {courses.map((course) => {
                  const isOpen = openCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors"
                    >
                      <button
                        onClick={() => toggleCourse(course.id)}
                        className="w-full flex justify-between items-center p-6 text-left hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-blue-700">
                              {course.code}
                            </h3>
                            <p className="text-gray-800 font-semibold">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Level {course.level} • {course.semester} Semester
                            </p>
                          </div>
                        </div>
                        <div className="text-blue-600">
                          {isOpen ? (
                            <ChevronUp size={24} />
                          ) : (
                            <ChevronDown size={24} />
                          )}
                        </div>
                      </button>

                      {isOpen && course.topics && (
                        <div className="border-t border-gray-100 bg-gray-50 p-6">
                          <div className="space-y-6">
                            {course.topics.map((topic) => (
                              <div
                                key={topic.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-sm">
                                      📂
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-bold text-blue-700">
                                    {topic.title}
                                  </h4>
                                </div>

                                {topic.description && (
                                  <p className="text-gray-600 mb-4 leading-relaxed">
                                    {topic.description}
                                  </p>
                                )}

                                {topic.contents &&
                                  topic.contents.length > 0 && (
                                    <div className="space-y-3">
                                      {topic.contents.map((content) => (
                                        <div
                                          key={content.id}
                                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors"
                                        >
                                          <span className="text-gray-800 font-semibold">
                                            {content.title}
                                          </span>
                                          <a
                                            href={`/materials/${content.id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                                          >
                                            View Material
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Empty state when no courses
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100 p-8 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            {hasCompleteProfile ? (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Courses Available
                </h3>
                <p className="text-gray-600 mb-4">
                  No courses are currently available for Level {student.level},{" "}
                  {student.semester} Semester.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check back later or contact your department.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Set your level and semester to see your registered courses.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-md"
                >
                  Complete Profile Now
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Account?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This action cannot be undone. All your data will be permanently
                removed from our servers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
