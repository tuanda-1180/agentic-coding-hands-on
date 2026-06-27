import Image from "next/image";
import { TargetIcon, DiamondIcon, LicenseIcon } from "./award-icons";

export interface PrizeLine {
  label: string;
  value: string;
  note?: string;
}

export interface AwardInfoSectionProps {
  /** Must match the slugs used on the page for hash navigation. */
  slug: string;
  /** Full image path e.g. "/saa/name-top-talent.png" */
  nameImage: string;
  title: string;
  description: string;
  /** Quantity heading, e.g. "Số lượng giải thưởng:" */
  quantityHeading: string;
  /** Big quantity number, e.g. "10". */
  quantityNumber: string;
  /** Small quantity unit beside the number, e.g. "Cá nhân". */
  quantityUnit: string;
  /** One or more prize lines: label + value + optional note */
  prizeLines: PrizeLine[];
  /** Separator label between multiple prize lines (e.g. "Hoặc"). */
  orLabel: string;
  /** Whether the award image is on the right (even rows) or left (odd rows). */
  imageOnRight?: boolean;
}

/**
 * A single award info section rendered in the main content column.
 * Layout: 336×336 award image (award-bg.png + name overlay) + content panel.
 * imageOnRight alternates left/right per the design.
 */
export default function AwardInfoSection({
  slug,
  nameImage,
  title,
  description,
  quantityHeading,
  quantityNumber,
  quantityUnit,
  prizeLines,
  orLabel,
  imageOnRight = false,
}: AwardInfoSectionProps) {
  const hasMultiplePrizes = prizeLines.length > 1;
  const picture = (
    <div
      className="award-info-picture"
      style={{
        position: "relative",
        width: "336px",
        height: "336px",
        flexShrink: 0,
        borderRadius: "24px",
        border: "0.955px solid #FFEA9E",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
        overflow: "hidden",
        backgroundColor: "#00101A",
      }}
    >
      <Image
        src="/saa/award-bg.png"
        alt=""
        aria-hidden={true}
        fill
        style={{ objectFit: "cover", mixBlendMode: "screen" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Image
          src={nameImage}
          alt={title}
          width={221}
          height={64}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Title + description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <TargetIcon />
          <h3
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "32px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            margin: 0,
            textAlign: "justify",
          }}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid #2E3940", margin: 0 }} />

      {/* Quantity row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <DiamondIcon />
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "32px",
            color: "#FFEA9E",
          }}
        >
          {quantityHeading}
        </span>
        {/* Big number + small unit beside it (unit wraps for long values). */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "36px",
              lineHeight: "44px",
              color: "#FFFFFF",
            }}
          >
            {quantityNumber}
          </span>
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0.1px",
              color: "#FFFFFF",
              width: "60px",
            }}
          >
            {quantityUnit}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid #2E3940", margin: 0 }} />

      {/* Prize lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {prizeLines.map((pl, idx) => (
          <div
            key={`${pl.value}-${idx}`}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <LicenseIcon />
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "#FFEA9E",
                }}
              >
                {pl.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "36px",
                lineHeight: "44px",
                color: "#FFFFFF",
                marginLeft: "40px",
              }}
            >
              {pl.value}
            </div>
            {pl.note && (
              <div
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "#FFFFFF",
                  marginLeft: "40px",
                }}
              >
                {pl.note}
              </div>
            )}
            {/* Separator (e.g. "Hoặc") shown between multiple prize lines */}
            {hasMultiplePrizes && idx < prizeLines.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "40px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "0.1px",
                    color: "#8A9BA8",
                    flexShrink: 0,
                  }}
                >
                  {orLabel}
                </span>
                <hr
                  style={{
                    flex: 1,
                    border: "none",
                    borderTop: "1px solid #2E3940",
                    margin: 0,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      id={slug}
      className="award-info-row"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        alignItems: "flex-start",
        scrollMarginTop: "100px",
      }}
    >
      {imageOnRight ? (
        <>
          {content}
          {picture}
        </>
      ) : (
        <>
          {picture}
          {content}
        </>
      )}
    </div>
  );
}
