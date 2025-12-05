// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { LoginForAuthJs } from "@/_lib/navbar/auth/route";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: { email: { type: "text" }, password: { type: "password" } },
//       async authorize(credentials) {
//         try {
//           if (!credentials?.email || !credentials?.password) {
//             throw new Error("Email dan password wajib diisi");
//           }
//           const user = await LoginForAuthJs({
//             email: credentials.email,
//             password: credentials.password,
//           });
//           return user;
//         } catch {
//           return null;
//         }
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.publicId = user.publicId;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = { publicId: token.publicId, role: token.role };
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

export { GET, POST } from "@/app/auth";


