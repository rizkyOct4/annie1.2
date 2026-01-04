import Navbar from "./(navbar)/navbar";
import Sidebar from "./(sidebar)/sidebar";

export default function MainLayout({
  children,
  intAuth,
}: {
  children: React.ReactNode;
  intAuth: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <section className="flex">
        <Sidebar />
        <main
          className="flex-1 min-h-screen bg-black/60 py-4 px-10 w-full ml-20
    ">
          {intAuth}
          {children}
        </main>
      </section>
    </>
  );
}
