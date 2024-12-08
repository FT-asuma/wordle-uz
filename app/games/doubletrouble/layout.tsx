import { Metadata } from "next";
import AppProvider from "../context/AppContext";

export const metadata: Metadata = {
  title: "Double Trouble",
  description: "Challenge yourself in a double trouble mode! wordle-uz",
};

const DoubleTroubleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <AppProvider>{children}</AppProvider>
    </div>
  );
};

export default DoubleTroubleLayout;
