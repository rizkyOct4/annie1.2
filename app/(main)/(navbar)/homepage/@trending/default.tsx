import Link from "next/link";

const Trending = () => {
  // const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-2">
      {/* <button onClick={() => router.push("/homepage/trending")}>
        Trending <span>""</span>
      </button> */}
      <h1>Trending Default</h1>
      <Link href={"/homepage/today"}>Today</Link>
    </div>
  );
};

export default Trending;
