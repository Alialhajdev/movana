import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  aspect?: "poster" | "wide";
}

export function ImageUploader({ value, onChange, label, aspect = "poster" }: Props) {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("series-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("series-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <div className={`relative rounded-md overflow-hidden bg-white/5 border border-border ${aspect === "poster" ? "aspect-[2/3]" : "aspect-video"}`}>
        {value ? (
          <>
            <img src={value} alt="" className="size-full object-cover" />
            <button type="button" onClick={() => onChange(undefined)} className="absolute top-2 end-2 grid size-7 place-items-center rounded-full bg-black/70 hover:bg-destructive">
              <X className="size-4" />
            </button>
          </>
        ) : (
          <label className="absolute inset-0 grid place-items-center cursor-pointer hover:bg-white/5 transition">
            {busy ? <Loader2 className="size-6 animate-spin" /> : <div className="text-center text-xs text-muted-foreground"><Upload className="mx-auto size-6 mb-1" />Click to upload</div>}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            />
          </label>
        )}
      </div>
      <Input
        className="mt-2"
        placeholder="Or paste image URL"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    </div>
  );
}
