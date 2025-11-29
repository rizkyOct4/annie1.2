import Navbar from "@/app/(main)/(navbar)/Navbar";
import Sidebar from "@/app/(main)/(sidebar)/Sidebar";

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar modal={modal}>{children}</Sidebar>
    </>
  );
}

// ? 【EDM Relax #4】Chill & Focus Lo-Fi EDM 🎧 Background Music for Study, Work & Everyday Moments

