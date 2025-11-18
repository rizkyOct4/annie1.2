import Link from "next/link";

const TrendingPage = () => {
  return (
    <div>
      <h1>Trending Page</h1>
      <Link href="/homepage/today">Today</Link>
    </div>
  );
};

export default TrendingPage;
