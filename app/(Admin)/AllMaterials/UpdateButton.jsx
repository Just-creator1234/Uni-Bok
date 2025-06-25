

"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdateButton({ content }) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: content.title,
    description: content.description || "",
    type: content.type,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);

    if (form.file) {
      data.append("file", form.file);
      const extension = form.file.name.split(".").pop().toLowerCase();
      data.append("format", extension);
    }

    try {
      const res = await fetch(`/api/Updates/${content.id}`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("✅ Content updated successfully!");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update content.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-yellow-600 hover:underline"
      >
        Update
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6  w-[25rem] rounded-lg shadow-lg"
          >
            <div className="text-xl font-semibold  mb-4 text-center text-primary">
              Update Material
            </div>

            <div className="space-y-3">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Content Title"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="SLIDES">Slides</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="QUIZ">Quiz</option>
                <option value="PAST_QUESTION">Past Question</option>
              </select>

              {/* File Upload */}
              <div className="w-full">
                <label
                  htmlFor="file"
                  className="flex items-center justify-between w-full cursor-pointer border border-dashed border-gray-400 rounded p-3 hover:border-blue-500 transition-colors"
                >
                  <span className="text-gray-700">
                    {form.file ? form.file.name : "Choose a file..."}
                  </span>
                  <span className="text-blue-600 font-medium text-sm">
                    Browse
                  </span>
                </label>
                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
