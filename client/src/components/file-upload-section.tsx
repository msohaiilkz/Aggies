import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, FileText, X, Download, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const STORAGE_KEY = "dashboard_uploads";
const MAX_FILES = 3;
const MAX_SIZE = 20 * 1024 * 1024;

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

function loadFiles(): UploadedFile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFiles(files: UploadedFile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch {
    // quota exceeded — in-memory only
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function FileUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>(() => loadFiles());
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Rights model: Negative DB data upload is allowed only for the Super Admin
  // (SUPER_EXECUTIVE) and the Executive (BUSINESS_HEAD) — not analysts.
  const canUpload =
    user?.role === "SUPER_EXECUTIVE" || user?.role === "BUSINESS_HEAD";

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) return;
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    if (selected.length === 0) return;

    if (files.length + selected.length > MAX_FILES) {
      toast({
        title: "Upload limit reached",
        description: `Max ${MAX_FILES} files (${files.length}/${MAX_FILES} used).`,
        variant: "destructive",
      });
      return;
    }

    const oversized = selected.find((f) => f.size > MAX_SIZE);
    if (oversized) {
      toast({
        title: "File too large",
        description: `"${oversized.name}" exceeds 20MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const newFiles: UploadedFile[] = [];
      for (const f of selected) {
        const dataUrl = await readAsDataUrl(f);
        newFiles.push({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`,
          name: f.name,
          size: f.size,
          type: f.type || "application/octet-stream",
          dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      const next = [...newFiles, ...files];
      setFiles(next);
      saveFiles(next);
      toast({ title: `Uploaded ${newFiles.length} file(s)` });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const remove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    saveFiles(next);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <Tabs defaultValue="files" className="w-full">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <TabsList className="bg-gray-100 h-9">
            <TabsTrigger
              value="files"
              className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#46CDCF]"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Files
              <span className="ml-1.5 text-[10px] text-gray-400">
                {files.length}/{MAX_FILES}
              </span>
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={uploading || files.length >= MAX_FILES || !canUpload}
            size="sm"
            className="h-8 bg-[#46CDCF] hover:bg-[#3db8ba] text-white text-xs font-semibold"
            data-testid="button-upload-file"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleSelect}
            data-testid="input-file-upload"
          />
        </div>

        {!canUpload && (
          <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Only the <strong>Super Admin</strong> and <strong>Executive</strong>{" "}
              can upload Negative Database data. You have view-only access.
            </span>
          </div>
        )}

        <TabsContent value="files" className="mt-0 px-4 pb-3">
          {files.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">
              No files uploaded yet &middot; Max 3 files, 20MB each
            </p>
          ) : (
            <ul className="divide-y divide-gray-50 border-t border-gray-50">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between py-2 gap-2"
                  data-testid={`file-item-${f.id}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      {f.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatSize(f.size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={f.dataUrl}
                      download={f.name}
                      className="p-1 text-gray-400 hover:text-[#46CDCF] rounded"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    {canUpload && (
                      <button
                        onClick={() => remove(f.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Remove"
                        data-testid={`button-remove-${f.id}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
