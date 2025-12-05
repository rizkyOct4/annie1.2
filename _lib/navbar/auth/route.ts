import { prisma } from "@/_lib/db";
import { RandomId } from "@/_util/GenerateData";
import bcrypt from "bcrypt";
import { UserCheckT } from "./type";
import { JWT_SECRET, JWT_REFRESH_TOKEN } from "@/_lib/config";
import { SignJWT } from "jose";

export const Register = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ? publicId dari postgrest
    const randomId = RandomId();

    await prisma.$executeRaw`INSERT INTO users (iu, first_name, last_name, email, password, role) VALUES 
    (${randomId}, ${firstName}, ${lastName}, ${email}, ${passwordHash}, ${role}::user_role)`;
  } catch (err: any) {
    console.error("Register error:", err);
    throw new Error(err.message || "Insert failed");
  }
};

export const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userCheck: UserCheckT[] =
    await prisma.$queryRaw`SELECT iu, email, password, first_name, last_name, role, public_id, created_at FROM users WHERE email = ${email}`;

  if (userCheck.length === 0) throw new Error("Invalid email or password");

  // ? CHECK PASSWORD
  const passwordMatch = await bcrypt.compare(password, userCheck[0].password);

  if (!passwordMatch) throw new Error("Invalid password");

  // ? LIAT LAGI SAMA KAU PENGGUNAAN TOKEN INI, METHOD LAINNYA ADA
  // ! ini pakai JOSE !!!! LIAT GIMNAA SIGN DAN VERIFYNYA !!!
  const token = await new SignJWT({
    role: userCheck[0].role,
    publicId: userCheck[0].public_id,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // * Header JWT
    .setExpirationTime("1h") // ! Expire 1 jam
    .sign(new TextEncoder().encode(JWT_SECRET!)); // ? di signkan dalam bentuk encode ?

  const refreshToken = await new SignJWT({
    role: userCheck[0].role,
    publicId: userCheck[0].public_id,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // * Header JWT
    .setExpirationTime("1d") // ! Expire 1 hari
    .sign(new TextEncoder().encode(JWT_REFRESH_TOKEN!)); // ? di signkan dalam bentuk encode ?

  // * SOON USE THIS !!
  // const output: OutputT[] = await prisma.$queryRaw`SELECT
  //                   u.firstName, u.lastName, u.role, u.publicId,
  //                   ud.username, ud.gender, ud.pict_url, ud.bio, ud.location, ud.phone_number, COUNT(uf.ref_id_u_receiver)::int AS total_follower
  //                   FROM users u
  //                   LEFT JOIN users_description ud ON (ud.ref_id_u = u.id_unique)
  //                   LEFT JOIN users_followers uf ON (uf.ref_id_u_receiver = u.id_unique) AND uf.status = true
  //                   WHERE u.email = ${email}
  //                   GROUP BY
  //                   u.first_name, u.last_name, u.role, u.public_id,
  //                   ud.username, ud.gender, ud.pict_url, ud.bio, ud.location, ud.phone_number`;

  // const querySocial: SocialLinkT[] = await prisma.$queryRaw`
  //       SELECT us.platform, us.social_link
  //       FROM users u
  //       LEFT JOIN users_social_link us ON (us.ref_id_u = u.id_unique)
  //       WHERE u.email = ${email}
  //     `;

  // const socialLink = querySocial
  //   .filter((row) => row.socialLink)
  //   .map((row) => ({ [row.platform]: row.social_link }));

  const output = userCheck.map((i) => ({
    firstName: i.first_name,
    lastName: i.last_name,
    publicId: i.public_id,
    role: i.role,
    created_at: i.created_at,
  }));

  return {
    ...output[0],
    token,
    refreshToken,
    // socialLink,
  };
};

export const LoginForAuthJs = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userCheck: UserCheckT[] =
    await prisma.$queryRaw`SELECT iu, email, password, first_name, last_name, role, public_id, created_at FROM users WHERE email = ${email}`;

  if (userCheck.length === 0) throw new Error("Invalid email or password");

  const passwordMatch = await bcrypt.compare(password, userCheck[0].password);
  if (!passwordMatch) throw new Error("Invalid email or password");

  return {
    publicId: userCheck[0].public_id,
    email: userCheck[0].email,
    name: `${userCheck[0].first_name} ${userCheck[0].last_name}`,
    role: userCheck[0].role,
    created_at: userCheck[0].created_at,
  };
};

// pnpm add -D @types/jsonwebtoken @types/bcrypt
