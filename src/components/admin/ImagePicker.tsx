import { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "menu-images";
const SIGNED_EXPIRY = 60 * 60 * 24 * 365 * 10; // ~10 years

export function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });
      if (upErr) throw upErr;
      const { data, error: sErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_EXPIRY);
      if (sErr || !data) throw sErr ?? new Error("Failed to sign URL");
      onChange(data.signedUrl);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {value && (
        <div className="mt-1 relative rounded-xl overflow-hidden border border-border">
          <img src={value} alt="preview" className="h-32 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full bg-background/90 p-1 text-destructive"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… (paste URL)"
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
      />
      <div className="mt-2 flex gap-2">
        <label
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border py-2 text-xs cursor-pointer hover:bg-muted ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload new"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border py-2 text-xs hover:bg-muted"
        >
          <ImageIcon size={14} /> Choose from gallery
        </button>
      </div>
      {showGallery && (
        <GalleryModal
          onClose={() => setShowGallery(false)}
          onPick={(url) => {
            onChange(url);
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}

function GalleryModal({ onClose, onPick }: { onClose: () => void; onPick: (url: string) => void }) {
  const [items, setItems] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      const files = (data ?? []).filter((f) => f.name && !f.name.startsWith("."));
      const signed = await Promise.all(
        files.map(async (f) => {
          const { data: s } = await supabase.storage.from(BUCKET).createSignedUrl(f.name, SIGNED_EXPIRY);
          return { name: f.name, url: s?.signedUrl ?? "" };
        }),
      );
      setItems(signed.filter((i) => i.url));
      setLoading(false);
    })();
  }, []);

  async function del(name: string) {
    if (!confirm("Delete this image from the gallery?")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((i) => i.name !== name));
    toast.success("Deleted");
  }

  return (
    <div className="fixed inset-0 z-[60] bg-charcoal-deep/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border max-w-3xl w-full max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-border sticky top-0 bg-card">
          <h2 className="font-display text-xl">Image gallery</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No images yet. Upload one to build your gallery.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((it) => (
                <div key={it.name} className="group relative rounded-lg overflow-hidden border border-border">
                  <button type="button" onClick={() => onPick(it.url)} className="block w-full">
                    <img src={it.url} alt={it.name} className="h-28 w-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => del(it.name)}
                    className="absolute top-1 right-1 rounded-full bg-background/90 p-1 opacity-0 group-hover:opacity-100 transition text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}