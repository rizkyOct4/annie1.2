"use client";

import { useSession } from "next-auth/react";

const TestNotification = () => {
  const { data: session } = useSession();

  console.log(session?.user);

  return <div>Notification TestNotification</div>;
};

export default TestNotification;
