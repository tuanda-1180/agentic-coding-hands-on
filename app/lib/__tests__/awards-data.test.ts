import { describe, it, expect } from "vitest";
import { AWARDS, AWARD_SLUGS, AwardEntry } from "../awards/award-data";
import { awardHref } from "../awards/award-href";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";

describe("Award System Data Integrity", () => {
  describe("AWARDS and AWARD_SLUGS structure", () => {
    it("AWARDS is a non-empty array", () => {
      expect(Array.isArray(AWARDS)).toBe(true);
      expect(AWARDS.length).toBeGreaterThan(0);
    });

    it("AWARD_SLUGS is derived from AWARDS.map(a => a.slug)", () => {
      const derived = AWARDS.map((a) => a.slug);
      expect(AWARD_SLUGS).toEqual(derived);
    });

    it("AWARD_SLUGS and AWARDS have the same length", () => {
      expect(AWARD_SLUGS.length).toBe(AWARDS.length);
    });

    it("each AWARDS entry has required fields", () => {
      AWARDS.forEach((award) => {
        expect(award).toHaveProperty("slug");
        expect(award).toHaveProperty("key");
        expect(award).toHaveProperty("nameImage");
        expect(award).toHaveProperty("imageOnRight");
        expect(typeof award.slug).toBe("string");
        expect(typeof award.key).toBe("string");
        expect(typeof award.nameImage).toBe("string");
        expect(typeof award.imageOnRight).toBe("boolean");
      });
    });

    it("no award has an empty slug", () => {
      AWARDS.forEach((award) => {
        expect(award.slug).not.toBe("");
        expect(award.slug.length).toBeGreaterThan(0);
      });
    });

    it("no award has an empty key", () => {
      AWARDS.forEach((award) => {
        expect(award.key).not.toBe("");
        expect(award.key.length).toBeGreaterThan(0);
      });
    });

    it("no award has an empty nameImage path", () => {
      AWARDS.forEach((award) => {
        expect(award.nameImage).not.toBe("");
        expect(award.nameImage.length).toBeGreaterThan(0);
      });
    });

    it("all slugs are unique (no duplicates)", () => {
      const slugSet = new Set(AWARD_SLUGS);
      expect(slugSet.size).toBe(AWARD_SLUGS.length);
    });

    it("all keys are unique (no duplicates)", () => {
      const keys = AWARDS.map((a) => a.key);
      const keySet = new Set(keys);
      expect(keySet.size).toBe(keys.length);
    });

    it("imageOnRight alternates between false and true", () => {
      AWARDS.forEach((award, index) => {
        const expectedValue = index % 2 === 0 ? false : true;
        expect(award.imageOnRight).toBe(expectedValue);
      });
    });
  });

  describe("Slug parity with homepage (critical)", () => {
    it("AWARD_SLUGS are exactly: top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp", () => {
      const expectedSlugs = [
        "top-talent",
        "top-project",
        "top-project-leader",
        "best-manager",
        "signature-2025-creator",
        "mvp",
      ];
      expect(AWARD_SLUGS).toEqual(expectedSlugs);
    });

    it("has exactly 6 awards matching homepage structure", () => {
      expect(AWARDS.length).toBe(6);
    });

    it("AWARD_SLUGS match homepage award card slugs in order", () => {
      // Homepage awards-section.tsx defines these slugs in order
      const homepageSlugs = [
        "top-talent",
        "top-project",
        "top-project-leader",
        "best-manager",
        "signature-2025-creator",
        "mvp",
      ];
      expect(AWARD_SLUGS).toEqual(homepageSlugs);
    });

    it("each AWARDS entry has a corresponding i18n key mapping", () => {
      const expectedKeyMapping: Record<string, string> = {
        "top-talent": "topTalent",
        "top-project": "topProject",
        "top-project-leader": "topProjectLeader",
        "best-manager": "bestManager",
        "signature-2025-creator": "signatureCreator",
        mvp: "mvp",
      };

      AWARDS.forEach((award) => {
        expect(expectedKeyMapping[award.slug]).toBe(award.key);
      });
    });
  });

  describe("awardHref round-trip for each slug", () => {
    it("awardHref(slug) returns /awards#<slug> for each AWARD_SLUG", () => {
      AWARD_SLUGS.forEach((slug) => {
        expect(awardHref(slug)).toBe(`/awards#${slug}`);
      });
    });

    it("top-talent returns /awards#top-talent", () => {
      expect(awardHref("top-talent")).toBe("/awards#top-talent");
    });

    it("top-project returns /awards#top-project", () => {
      expect(awardHref("top-project")).toBe("/awards#top-project");
    });

    it("top-project-leader returns /awards#top-project-leader", () => {
      expect(awardHref("top-project-leader")).toBe(
        "/awards#top-project-leader"
      );
    });

    it("best-manager returns /awards#best-manager", () => {
      expect(awardHref("best-manager")).toBe("/awards#best-manager");
    });

    it("signature-2025-creator returns /awards#signature-2025-creator", () => {
      expect(awardHref("signature-2025-creator")).toBe(
        "/awards#signature-2025-creator"
      );
    });

    it("mvp returns /awards#mvp", () => {
      expect(awardHref("mvp")).toBe("/awards#mvp");
    });

    it("awardHref links work as anchor targets", () => {
      AWARD_SLUGS.forEach((slug) => {
        const href = awardHref(slug);
        const anchorId = href.split("#")[1];
        expect(anchorId).toBe(slug);
      });
    });
  });

  describe("i18n completeness: English (en.json)", () => {
    it("awardsPage namespace exists", () => {
      expect(enMessages.awardsPage).toBeDefined();
      expect(enMessages.awardsPage).not.toBeNull();
    });

    it("has top-level fields: sectionTitle, sectionSubtitle, keyvisualAlt", () => {
      const ap = enMessages.awardsPage;
      expect(ap.sectionTitle).toBeDefined();
      expect(ap.sectionTitle).not.toBe("");
      expect(ap.sectionSubtitle).toBeDefined();
      expect(ap.sectionSubtitle).not.toBe("");
      expect(ap.keyvisualAlt).toBeDefined();
      expect(ap.keyvisualAlt).not.toBe("");
    });

    it("has top-level fields: quantityLabel, prizeLabel", () => {
      const ap = enMessages.awardsPage;
      expect(ap.quantityLabel).toBeDefined();
      expect(ap.quantityLabel).not.toBe("");
      expect(ap.prizeLabel).toBeDefined();
      expect(ap.prizeLabel).not.toBe("");
    });

    it("has top-level field: or", () => {
      const ap = enMessages.awardsPage;
      expect(ap.or).toBeDefined();
      expect(ap.or).not.toBe("");
    });

    it("has kudos fields: eyebrow, title, body, cta", () => {
      const ap = enMessages.awardsPage;
      expect(ap.kudos).toBeDefined();
      expect(ap.kudos.eyebrow).toBeDefined();
      expect(ap.kudos.eyebrow).not.toBe("");
      expect(ap.kudos.title).toBeDefined();
      expect(ap.kudos.title).not.toBe("");
      expect(ap.kudos.body).toBeDefined();
      expect(ap.kudos.body).not.toBe("");
      expect(ap.kudos.cta).toBeDefined();
      expect(ap.kudos.cta).not.toBe("");
    });

    it("has items namespace", () => {
      const ap = enMessages.awardsPage;
      expect(ap.items).toBeDefined();
      expect(typeof ap.items).toBe("object");
    });

    it("items has all award keys from AWARDS", () => {
      const ap = enMessages.awardsPage;
      AWARDS.forEach((award) => {
        expect(ap.items[award.key as keyof typeof ap.items]).toBeDefined();
      });
    });

    it("each award item has title, description, quantity, prizes", () => {
      const ap = enMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        expect(item).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.title).not.toBe("");
        expect(item.description).toBeDefined();
        expect(item.description).not.toBe("");
        expect(item.quantityNumber).toBeDefined();
        expect(item.quantityNumber).not.toBe("");
        expect(item.quantityUnit).toBeDefined();
        expect(item.quantityUnit).not.toBe("");
        expect(item.prizes).toBeDefined();
      });
    });

    it("each award's prizes array is non-empty", () => {
      const ap = enMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        expect(Array.isArray(item.prizes)).toBe(true);
        expect(item.prizes.length).toBeGreaterThan(0);
      });
    });

    it("each prize entry has a non-empty value field", () => {
      const ap = enMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        item.prizes.forEach((prize) => {
          expect(prize.value).toBeDefined();
          expect(prize.value).not.toBe("");
        });
      });
    });

    it("topTalent has correct structure", () => {
      const item = enMessages.awardsPage.items.topTalent;
      expect(item.title).toBe("Top Talent");
      expect(item.quantityNumber).toBe("10");
      expect(item.quantityUnit).toBe("individuals");
      expect(item.prizes.length).toBeGreaterThan(0);
    });

    it("topProject has correct structure", () => {
      const item = enMessages.awardsPage.items.topProject;
      expect(item.title).toBe("Top Project");
      expect(item.quantityNumber).toBe("02");
      expect(item.quantityUnit).toBe("teams");
      expect(item.prizes.length).toBeGreaterThan(0);
    });

    it("topProjectLeader has correct structure", () => {
      const item = enMessages.awardsPage.items.topProjectLeader;
      expect(item.title).toBe("Top Project Leader");
      expect(item.quantityNumber).toBe("03");
      expect(item.quantityUnit).toBe("individuals");
    });

    it("bestManager has correct structure", () => {
      const item = enMessages.awardsPage.items.bestManager;
      expect(item.title).toBe("Best Manager");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("individual");
    });

    it("signatureCreator has correct structure", () => {
      const item = enMessages.awardsPage.items.signatureCreator;
      expect(item.title).toBe("Signature 2025 - Creator");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("individual or team");
    });

    it("mvp has correct structure", () => {
      const item = enMessages.awardsPage.items.mvp;
      expect(item.title).toBe("MVP (Most Valuable Person)");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("individual");
    });
  });

  describe("i18n completeness: Vietnamese (vi.json)", () => {
    it("awardsPage namespace exists", () => {
      expect(viMessages.awardsPage).toBeDefined();
      expect(viMessages.awardsPage).not.toBeNull();
    });

    it("has top-level fields: sectionTitle, sectionSubtitle, keyvisualAlt", () => {
      const ap = viMessages.awardsPage;
      expect(ap.sectionTitle).toBeDefined();
      expect(ap.sectionTitle).not.toBe("");
      expect(ap.sectionSubtitle).toBeDefined();
      expect(ap.sectionSubtitle).not.toBe("");
      expect(ap.keyvisualAlt).toBeDefined();
      expect(ap.keyvisualAlt).not.toBe("");
    });

    it("has top-level fields: quantityLabel, prizeLabel", () => {
      const ap = viMessages.awardsPage;
      expect(ap.quantityLabel).toBeDefined();
      expect(ap.quantityLabel).not.toBe("");
      expect(ap.prizeLabel).toBeDefined();
      expect(ap.prizeLabel).not.toBe("");
    });

    it("has top-level field: or", () => {
      const ap = viMessages.awardsPage;
      expect(ap.or).toBeDefined();
      expect(ap.or).not.toBe("");
    });

    it("has kudos fields: eyebrow, title, body, cta", () => {
      const ap = viMessages.awardsPage;
      expect(ap.kudos).toBeDefined();
      expect(ap.kudos.eyebrow).toBeDefined();
      expect(ap.kudos.eyebrow).not.toBe("");
      expect(ap.kudos.title).toBeDefined();
      expect(ap.kudos.title).not.toBe("");
      expect(ap.kudos.body).toBeDefined();
      expect(ap.kudos.body).not.toBe("");
      expect(ap.kudos.cta).toBeDefined();
      expect(ap.kudos.cta).not.toBe("");
    });

    it("has items namespace", () => {
      const ap = viMessages.awardsPage;
      expect(ap.items).toBeDefined();
      expect(typeof ap.items).toBe("object");
    });

    it("items has all award keys from AWARDS", () => {
      const ap = viMessages.awardsPage;
      AWARDS.forEach((award) => {
        expect(ap.items[award.key as keyof typeof ap.items]).toBeDefined();
      });
    });

    it("each award item has title, description, quantity, prizes", () => {
      const ap = viMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        expect(item).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.title).not.toBe("");
        expect(item.description).toBeDefined();
        expect(item.description).not.toBe("");
        expect(item.quantityNumber).toBeDefined();
        expect(item.quantityNumber).not.toBe("");
        expect(item.quantityUnit).toBeDefined();
        expect(item.quantityUnit).not.toBe("");
        expect(item.prizes).toBeDefined();
      });
    });

    it("each award's prizes array is non-empty", () => {
      const ap = viMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        expect(Array.isArray(item.prizes)).toBe(true);
        expect(item.prizes.length).toBeGreaterThan(0);
      });
    });

    it("each prize entry has a non-empty value field", () => {
      const ap = viMessages.awardsPage;
      AWARDS.forEach((award) => {
        const item = ap.items[award.key as keyof typeof ap.items];
        item.prizes.forEach((prize) => {
          expect(prize.value).toBeDefined();
          expect(prize.value).not.toBe("");
        });
      });
    });

    it("topTalent has correct structure", () => {
      const item = viMessages.awardsPage.items.topTalent;
      expect(item.title).toBe("Top Talent");
      expect(item.quantityNumber).toBe("10");
      expect(item.quantityUnit).toBe("Cá nhân");
    });

    it("topProject has correct structure", () => {
      const item = viMessages.awardsPage.items.topProject;
      expect(item.title).toBe("Top Project");
      expect(item.quantityNumber).toBe("02");
      expect(item.quantityUnit).toBe("Tập thể");
    });

    it("topProjectLeader has correct structure", () => {
      const item = viMessages.awardsPage.items.topProjectLeader;
      expect(item.title).toBe("Top Project Leader");
      expect(item.quantityNumber).toBe("03");
      expect(item.quantityUnit).toBe("Cá nhân");
    });

    it("bestManager has correct structure", () => {
      const item = viMessages.awardsPage.items.bestManager;
      expect(item.title).toBe("Best Manager");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("Cá nhân");
    });

    it("signatureCreator has correct structure", () => {
      const item = viMessages.awardsPage.items.signatureCreator;
      expect(item.title).toBe("Signature 2025 - Creator");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("Cá nhân hoặc tập thể");
    });

    it("mvp has correct structure", () => {
      const item = viMessages.awardsPage.items.mvp;
      expect(item.title).toBe("MVP (Most Valuable Person)");
      expect(item.quantityNumber).toBe("01");
      expect(item.quantityUnit).toBe("Cá nhân");
    });
  });

  describe("i18n parity: EN/VI key alignment", () => {
    it("both locales have same set of award keys in items", () => {
      const enKeys = Object.keys(enMessages.awardsPage.items).sort();
      const viKeys = Object.keys(viMessages.awardsPage.items).sort();
      expect(enKeys).toEqual(viKeys);
    });

    it("both locales have same top-level fields", () => {
      const enTopLevel = Object.keys(enMessages.awardsPage)
        .filter((k) => k !== "items" && k !== "kudos")
        .sort();
      const viTopLevel = Object.keys(viMessages.awardsPage)
        .filter((k) => k !== "items" && k !== "kudos")
        .sort();
      expect(enTopLevel).toEqual(viTopLevel);
    });

    it("both locales have same kudos fields", () => {
      const enKudos = Object.keys(enMessages.awardsPage.kudos).sort();
      const viKudos = Object.keys(viMessages.awardsPage.kudos).sort();
      expect(enKudos).toEqual(viKudos);
    });

    it("each award in both locales has same prize array length", () => {
      AWARDS.forEach((award) => {
        const enCount = enMessages.awardsPage.items[
          award.key as keyof typeof enMessages.awardsPage.items
        ].prizes.length;
        const viCount = viMessages.awardsPage.items[
          award.key as keyof typeof viMessages.awardsPage.items
        ].prizes.length;
        expect(enCount).toBe(viCount);
      });
    });
  });
});
