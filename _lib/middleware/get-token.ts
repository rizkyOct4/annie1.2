import { auth } from "@/app/api/auth/[...nextauth]/route";

const GetToken = async () => {
  const token = await auth();
  const session = token?.user;
  // console.log(`token`, session)

  return {
    id: session?.publicId as string,
    // originalId: session?.id as string,
    name: session?.name as string,
    role: session?.role as string,
  };
};

export default GetToken;

// ? import { NextApiRequest, NextApiResponse } from "next"; -> ini di route handler

// todo TARGET COOKIES KAU DARI AUTHENTICATION !!
// todo PASTIKAN PAS SEMUA AUTH KAU !!

// todo penggunaan COOKIES di https request -> public kasih cookies !! private GET ga perlu, tapi pastikan sudah dilindungi middleware
// todo POST, PUT, DEL HARUS PAKAI COOKIES -> PRIVATE / PUBLIC HARUS PAKAI !!
