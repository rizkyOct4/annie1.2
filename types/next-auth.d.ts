import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      publicId: string;
      email: string;
      name: string;
      role: string;
      image: string;
      createdAt: string;
    };
  }

  interface User {
    id: string;
    publicId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  }
}
