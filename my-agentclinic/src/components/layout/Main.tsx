import type { ReactNode } from "react";

export default function Main({ children }: { children: ReactNode }) {
  return <main className="site-main">{children}</main>;
}
