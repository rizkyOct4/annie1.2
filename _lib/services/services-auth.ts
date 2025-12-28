import { prisma } from "@/_lib/db";
import bcrypt from "bcrypt";
import camelcaseKeys from "camelcase-keys";
import type { TRegisterResultOAuth } from "./schema-auth";
import { nanoid } from "nanoid";

export const CredentialRegister = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  gender,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const username = `${firstName} ${lastName}`;
    const publicId = nanoid(8);

    const [userDb] = await tx.$queryRaw<
      { id: string }[]
    >`INSERT INTO users (first_name, last_name, email, password, role, public_id) VALUES 
      (${firstName}, ${lastName}, ${email}, ${passwordHash}, ${role}::user_role, ${publicId}) RETURNING id`;

    await tx.$executeRaw`INSERT INTO users_description (ref_id, username, gender) VALUES (${userDb.id}::uuid, ${username}, ${gender}::user_gender)`;
  });
};

export const OAuthRegister = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  gender,
  fullname,
  picture,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string | undefined;
  role?: string | undefined;
  gender?: string | undefined;
  fullname?: string | undefined;
  picture?: string | undefined;
}) => {
  const queryCheck = await prisma.$queryRaw<{ email: string }[]>`
      SELECT email from users
      WHERE email = ${email}
    `;
  const publicId = nanoid(8);

  if (queryCheck.length < 1) {
    // * Credential
    prisma.$transaction(async (tx) => {
      const username = `${firstName} ${lastName}`;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [userDb] = await tx.$queryRaw<
          { id: string }[]
        >`INSERT INTO users (first_name, last_name, email, password, role, public_id)
        VALUES (${firstName}, ${lastName}, ${email}, ${passwordHash}, ${role}::user_role, ${publicId}) RETURNING id`;

        await tx.$executeRaw`INSERT INTO users_description (ref_id, username, gender) VALUES (${userDb.id}::uuid, ${username}, ${gender}::user_gender)`;
      } else {
        // * OAuth
        const [userDb] = await tx.$queryRaw<{ id: string }[]>`
            INSERT INTO users (first_name, last_name, email, public_id) VALUES
            (${firstName}, ${lastName}, ${email}, ${publicId}) RETURNING id`;
        
            await tx.$executeRaw`
            INSERT INTO users_description (ref_id, username, picture) VALUES
            (${userDb.id}::uuid, ${fullname}, ${picture})`;
      }
    });
  }

  const result = await prisma.$queryRaw<TRegisterResultOAuth>`
      SELECT u.id, u.role, u.created_at, u.public_id, ud.picture
      FROM users u
      LEFT JOIN users_description ud ON (ud.ref_id = u.id)
      WHERE u.email = ${email}`;

  return camelcaseKeys(result);
};

export const CredentialsLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userCheck: any[] =
    await prisma.$queryRaw`SELECT id, public_id, email, password, first_name, last_name, role, created_at FROM users WHERE email = ${email}`;

  if (userCheck.length === 0) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const passwordMatch = await bcrypt.compare(password, userCheck[0].password);

  if (!passwordMatch) {
    return {
      success: false,
      message: "Invalid password",
    };
  }

  const rawData = {
    id: userCheck[0].id,
    publicId: userCheck[0].public_id,
    email: userCheck[0].email,
    name: `${userCheck[0].first_name} ${userCheck[0].last_name}`,
    role: userCheck[0].role,
    createdAt: userCheck[0].created_at,
  };

  return {
    success: true,
    user: camelcaseKeys(rawData),
  };
};