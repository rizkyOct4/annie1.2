import { prisma } from "@/_lib/db";
import {
  CreatorsType,
  CreatorDescriptionType,
  ListCreatorProductType,
} from "./type";

// * LIST CREATORS
export const SCreators = async (publicId: string | undefined, limit: number, offset: number) => {
  const query = await prisma.$queryRaw<
    CreatorsType[]
  >`SELECT u.first_name, u.last_name, u.public_id, u.created_at, ud.username, ud.picture
    FROM users u
    LEFT JOIN users_description ud ON (ud.tar_iu = u.iu)
    WHERE u.public_id != ${publicId}::uuid
    ORDER BY u.created_at ASC
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  if (!query) return [];

  const queryTotal =
    await prisma.$queryRaw<any>`SELECT COUNT(*) AS count FROM users`;

  const hasMore = offset + limit < Number(queryTotal[0].count);

  const data = query.map((i) => ({
    firstName: i.first_name,
    lastName: i.last_name,
    publicId: i.public_id,
    createdAt: i.created_at,
    username: i.username,
    picture: i.picture,
  }));

  return {
    data,
    hasMore,
  };
};

// * CREATOR DESCRIPTION
export const SCreatorsDescription = async (publicIdCreator: string) => {
  const query = await prisma.$queryRaw<
    CreatorDescriptionType[]
  >`SELECT u.first_name, u.last_name, ud.username, ud.biodata, ud.gender, ud.picture, ud.social_link
    FROM users u 
    LEFT JOIN users_description ud ON (ud.tar_iu = u.iu)
    WHERE u.public_id = ${publicIdCreator}::uuid
    `;

  if (!query) return [];

  return query.map((i) => ({
    firstName: i.first_name,
    lastName: i.last_name,
    username: i.username,
    biodata: i.biodata,
    gender: i.gender,
    picture: i.picture,
    socialLink: i.social_link,
  }));
};

// * LIST CREATOR PRODUCT
export const SListCreatorProduct = async (
  targetIdPublic: string,
  publicId: string | undefined,
  limit: number,
  offset: number
) => {
  const [sender] = await prisma.$queryRaw<
    { iu: number }[]
  >`SELECT iu FROM users WHERE public_id = ${publicId}::uuid`;
  const senderIu = sender.iu;

  const query = await prisma.$queryRaw<
    ListCreatorProductType[]
  >`SELECT upi.tar_iu_product, upi.description, upi.url, upi.hashtag, upi.category, up.created_at, COALESCE(SUM(upiv.like), 0)::int AS total_like, COALESCE(SUM(upiv.dislike), 0)::int AS total_dislike, upio.status
    FROM users u
    JOIN users_product up ON (up.tar_iu = u.iu)
    JOIN users_product_image upi ON (upi.tar_iu_product = up.iu_product)
    LEFT JOIN users_product_image_vote upiv ON (upiv.tar_iu_product = up.iu_product)
    LEFT JOIN (
      SELECT status, tar_iu_product
      FROM users_product_image_vote
      WHERE tar_iu_sender = ${senderIu}
    ) upio on (up.iu_product = upio.tar_iu_product)
    WHERE u.public_id = ${targetIdPublic}::uuid
    GROUP BY
      upi.tar_iu_product, upi.description, upi.url, upi.hashtag, upi.category, up.created_at, upio.status
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  if (!query) return [];

  const queryTotal =
    await prisma.$queryRaw<any>`SELECT COUNT(*) AS count FROM users_product_image`;

  const hasMore = offset + limit < Number(queryTotal[0].count);

  const data = query.map((i) => ({
    iuProduct: i.tar_iu_product,
    description: i.description,
    url: i.url,
    hashtag: i.hashtag,
    category: i.category,
    createdAt: i.created_at,
    totalLike: i.total_like,
    totalDislike: i.total_dislike,
    status: i.status,
  }));

  return { data, hasMore };
};

export const PostLikeImage = async (
  publicId: string | undefined,
  iuVote: number,
  tarIuReceiver: number,
  tarIuProduct: number,
  like: number,
  status: boolean,
  createdAt: Date
) => {
  try {
    return prisma.$transaction(async (tx) => {
      const [senderIu] = await tx.$queryRaw<
        { iu: number }[]
      >`SELECT iu FROM users WHERE public_id = ${publicId}::uuid LIMIT 1`;
      const [receiverIu] = await tx.$queryRaw<
        { iu: number }[]
      >`SELECT iu FROM users WHERE public_id = ${tarIuReceiver}::uuid LIMIT 1`;
      const sender = senderIu.iu;
      const receiver = receiverIu.iu;

      await tx.$executeRaw`INSERT INTO users_product_image_vote (tar_iu_sender, tar_iu_receiver, tar_iu_product, iu_vote, "like", status, created_at) 
      VALUES (${sender}, ${receiver}, ${tarIuProduct}, ${iuVote}, ${like}, ${status}, ${createdAt}::timestamp)`;
    });
  } catch (err: any) {
    throw new Error(err.message || "Insert failed");
  }
};