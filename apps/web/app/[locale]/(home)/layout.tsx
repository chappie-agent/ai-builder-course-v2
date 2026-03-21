import type { ReactNode } from "react";

interface HomeLayoutProps {
  readonly children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return <>{children}</>;
};

export default HomeLayout;
