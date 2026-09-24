import type { ReactNode } from "react";
import "./layout.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

// Named `LayoutComponentProps`, not `LayoutProps`, to avoid shadowing
// Next.js's generated global `LayoutProps<Route>` type (used in
// src/app/layout.tsx) — the two are unrelated shapes.
type LayoutComponentProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutComponentProps) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
