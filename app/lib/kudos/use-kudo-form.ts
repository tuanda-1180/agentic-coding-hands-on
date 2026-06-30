"use client";

// Client-side form state + validation for the Write/Edit Kudo modal.
// Pure validation lives in ./validation; this hook only wires state to it.
import { useCallback, useMemo, useState } from "react";
import type { KudosInput, KudosPost } from "@/app/lib/liveboard/types";
import type { SunnerOption } from "@/app/lib/liveboard/user-queries";
import {
  validateKudoInput,
  hasErrors,
  isAcceptedImageType,
  MAX_IMAGES,
  type KudoErrors,
} from "./validation";

export interface KudoImage {
  id: string; // local key
  src: string; // uploaded public URL (or object URL while pending)
}

export interface KudoFormState {
  receiver: SunnerOption | null;
  title: string;
  content: string; // rich-text HTML
  tags: string[];
  images: KudoImage[];
  isAnonymous: boolean;
  anonymousName: string;
}

const EMPTY: KudoFormState = {
  receiver: null,
  title: "",
  content: "",
  tags: [],
  images: [],
  isAnonymous: false,
  anonymousName: "",
};

/** Build the API payload from form state. Primary category = first hashtag. */
export function toKudosInput(s: KudoFormState): KudosInput {
  return {
    receiverId: s.receiver?.id ?? "",
    title: s.title,
    content: s.content,
    category: s.tags[0] ?? "",
    tags: s.tags,
    images: s.images.map((i) => i.src),
    isAnonymous: s.isAnonymous,
    anonymousName: s.anonymousName,
  };
}

/** Seed form state from an existing kudo (edit mode). */
export function fromKudosPost(k: KudosPost): KudoFormState {
  return {
    receiver: {
      id: k.receiver.id,
      name: k.receiver.name,
      avatarUrl: k.receiver.avatarUrl,
      department: k.receiver.team,
      title: null,
    },
    title: k.title,
    content: k.content,
    tags: k.tags,
    images: k.images.map((src, i) => ({ id: `${i}`, src })),
    isAnonymous: k.isAnonymous,
    // For the owner editing their own anonymous kudo, the alias IS sender.name.
    anonymousName: k.isAnonymous ? k.sender.name : "",
  };
}

export interface UseKudoFormArgs {
  initial?: KudoFormState;
  onSubmit: (payload: KudosInput) => Promise<void>;
}

export function useKudoForm({ initial, onSubmit }: UseKudoFormArgs) {
  const [state, setState] = useState<KudoFormState>(initial ?? EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors: KudoErrors = useMemo(
    () => validateKudoInput(toKudosInput(state)),
    [state]
  );
  // Surfaced errors: only after a submit attempt (matches the "Lỗi" screen flow).
  const visibleErrors: KudoErrors = showErrors ? errors : {};
  // Gửi stays clickable so an incomplete submit surfaces the validation message
  // (the "Lỗi chưa điền đủ thông tin" flow); only blocked while submitting.
  const submitDisabled = submitting;
  // True once an incomplete submit has been attempted — drives the summary banner.
  const showIncompleteError = showErrors && hasErrors(errors);

  const patch = useCallback((p: Partial<KudoFormState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const setReceiver = useCallback((receiver: SunnerOption | null) => patch({ receiver }), [patch]);
  const setTitle = useCallback((title: string) => patch({ title }), [patch]);
  const setContent = useCallback((content: string) => patch({ content }), [patch]);
  const setTags = useCallback((tags: string[]) => patch({ tags: tags.slice(0, 5) }), [patch]);
  const setAnonymous = useCallback((isAnonymous: boolean) => patch({ isAnonymous }), [patch]);
  const setAnonymousName = useCallback((anonymousName: string) => patch({ anonymousName }), [patch]);

  const addImages = useCallback((imgs: KudoImage[]) => {
    setState((s) => ({ ...s, images: [...s.images, ...imgs].slice(0, MAX_IMAGES) }));
  }, []);
  const removeImage = useCallback((id: string) => {
    setState((s) => ({ ...s, images: s.images.filter((i) => i.id !== id) }));
  }, []);

  const initFromKudo = useCallback((k: KudosPost) => {
    setState(fromKudosPost(k));
    setShowErrors(false);
    setSubmitError(null);
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    setShowErrors(false);
    setSubmitError(null);
  }, []);

  const submit = useCallback(async () => {
    if (hasErrors(errors)) {
      setShowErrors(true);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(toKudosInput(state));
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Gửi thất bại");
    } finally {
      setSubmitting(false);
    }
  }, [errors, onSubmit, state]);

  return {
    state,
    errors: visibleErrors,
    submitDisabled,
    showIncompleteError,
    submitting,
    submitError,
    setReceiver,
    setTitle,
    setContent,
    setTags,
    setAnonymous,
    setAnonymousName,
    addImages,
    removeImage,
    initFromKudo,
    reset,
    submit,
    isAcceptedImageType, // re-exported for the image component
  };
}
