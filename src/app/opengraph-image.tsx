import { ImageResponse } from "next/og";
export const alt = "Atelier Arvena - Form. Space. Perspective.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#090909", color: "#f2f0eb", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}><div style={{ display: "flex", fontSize: 20, letterSpacing: 7, color: "#c3b39b" }}>ATELIER ARVENA</div><div style={{ display: "flex", fontSize: 84, lineHeight: 1.05, maxWidth: 900 }}>Architecture in its purest form.</div><div style={{ display: "flex", borderTop: "1px solid #303030", paddingTop: 24, fontSize: 19, color: "#b8b5af" }}>Form. Space. Perspective.</div></div>, size);
}
