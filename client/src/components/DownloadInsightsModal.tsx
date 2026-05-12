import React, { useState } from "react";
import { ChevronDown, X, Download } from "lucide-react";
import { DatePickerWithRange } from "./date-range-picker";

interface DownloadInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: any;
}

const DownloadInsightsModal = ({
  isOpen,
  onClose,
  report,
}: DownloadInsightsModalProps) => {
  const [showFileTypes, setShowFileTypes] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const fileFormats = ["PDF", "Excel"];

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    setShowFileTypes(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">
            Downloading {report?.type || "Overall Insights"}
          </h1>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Choose a Range */}
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-900 block">
              Choose a Range
            </label>
            <DatePickerWithRange className="w-full" />
          </div>

          {/* Choose File Type */}
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-900 block">
              Choose File Type
            </label>
            <div className="relative">
              <button
                onClick={() => setShowFileTypes(!showFileTypes)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white focus:outline-none focus:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">
                  {selectedFormat === "Excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${showFileTypes ? "rotate-180" : ""}`}
                />
              </button>

              {showFileTypes && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 py-1">
                  {fileFormats.map((format) => (
                    <button
                      key={format}
                      onClick={() => handleFormatSelect(format)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 group"
                    >
                      <span className="text-gray-900">
                        {format === "Excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex justify-end">
          <button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-md flex items-center space-x-2 font-medium transition-colors">
            <span>Download Report</span>
            <Download className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadInsightsModal;
