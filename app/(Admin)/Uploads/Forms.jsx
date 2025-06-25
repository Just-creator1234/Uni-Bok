"use client";

import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm({ allCourses }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const [formData, setFormData] = useState({
    topicId: "",
    newTopic: "",
    topicDescription: "",
    type: "SLIDES",
    title: "",
    contentDescription: "",
    file: null,
  });

  useEffect(() => {
    if (level && semester) {
      const filtered = allCourses.filter(
        (course) =>
          course.level.toString() === level &&
          course.semester.toString() === semester
      );
      setFilteredCourses(filtered);
    }
  }, [level, semester, allCourses]);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);

    const res = await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({ courseId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.topics) setTopics(data.topics);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("courseId", selectedCourseId);
    data.append("type", formData.type);
    data.append("title", formData.title);
    data.append("contentDescription", formData.contentDescription);
    data.append("file", formData.file, formData.file.name);
    const extension = formData.file.name.split(".").pop().toLowerCase();
    data.append("format", extension);

    if (isCreatingTopic) {
      data.append("newTopic", formData.newTopic);
      data.append("topicDescription", formData.topicDescription);
    } else {
      data.append("topicId", formData.topicId);
    }

    try {
      const uploadPromise = fetch("/api/Uploads", {
        method: "POST",
        body: data,
      }).then(async (res) => {
        if (!res.ok)
          throw new Error((await res.json()).error || "Upload failed");
        return res.json();
      });

      toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "✅ Upload successful!",
        error: "❌ Upload failed. Please try again.",
      });

      await uploadPromise;
      window.location.reload();

      setFormData({
        topicId: "",
        newTopic: "",
        topicDescription: "",
        type: "SLIDES",
        title: "",
        contentDescription: "",
        file: null,
      });
      setSelectedCourseId("");
      setIsCreatingTopic(false);
      setTopics([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200 max-sm:px-2 "
    >
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 max-sm:text-center max-sm:text-lg max-md:text-center max-md:text-3xl">
        📤 Upload Course Material
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          required
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Level</option>
          <option value="100">100 Level</option>
          <option value="200">200 Level</option>
          <option value="300">300 Level</option>
          <option value="400">400 Level</option>
        </select>

        <select
          required
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Semester</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
        </select>

        {filteredCourses.length > 0 && (
          <select
            required
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course</option>
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedCourseId && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-gray-700">Topic</label>
            <button
              type="button"
              onClick={() => setIsCreatingTopic(!isCreatingTopic)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isCreatingTopic ? "Select Existing Topic" : "Create New Topic"}
            </button>
          </div>

          {isCreatingTopic ? (
            <>
              <input
                type="text"
                name="newTopic"
                placeholder="New Topic Title"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <textarea
                name="topicDescription"
                placeholder="Topic Description"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </>
          ) : (
            <select
              name="topicId"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md"
      >
        <option value="SLIDES">Slides</option>
        <option value="ASSIGNMENT">Assignment</option>
        <option value="QUIZ">Quiz</option>
        <option value="PAST_QUESTION">Past Question</option>
      </select>

      <input
        type="text"
        name="title"
        placeholder="Content Title"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-md  "
      />

      <textarea
        name="contentDescription"
        placeholder="Content Description"
        onChange={(e) =>
          setFormData({ ...formData, contentDescription: e.target.value })
        }
        required
        className="w-full p-3 border border-gray-300 rounded-md max-sm:min-h-48"
      />

      <div className="w-full">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-between gap-4 w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        >
          <span className="text-blue-700 font-medium">
            {formData.file?.name || "Choose a file to upload"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          name="file"
          onChange={handleChange}
          ref={fileInputRef}
          required
          className="hidden"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Upload
      </button>
    </form>
  );
}
