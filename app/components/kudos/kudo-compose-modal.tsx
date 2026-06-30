"use client";

// Orchestration: assembles the Kudo modal (shell + fields + editor) and wires it
// to the form hook + APIs. Handles both create and edit.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { KudosInput, KudosPost } from "@/app/lib/liveboard/types";
import type { SunnerOption } from "@/app/lib/liveboard/user-queries";
import { useKudoForm, fromKudosPost } from "@/app/lib/kudos/use-kudo-form";
import { isAcceptedImageType, type KudoFieldError } from "@/app/lib/kudos/validation";
import KudoModal from "./kudo-modal";
import KudoRecipientSelect from "./kudo-recipient-select";
import KudoTitleInput from "./kudo-title-input";
import { KudoEditor } from "./kudo-editor";
import KudoHashtagPicker from "./kudo-hashtag-picker";
import KudoImageUpload from "./kudo-image-upload";
import KudoAnonymousToggle from "./kudo-anonymous-toggle";

export interface KudoComposeModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialKudo?: KudosPost | null;
  /** Hashtag options. If omitted, the modal fetches them from /api/liveboard/filters. */
  hashtagOptions?: string[];
  /** Pre-fill the recipient on create (e.g. opened from an avatar's "Send KUDO"). */
  presetRecipient?: { id: string; name: string; avatarUrl: string } | null;
  onClose: () => void;
  /** Called after a successful create/edit (e.g. to update a feed). Optional. */
  onSaved?: (kudo: KudosPost, mode: "create" | "edit") => void;
}

async function uploadFiles(files: File[]): Promise<string[]> {
  const accepted = files.filter((f) => isAcceptedImageType(f.type));
  if (accepted.length === 0) return [];
  const form = new FormData();
  accepted.forEach((f) => form.append("files", f));
  const res = await fetch("/api/kudos/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Upload failed");
  return ((await res.json()) as { urls: string[] }).urls;
}

export default function KudoComposeModal({
  open,
  mode,
  initialKudo,
  hashtagOptions,
  presetRecipient,
  onClose,
  onSaved,
}: KudoComposeModalProps) {
  const t = useTranslations("writeKudos");
  const [sunners, setSunners] = useState<SunnerOption[]>([]);
  const [fetchedHashtags, setFetchedHashtags] = useState<string[]>([]);
  const hashtags = hashtagOptions ?? fetchedHashtags;

  // Self-fetch hashtag options when the parent doesn't supply them (e.g. homepage FAB).
  useEffect(() => {
    if (!open || hashtagOptions) return;
    let cancelled = false;
    fetch("/api/liveboard/filters")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { hashtags: string[] } | null) => { if (!cancelled && d) setFetchedHashtags(d.hashtags); })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [open, hashtagOptions]);

  const initial = useMemo(
    () => (mode === "edit" && initialKudo ? fromKudosPost(initialKudo) : undefined),
    [mode, initialKudo]
  );

  const submitToApi = useCallback(
    async (payload: KudosInput) => {
      const url = mode === "edit" && initialKudo ? `/api/kudos/${initialKudo.id}` : "/api/kudos";
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error ?? t("submitError"));
      }
      const kudo = (await res.json()) as KudosPost;
      onSaved?.(kudo, mode);
      onClose();
    },
    [mode, initialKudo, onSaved, onClose, t]
  );

  const form = useKudoForm({ initial, onSubmit: submitToApi });
  const { state, errors, setReceiver, setTitle, setContent, setTags, setAnonymous, setAnonymousName, addImages, removeImage, submit, submitDisabled, submitting, showIncompleteError, submitError, initFromKudo, reset } = form;

  // Reset / seed form whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialKudo) {
      initFromKudo(initialKudo);
    } else {
      reset();
      if (presetRecipient) {
        setReceiver({ ...presetRecipient, department: "", title: null });
      }
    }
  }, [open, mode, initialKudo, presetRecipient, initFromKudo, reset, setReceiver]);

  // Load an initial sunner list (recipient options + @mention candidates).
  const fetchSunners = useCallback(async (q: string) => {
    try {
      const res = await fetch(`/api/sunners/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      setSunners(((await res.json()) as { items: SunnerOption[] }).items);
    } catch {
      /* ignore */
    }
  }, []);
  // Fetch-on-open is a genuine data side-effect (state is set asynchronously
  // after the request resolves, not synchronously during the effect).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) fetchSunners("");
  }, [open, fetchSunners]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAddFiles = useCallback(
    async (files: File[]) => {
      try {
        const urls = await uploadFiles(files);
        addImages(urls.map((src, i) => ({ id: `${src}-${i}`, src })));
      } catch {
        /* surfaced via image error if needed */
      }
    },
    [addImages]
  );

  const msg = (code?: KudoFieldError): string | undefined => {
    if (!code) return undefined;
    if (code === "maxTags") return t("errMaxTags");
    if (code === "maxImages") return t("errMaxImages");
    if (code === "invalidFileType") return t("errFileType");
    if (code === "invalidUrl") return t("errInvalidUrl");
    if (code === "tooLong") return t("errTooLong");
    return t("errRequired");
  };

  const mentionItems = useMemo(
    () => sunners.map((s) => ({ id: s.id, label: s.name })),
    [sunners]
  );
  const recipientOptions = useMemo(
    () => sunners.map((s) => ({ id: s.id, name: s.name, avatarUrl: s.avatarUrl, department: s.department })),
    [sunners]
  );

  return (
    <KudoModal
      mode={mode}
      open={open}
      loading={submitting}
      submitDisabled={submitDisabled}
      onCancel={onClose}
      onSubmit={submit}
    >
      <KudoRecipientSelect
        value={state.receiver ? { id: state.receiver.id, name: state.receiver.name, avatarUrl: state.receiver.avatarUrl } : null}
        onChange={(opt) =>
          setReceiver(opt ? { id: opt.id, name: opt.name, avatarUrl: opt.avatarUrl, department: "", title: null } : null)
        }
        options={recipientOptions}
        onSearch={fetchSunners}
        error={msg(errors.receiver)}
      />
      <KudoTitleInput value={state.title} onChange={setTitle} error={msg(errors.title)} />
      <KudoEditor value={state.content} onChange={setContent} mentionItems={mentionItems} error={msg(errors.content)} />
      <KudoHashtagPicker value={state.tags} onChange={setTags} options={hashtags} error={msg(errors.tags)} />
      <KudoImageUpload value={state.images} onRemove={removeImage} onAddFiles={handleAddFiles} error={msg(errors.images)} />
      <KudoAnonymousToggle
        checked={state.isAnonymous}
        onChange={setAnonymous}
        name={state.anonymousName}
        onNameChange={setAnonymousName}
        namePlaceholder={t("anonymousNamePlaceholder")}
      />

      {(showIncompleteError || submitError) && (
        <div
          role="alert"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "15px",
            fontWeight: 700,
            color: "#D4271D",
            background: "rgba(212, 39, 29, 0.08)",
            border: "1px solid rgba(212, 39, 29, 0.4)",
            borderRadius: "8px",
            padding: "12px 16px",
          }}
        >
          {submitError ?? t("incompleteError")}
        </div>
      )}
    </KudoModal>
  );
}
