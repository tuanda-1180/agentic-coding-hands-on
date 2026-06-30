import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileScreen from "../../components/profile/profile-screen";
import { getPublicProfile } from "@/app/lib/liveboard/profile-queries";
import { isValidUserId } from "@/app/api/users/validation";
import { SITE_NAME } from "@/app/lib/site-config";

// Dedupe the profile fetch across generateMetadata and the page render within a
// single request (both need the same user record).
const loadProfile = cache(getPublicProfile);

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isValidUserId(id)) return { title: SITE_NAME };

  const { user } = await loadProfile(id);
  if (!user) return { title: SITE_NAME };

  const title = user.name;
  const description = user.team
    ? `${user.name} · ${user.team} — Kudos & badges on ${SITE_NAME}.`
    : `${user.name} — Kudos & badges on ${SITE_NAME}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      images: user.avatarUrl ? [{ url: user.avatarUrl }] : undefined,
    },
  };
}

// "Profile người khác" — any sunner's public profile, reached from the avatar
// hover card. Reuses ProfileScreen in public-view mode (userId set). Returns a
// real 404 for malformed ids or unknown users (rather than a 200 error page);
// ProfileScreen re-fetches client-side to drive the received/sent filter.
export default async function OtherProfilePage({ params }: Props) {
  const { id } = await params;
  if (!isValidUserId(id)) notFound();
  const { user } = await loadProfile(id);
  if (!user) notFound();
  return <ProfileScreen userId={id} />;
}
