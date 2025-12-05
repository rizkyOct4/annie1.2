import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/_lib/config";

// Buat handler NextAuth
const handler = NextAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});

// Export GET & POST agar route App Router bekerja
export { handler as GET, handler as POST };


// ! AUTH -> untuk mengidentifikasi tiap users !! masih main di login/logout ?!!
// todo BESOK TAMBAH LAGI UNTUK GITHUB
// todo perbaiki route handler kau besok !!
// todo buat credentialProvider !!!
// todo ganti SEMUA AUTH KAU -> AUTH.JS !!!
// todo data profileContext mungkin berubah !!! PERHATIKAN BAIK" !!!
// todo MIDDLEWARE KAU JUGA TERDAMPAK !!!
// todo CALLBACK dari thirdParty !! perhatikan URL nya !!!

// ! https://console.cloud.google.com/auth/clients/297286681262-i7f0u5q8v6umd8lml6ocuf67mhbh9gpu.apps.googleusercontent.com?project=third-serenity-480313-g6&supportedpurview=project
