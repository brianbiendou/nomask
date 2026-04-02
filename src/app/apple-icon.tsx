import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          borderRadius: "34px",
          fontFamily: "Arial Black, sans-serif",
          fontWeight: 900,
          fontSize: "96px",
        }}
      >
        <span style={{ color: "#DC2626" }}>N</span>
        <span style={{ color: "#ffffff" }}>M</span>
      </div>
    ),
    size
  );
}
