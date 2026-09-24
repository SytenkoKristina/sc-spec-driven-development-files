import type { ReactNode } from "react";
import "./layout.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
