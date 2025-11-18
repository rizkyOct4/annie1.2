import { IoNotificationsCircle } from "react-icons/io5";
// import { useRouter } from "next/navigation";
import Link from "next/link";

const Notifications = () => {
  // const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-2">
      <Link href={"/homepage/notification"}>
        Notification default
        <span>
          <IoNotificationsCircle />
        </span>
      </Link>
    </div>
  );
};

export default Notifications;
