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

// ? Di Next.js App Router:
// ? layout.tsx itu seperti komponen wrapper, tapi tidak unmount/remount setiap kali halaman berpindah.
// ? Selama kamu tetap berada dalam segment group yang sama ((main)/), layout tetap dipertahankan dan hanya children (halaman) yang berubah.

// ? 【EDM Relax #4】Chill & Focus Lo-Fi EDM 🎧 Background Music for Study, Work & Everyday Moments

// ? kondisikan lagi besok sama kau untuk path" lainnya, masih error !!!
