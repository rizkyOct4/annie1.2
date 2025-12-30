import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "@/_lib/config";
import { OAuthRegister, CredentialsLogin } from "@/_lib/services/services-auth";
import { AUTH_SECRET } from "@/_lib/config";

interface LoginCredentials {
  email: string;
  password: string;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1, // ? 1 hari -> login bertahan
    updateAge: 60 * 60, // ? refreshh login
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "m@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      // ? credentials -> ini parameter dari login form kau !!!
      async authorize(credentials?: LoginCredentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const res = await CredentialsLogin({
          email: credentials.email,
          password: credentials.password,
        });
        return res.user;
      },
    }),
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  // ? jwt -> INI DATA SECRET YG AKAN DIKIRIM KE COOKIES !!!
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ! user -> credential, profile -> OAuth
      // ? credentials login → user berisi data dari authorize
      if (user) {
        token.publicId = user.publicId;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image || "";
        token.createdAt = user.createdAt;
      }

      // ? OAuth login → user hanya berisi data dasar
      if (account && profile) {
        const fullname = profile?.name ?? "";
        const splitName = fullname?.trim().split(" ");
        const firstName = splitName[0];
        const lastName = splitName.slice(1).join(" ");

        const email = profile.email ?? "";
        const profilePicture = profile.picture;

        const fetch = await OAuthRegister({
          firstName: firstName,
          lastName: lastName,
          email: email,
          fullname: fullname,
          picture: profilePicture,
        });

        token.publicId = fetch[0].publicId;
        token.email = profile.email;
        token.name = profile.name;
        token.role = fetch[0].role;
        token.picture = profile.picture || fetch[0].picture || "";
        token.createdAt = fetch[0].createdAt ?? "";
      }

      // console.log(`token sesion`, token);
      return token;
    },
    // ? INI YG AKAN DIGUNAKNA DI CLIENT !!
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.publicId = token.publicId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
  },

  // ! TARGET COOKIES KAU !!! -> Ini yang memastikan user login tetap hidup, dan memastikan token tidak dicuri lewat JavaScript.
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // `secure` harus true pada HTTPS
        path: "/",
      },
    },
  },
  secret: AUTH_SECRET,
});

// ? TOKEN DARI AUTH.js ??? user -> users sendiri ???
// * token -> decode masukkan ke cookies !!! profile / account baru dari OAuth

// todo ambil token.image -> masukkan ke session (OAuth)
// todo authConfig kau BESOK KONDISIKAN !!
// TODO PENGAMBILAN COOKIES VALUE KAU !!!
// TODO BERSIHKAN SEMUA AUTHENTICATION KAU !!! PASTIKAN FIX BARU LANJUT MIDDLEWARE !!!!

// todo kembalikan error dari server ke CLIENT besok !!
// todo JUST LITTLE BIT MORE !!

// Field	Isi	Tujuan
// token.sub	OAuth Provider ID	Identitas eksternal
// token.id	UUID DB	Relasi internal
// publicId	nanoid	URL publik
// email	user email	login
