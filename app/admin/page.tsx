import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/login");
  }

  return <AdminContent />;
}

function AdminContent() {
  const t = useTranslations("common");

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#00101A" }}
    >
      <h1 className="text-white text-2xl font-bold">
        Admin Dashboard — {t("comingSoon")}
      </h1>
    </main>
  );
}
