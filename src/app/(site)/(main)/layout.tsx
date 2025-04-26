import type { Metadata } from "next";
import Sidebar from "../../components/Sidebar";

export const metadata: Metadata = {
  title: "NightKing - Premium Streaming Platform",
  description: "Your premium streaming destination for high-quality content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     
      {/* Main Content Area */}
      <div className="w-full pt-[120px] overflow-auto">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 min-h-full">{children}</div>
        </div>
      </div>
    </>
  );
}
