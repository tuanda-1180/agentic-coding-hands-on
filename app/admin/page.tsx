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
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00101A",
      }}
    >
      <h1 style={{ color: "#ffffff", fontSize: 24, fontWeight: 700 }}>
        Admin Dashboard — {t("comingSoon")}
      </h1>
    </main>
  );
}
