import { MainLayout } from "@/components/layout/main-layout";
import { FileUploadSection } from "@/components/file-upload-section";

export default function FilesPage() {
  return (
    <MainLayout title="Files">
      <div className="flex flex-col min-h-screen bg-transparent">
        <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
          <div className="pb-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Files
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage your files (max 3 files, 20MB each)
            </p>
          </div>
          <FileUploadSection />
        </div>
      </div>
    </MainLayout>
  );
}
