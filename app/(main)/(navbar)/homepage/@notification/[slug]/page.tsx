import dynamic from "next/dynamic";

export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "mention"
  | "upload"
  | "system";

export type HomepageNotification = {
  id: string;
  type: NotificationType;
  actor: {
    id: string;
    name: string;
    avatar: string;
  };
  target?: {
    id: string;
    title: string;
    thumbnail: string;
    type: "video" | "photo" | "profile";
  };
  message: string;
  createdAt: string;
  isRead: boolean;
  meta?: {
    commentText?: string;
    mentionUsernames?: string[];
    uploadCount?: number;
    followBack?: boolean;
  };
};

export const dummyNotifications: HomepageNotification[] = [
  {
    id: "n1",
    type: "like",
    actor: {
      id: "u1",
      name: "Alicia Tan",
      avatar: "/photo/1.webp",
    },
    target: {
      id: "v1",
      title: "Street Photography at Night",
      thumbnail: "/thumbs/street-night.jpg",
      type: "photo",
    },
    message: "Alicia liked your photo",
    createdAt: "2025-09-21T14:23:00Z",
    isRead: false,
  },
  {
    id: "n2",
    type: "comment",
    actor: {
      id: "u2",
      name: "Rizky Octa",
      avatar: "/photo/2.webp",
    },
    target: {
      id: "v2",
      title: "Cinematic Drone Shot",
      thumbnail: "/thumbs/drone-shot.jpg",
      type: "video",
    },
    message: "Rizky commented on your video",
    createdAt: "2025-09-20T08:10:00Z",
    isRead: true,
    meta: {
      commentText: "Keren banget angle-nya! 🛸",
    },
  },
  {
    id: "n3",
    type: "mention",
    actor: {
      id: "u3",
      name: "Dimas Arya",
      avatar: "/photo/3.webp",
    },
    target: {
      id: "v3",
      title: "Sunset Timelapse",
      thumbnail: "/thumbs/sunset.jpg",
      type: "video",
    },
    message: "Dimas mentioned you in a comment",
    createdAt: "2025-09-19T17:50:00Z",
    isRead: false,
    meta: {
      mentionUsernames: ["@you", "@anotheruser"],
      commentText: "Coba liat ini @you",
    },
  },
  {
    id: "n4",
    type: "follow",
    actor: {
      id: "u4",
      name: "Siti Marlina",
      avatar: "/photo/4.webp",
    },
    message: "Siti started following you",
    createdAt: "2025-09-18T09:33:00Z",
    isRead: true,
    meta: {
      followBack: true,
    },
  },
  {
    id: "n5",
    type: "upload",
    actor: {
      id: "u5",
      name: "Arif Wibowo",
      avatar: "/photo/5.webp",
    },
    message: "Arif uploaded 3 new videos",
    createdAt: "2025-09-18T07:00:00Z",
    isRead: false,
    meta: {
      uploadCount: 3,
    },
  },
  {
    id: "n6",
    type: "system",
    actor: {
      id: "sys",
      name: "System",
      avatar: "/photo/6.webp",
    },
    message: "Your video ‘AstroPhotography Tips’ passed moderation",
    createdAt: "2025-09-17T12:00:00Z",
    isRead: true,
  },
];

const LazyNotifDescription = dynamic(() => import("./Desc"), {
  loading: () => <p>Loading…</p>,
});

interface NotificationModalProps {
  params: Promise<{ slug: string }>;
}

const NotificationModal = async ({ params }: NotificationModalProps) => {
  const originalPath = (await params)?.slug;

  console.log("original path: ",originalPath)

  return (
    <>
      {originalPath === "notification" && (
        <LazyNotifDescription data={dummyNotifications} />
      )}
    </>
  );
};

export default NotificationModal;

