"use client";

import { useTranslations } from "next-intl";
import AwardCard from "./award-card";

export default function AwardsSection() {
  const t = useTranslations("awards");

  const AWARDS = [
    {
      title: t("topTalentTitle"),
      description: t("topTalentDesc"),
      nameImage: "/saa/name-top-talent.png",
      slug: "top-talent",
    },
    {
      title: t("topProjectTitle"),
      description: t("topProjectDesc"),
      nameImage: "/saa/name-top-project.png",
      slug: "top-project",
    },
    {
      title: t("topProjectLeaderTitle"),
      description: t("topProjectLeaderDesc"),
      nameImage: "/saa/name-top-project-leader.png",
      slug: "top-project-leader",
    },
    {
      title: t("bestManagerTitle"),
      description: t("bestManagerDesc"),
      nameImage: "/saa/name-best-manager.png",
      slug: "best-manager",
    },
    {
      title: t("signatureCreatorTitle"),
      description: t("signatureCreatorDesc"),
      nameImage: "/saa/name-signature-creator.png",
      slug: "signature-2025-creator",
    },
    {
      title: t("mvpTitle"),
      description: t("mvpDesc"),
      nameImage: "/saa/name-mvp.png",
      slug: "mvp",
    },
  ];

  return (
    <section
      id="awards"
      style={{
        width: "100%",
        backgroundColor: "#00101A",
        padding: "80px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1224px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          // gap 80 between the C1 header and the card grid (frame node 2167:9068)
          gap: "80px",
        }}
      >
        {/* Section header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "24px",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {t("eventLabel")}
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #2E3940",
              margin: 0,
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "57px",
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            {t("sectionTitle")}
          </h2>
        </div>

        {/* Award cards grid — 3 cols desktop / 2 tablet / 1 mobile */}
        <div className="awards-grid">
          {AWARDS.map((award) => (
            <AwardCard key={award.slug} {...award} detailLabel={t("detail")} />
          ))}
        </div>
      </div>
    </section>
  );
}
