import { useState } from "react";
import { MapPin, Plus, Trash2, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { useStore, type Address } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  selectedId?: string;
  onSelect: (a: Address) => void;
}

export function AddressManager({ selectedId, onSelect }: Props) {
  const { t, lang } = useI18n();
  const { addresses, addAddress, updateAddress, deleteAddress } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          {t("select_address")}
        </h3>
        <Button
          type="button"
          size="sm"
          className="gradient-red"
          onClick={() => { setEditing(null); setOpen(true); }}
        >
          <Plus className="size-4 me-1" />
          {t("add_address")}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("no_addresses")}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a)}
              className={cn(
                "text-start rounded-xl border-2 p-4 transition relative group",
                selectedId === a.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{a.label}</span>
                    {selectedId === a.id && (
                      <span className="text-[10px] rounded-full gradient-red text-primary-foreground px-2 py-0.5 font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.fullName} · {a.phone}</p>
                  <p className="text-xs mt-1 line-clamp-2">
                    {a.city}{a.district ? ` - ${a.district}` : ""}{a.street ? ` - ${a.street}` : ""}
                  </p>
                  {a.mapUrl && (
                    <a
                      href={a.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      {t("open_map")}
                    </a>
                  )}
                </div>
              </div>
              <div className="absolute top-2 end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setEditing(a); setOpen(true); }}
                  className="grid size-7 place-items-center rounded-md bg-background/60 hover:bg-primary/20 cursor-pointer"
                >
                  <Pencil className="size-3" />
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(t("confirm_delete"))) {
                      deleteAddress(a.id);
                      toast.success(lang === "ar" ? "تم الحذف" : "Deleted");
                    }
                  }}
                  className="grid size-7 place-items-center rounded-md bg-background/60 hover:bg-destructive/20 text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <AddressForm
          initial={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) {
              updateAddress(editing.id, data);
              onSelect({ ...editing, ...data });
              toast.success(lang === "ar" ? "تم التحديث" : "Updated");
            } else {
              const a = addAddress(data);
              onSelect(a);
              toast.success(lang === "ar" ? "تمت الإضافة" : "Added");
            }
            setOpen(false); setEditing(null);
          }}
        />
      </Dialog>
    </div>
  );
}

function AddressForm({ initial, onClose, onSave }: {
  initial: Address | null;
  onClose: () => void;
  onSave: (a: Omit<Address, "id">) => void;
}) {
  const { t, lang } = useI18n();
  const [label, setLabel] = useState(initial?.label ?? (lang === "ar" ? "المنزل" : "Home"));
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [district, setDistrict] = useState(initial?.district ?? "");
  const [street, setStreet] = useState(initial?.street ?? "");
  const [details, setDetails] = useState(initial?.details ?? "");
  const [mapUrl, setMapUrl] = useState(initial?.mapUrl ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !fullName || !phone || !city) return;
    // Try to parse lat,lng from a Google Maps URL like .../@15.3694,44.1910,...
    let lat: number | undefined;
    let lng: number | undefined;
    const m = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || mapUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) { lat = Number(m[1]); lng = Number(m[2]); }
    onSave({ label, fullName, phone, city, district, street, details, mapUrl, lat, lng });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{initial ? t("edit") : t("add_address")}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={t("address_label")} value={label} onChange={setLabel} required />
          <Field label={t("full_name")} value={fullName} onChange={setFullName} required />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={t("phone")} value={phone} onChange={setPhone} required />
          <Field label={t("city")} value={city} onChange={setCity} required />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={t("district")} value={district} onChange={setDistrict} />
          <Field label={t("street")} value={street} onChange={setStreet} />
        </div>
        <label className="block">
          <span className="text-xs text-muted-foreground mb-1 block">{t("address_details")}</span>
          <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={2} />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground mb-1 block">{t("map_url")}</span>
          <div className="flex gap-2">
            <Input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
            />
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-input px-3 text-xs whitespace-nowrap hover:bg-primary/20"
            >
              <MapPin className="size-3" /> {t("pick_on_map")}
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{t("map_url_hint")}</p>
        </label>
        <DialogFooter className="pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t("cancel")}</Button>
          <Button type="submit" className="gradient-red">{t("save")}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, value, onChange, required, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      <Input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
