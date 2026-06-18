import { useTranslations } from "next-intl";

export default async function AwardsPage() {
  return <AwardsContent />;
}

function AwardsContent() {
  const t = useTranslations("nav");

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#00101A" }}
    >
      <h1 className="text-white text-2xl font-bold">{t("awardsInfo")}</h1>
    </main>
  );
}
