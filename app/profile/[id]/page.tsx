import { notFound } from "next/navigation";
import ProfileScreen from "../../components/profile/profile-screen";
import { getPublicProfile } from "@/app/lib/liveboard/profile-queries";
import { isValidUserId } from "@/app/api/users/validation";

// "Profile người khác" — any sunner's public profile, reached from the avatar
// hover card. Reuses ProfileScreen in public-view mode (userId set). Returns a
// real 404 for malformed ids or unknown users (rather than a 200 error page);
// ProfileScreen re-fetches client-side to drive the received/sent filter.
export default async function OtherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidUserId(id)) notFound();
  const { user } = await getPublicProfile(id);
  if (!user) notFound();
  return <ProfileScreen userId={id} />;
}
