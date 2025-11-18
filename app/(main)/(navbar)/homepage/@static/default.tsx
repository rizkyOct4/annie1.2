import { IoIosStats } from "react-icons/io";
import Link from "next/link";
// import { useRouter } from "next/navigation";

const Static = () => {
  // const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-2">
      <Link href={"homepage/stats"}>
        Stats default
        <span>
          <IoIosStats />
        </span>
      </Link>
    </div>
  );
};

export default Static;
