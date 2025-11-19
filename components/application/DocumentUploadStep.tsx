'use client';

import { useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface DocumentUploadStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url?: string;
}

export default function DocumentUploadStep({ onNext, onBack }: DocumentUploadStepProps) {
  const [files, setFiles] = useState<{ [key: string]: UploadedFile | null }>({
    resume: null,
    proposal: null,
  });

  const handleFileChange = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In production, upload to Cloudinary here
      setFiles(prev => ({
        ...prev,
        [type]: {
          name: file.name,
          type: file.type,
          size: file.size,
        }
      }));
    }
  };

  const removeFile = (type: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Documents
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your resume and project proposal (optional but recommended)
        </p>
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Resume / CV
        </label>
        {files.resume ? (
          <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {files.resume.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(files.resume.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile('resume')}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-10 w-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PDF, DOC, DOCX (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('resume', e)}
            />
          </label>
        )}
      </div>

      {/* Project Proposal Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Project Proposal <span className="text-gray-500">(Optional)</span>
        </label>
        {files.proposal ? (
          <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {files.proposal.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(files.proposal.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile('proposal')}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="h-10 w-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PDF, DOC, DOCX, PPT, PPTX (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => handleFileChange('proposal', e)}
            />
          </label>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Include your portfolio, GitHub projects, or any relevant work samples in your resume to strengthen your application.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg"
        >
          Review Application
        </button>
      </div>
    </div>
  );
}
