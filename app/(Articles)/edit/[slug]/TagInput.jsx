import { useState } from "react";
import { Tag, X } from "lucide-react";

export default function TagInput({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue) {
      // Delete last tag if input is empty
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <Tag className="w-4 h-4 mr-2" />
        Tags
      </label>
      <div className="flex flex-wrap gap-2 items-center px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded dark:bg-blue-800 dark:text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-gray-900 dark:text-white"
          placeholder="Type a tag and press Enter..."
        />
      </div>
    </div>
  );
}
