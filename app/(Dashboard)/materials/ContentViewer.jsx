"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ContentViewer({ format, fileUrl }) {
  const [rendered, setRendered] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ext = format.toLowerCase();

      if (["xls", "xlsx", "csv"].includes(ext)) {
        try {
          const res = await fetch(fileUrl);
          const blob = await res.blob();
          const arrayBuffer = await blob.arrayBuffer();

          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          if (!data.length) {
            setRendered(<p className="text-gray-500">Empty spreadsheet.</p>);
            return;
          }

          setRendered(
            <div className="overflow-auto">
              <table className="table-auto w-full border border-gray-300 text-sm">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="bg-blue-50 text-blue-800 border px-3 py-2 font-semibold"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-3 py-2 text-gray-700">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } catch {
          setRendered(
            <p className="text-red-600">Error loading spreadsheet.</p>
          );
        }
      } else if (["doc", "docx", "ppt", "pptx", "pdf"].includes(ext)) {
        setRendered(
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                fileUrl
              )}&embedded=true`}
              className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded"
              title="Embedded Viewer"
            />
          </div>
        );
      } else {
        setRendered(
          <div className="text-center">
            <p className="text-red-600 mb-2">Unsupported file format.</p>
            <a
              href={fileUrl}
              download
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              Download File
            </a>
          </div>
        );
      }
    };

    load();
  }, [fileUrl, format]);

  return rendered || <p className="text-gray-500">Rendering file...</p>;
}
