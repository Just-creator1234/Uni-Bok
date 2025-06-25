// // components/course/CourseHeader.jsx
// export default function CourseHeader({ course }) {
//   return (
//     <div className="border-b pb-4 mb-4">
//       <div className="text-3xl font-bold text-primary">
//         {course.code} - {course.title}
//       </div>
//       <p className="text-gray-600 mt-1">
//         Level: {course.level} &nbsp;&bull;&nbsp; Semester: {course.semester}
//       </p>
//     </div>
//   );
// }


// CourseHeader.jsx
export default function CourseHeader({ course }) {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
        {course.code} - {course.title}
      </div>
      <p className="text-sm sm:text-base text-gray-600 mt-1">
        Level: {course.level} &nbsp;&bull;&nbsp; Semester: {course.semester}
      </p>
    </div>
  );
}
