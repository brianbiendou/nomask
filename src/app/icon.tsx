import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          borderRadius: "96px",
          fontFamily: "Arial Black, sans-serif",
          fontWeight: 900,
          fontSize: "260px",
        }}
      >
        <span style={{ color: "#DC2626" }}>N</span>
        <span style={{ color: "#ffffff" }}>M</span>
      </div>
    ),
    size
  );
}
