import Link from "next/link";

interface IntTodayPageProps {
  params: Promise<{ slug: string }>;
}

const IntTodayPage = async ({ params }: IntTodayPageProps) => {
  const url = (await params).slug;


  return (
    <>
      {url === "today" && (
        <div className="overlay">
          <div className="min-w-[600px] h-[400px] bg-white text-black flex-center relative">
          <Link href="/homepage" className="absolute top-4 right-4">X</Link>
          <h1>Intercept {url}</h1>  
          </div>
        </div>
      )}
    </>
  );
};

export default IntTodayPage;
