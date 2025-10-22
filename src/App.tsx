/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import EmailEditor, { type EditorRef } from 'react-email-editor';
import { Download, Eye, Save } from 'lucide-react';

interface ExportHtmlData {
  design: object;
  html: string;
}

export default function App() {
  const emailEditorRef = useRef<EditorRef>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const exportHtml = (): void => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    editor.exportHtml((data: ExportHtmlData) => {
      const { html } = data;

      // Generate timestamp like "2025-10-22_22-15-30"
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/T/, '_')
        .replace(/:/g, '-')
        .replace(/\..+/, '');

      // Create downloadable blob
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Set dynamic filename with date & time
      const link = document.createElement('a');
      link.href = url;
      link.download = `email-template_${timestamp}.html`;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      alert('HTML file exported successfully!');
    });
  };

  const saveDesign = (): void => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    editor.saveDesign((design: object) => {
      // Generate timestamp
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/T/, '_')
        .replace(/:/g, '-')
        .replace(/\..+/, '');

      // Create downloadable blob
      const blob = new Blob([JSON.stringify(design, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);

      // Set dynamic filename with date & time
      const link = document.createElement('a');
      link.href = url;
      link.download = `email-design_${timestamp}.json`;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      alert('Design saved successfully!');
    });
  };

  const togglePreview = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (isPreview) {
      unlayer?.hidePreview();
      setIsPreview(false);
    } else {
      unlayer?.showPreview({ device: 'desktop' });
      setIsPreview(true);
    }
  };

  const onReady = (e: any): void => {
    console.log('Console all event -->', e);
    console.log('Email editor is ready');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Email Template Editor
          </h1>
          <div className="flex gap-3">
            <button
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={saveDesign}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Design
            </button>
            <button
              onClick={exportHtml}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export HTML
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        <EmailEditor
          ref={emailEditorRef}
          onReady={(e) => onReady(e)}
          minHeight="100%"
        />
      </div>
    </div>
  );
}
