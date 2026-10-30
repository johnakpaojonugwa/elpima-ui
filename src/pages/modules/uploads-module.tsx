import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  ImageUp,
  Search,
  UploadCloud,
} from "lucide-react";
import {
  useProductsQuery,
  useUploadMultipleImagesMutation,
  useUploadSingleImageMutation,
} from "@/hooks/queries";
import { formatLiveDate } from "@/utils/date";

interface UploadedAssetItem {
  id: string;
  url: string;
  sourceName: string;
  sku?: string | null;
  uploadedAt: string;
}

interface UploadsModuleProps {
  onToast?: (message: string) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateUploadFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Invalid format for "${file.name}". Only JPEG, PNG, and WebP images are supported.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `"${file.name}" exceeds the 5MB size limit (${sizeMb}MB).`;
  }
  return null;
}

export const UploadsModule: React.FC<UploadsModuleProps> = ({ onToast }) => {
  const { data: productsRes, isLoading } = useProductsQuery({ limit: 50 });
  const uploadSingle = useUploadSingleImageMutation();
  const uploadMultiple = useUploadMultipleImagesMutation();

  const [sessionAssets, setSessionAssets] = useState<UploadedAssetItem[]>([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const allAssets = useMemo(() => {
    const productAssets: UploadedAssetItem[] = [];
    (productsRes?.items ?? []).forEach((prod) => {
      (prod.images ?? []).forEach((imgUrl, idx) => {
        productAssets.push({
          id: `${prod.id}-${idx}`,
          url: imgUrl,
          sourceName: prod.name,
          sku: prod.sku,
          uploadedAt: prod.updatedAt || prod.createdAt,
        });
      });
    });

    const combined = [...sessionAssets, ...productAssets];
    const q = search.trim().toLowerCase();
    if (!q) return combined;
    return combined.filter(
      (a) =>
        a.sourceName.toLowerCase().includes(q) ||
        (a.sku ?? "").toLowerCase().includes(q) ||
        a.url.toLowerCase().includes(q),
    );
  }, [productsRes, sessionAssets, search]);

  const handleSingleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    const validationError = validateUploadFile(file);
    if (validationError) {
      setUploadError(validationError);
      e.target.value = "";
      return;
    }

    try {
      const res = await uploadSingle.mutateAsync(file);
      if (res?.url) {
        setSessionAssets((prev) => [
          {
            id: `session-${Date.now()}`,
            url: res.url,
            sourceName: file.name,
            sku: "NEW-UPLOAD",
            uploadedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        onToast?.(`Uploaded ${file.name}`);
      }
    } catch (err: any) {
      setUploadError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Upload failed. Ensure file is JPEG, PNG, or WebP under 5MB.",
      );
    } finally {
      e.target.value = "";
    }
  };

  const handleBatchFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;
    setUploadError("");

    const files = Array.from(filesList).slice(0, 10);

    for (const f of files) {
      const validationError = validateUploadFile(f);
      if (validationError) {
        setUploadError(validationError);
        e.target.value = "";
        return;
      }
    }

    try {
      const res = await uploadMultiple.mutateAsync(files);
      const urls = res?.urls ?? [];
      const created: UploadedAssetItem[] = urls.map((url, idx) => ({
        id: `batch-${Date.now()}-${idx}`,
        url,
        sourceName: files[idx]?.name || `Batch Upload #${idx + 1}`,
        sku: "BATCH-UPLOAD",
        uploadedAt: new Date().toISOString(),
      }));
      setSessionAssets((prev) => [...created, ...prev]);
      onToast?.(`Uploaded ${created.length} surgical product image(s)`);
    } catch (err: any) {
      setUploadError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Batch upload failed. Max 10 JPEG/PNG/WebP images (5MB each).",
      );
    } finally {
      e.target.value = "";
    }
  };

  const handleCopyUrl = (asset: UploadedAssetItem) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    onToast?.("Copied image URL to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
            <ImageUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Surgical Media & Asset Uploads
            </h1>
            <p className="text-xs text-gray-500">
              Upload high-resolution JPEG, PNG, and WebP equipment imagery to
              the Elpima media storage engine
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/80 transition cursor-pointer text-center">
          <UploadCloud className="w-8 h-8 text-[#2E7D5B] mb-2" />
          <p className="text-sm font-bold text-gray-900">
            {uploadSingle.isPending
              ? "Uploading Single Image..."
              : "Upload Single Equipment Image"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            POST /api/v1/upload/image • JPEG, PNG, WebP (Max 5MB)
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSingleFileChange}
            disabled={uploadSingle.isPending}
            className="hidden"
          />
        </label>

        <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/80 transition cursor-pointer text-center">
          <ImageUp className="w-8 h-8 text-sky-600 mb-2" />
          <p className="text-sm font-bold text-gray-900">
            {uploadMultiple.isPending
              ? "Uploading Batch Images..."
              : "Batch Upload (Up to 10 Images)"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            POST /api/v1/upload/images • Select multiple gallery angles
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleBatchFilesChange}
            disabled={uploadMultiple.isPending}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
          {uploadError}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter media library by product name, SKU, or filename..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {allAssets.length} Media Assets
        </span>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-400">
          Loading catalog media assets...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.sourceName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {asset.sku && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px] font-semibold">
                    {asset.sku}
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {asset.sourceName}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatLiveDate(asset.uploadedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-800 transition cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900"
                    title="Open full resolution"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadsModule;

