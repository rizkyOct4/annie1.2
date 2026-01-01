import { prisma } from "@/_lib/db";
import { cacheLife, cacheTag } from "next/cache";
import camelcaseKeys from "camelcase-keys";
import type {
  TAllCreators,
  TListCreatorVideo,
  TTargetCreatorsDescription,
} from "./type";

// * LIST CREATORS
export const GetAllCreators = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`all-creators`);

  const query =
    await prisma.$queryRaw<TAllCreators>`SELECT u.public_id, u.created_at, ud.username, ud.picture
    FROM users u
    LEFT JOIN users_description ud ON (ud.ref_id = u.id)
    ORDER BY u.created_at ASC
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  const amountUsers = await prisma.$queryRaw<
    {
      amount_users: number;
    }[]
  >`SELECT COALESCE(COUNT(id), 0) AS amount_users FROM users`;

  const hasMore = offset + limit < Number(amountUsers[0].amount_users);

  const data = camelcaseKeys(query);

  return {
    data,
    hasMore,
  };
};

// * CREATOR DESCRIPTION
export const GetTargetCreatorsDescription = async ({
  // selfId,
  idTargetCreator,
}: {
  // selfId: string;
  idTargetCreator: string;
}) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`target-creators-description-${idTargetCreator}`);

  const query = await prisma.$queryRaw<
    TTargetCreatorsDescription[]
  >`SELECT u.public_id, ud.username, ud.biodata, ud.gender, ud.phone_number AS "phoneNumber", ud.location, ud.picture, ud.social_link AS "socialLink", u.created_at,
    us.total_image AS "totalPhoto", us.total_video AS "totalVideo", us.total_followers AS "totalFollowers", COALESCE(uif.status, false) AS "statusFollow"
    FROM users u 
    LEFT JOIN users_description ud ON (ud.ref_id = u.id)
    JOIN users_stats us ON (us.ref_id_user = u.id)
    LEFT JOIN users_interactions_followers uif ON (uif.ref_id_receiver = (SELECT id FROM users WHERE public_id = ${idTargetCreator}))
    WHERE u.public_id = ${idTargetCreator}
    `;

  return camelcaseKeys(query);
};

// * LIST CREATOR PHOTO
export const GetListCreatorsProduct = async ({
  idTarget,
  idSender,
  limit,
  offset,
}: {
  idTarget: string;
  idSender: string;
  limit: number;
  offset: number;
}) => {
  const query = await prisma.$queryRaw<
    any[]
  >`SELECT upi.ref_id_product AS id_product, upi.description, upi.url, upi.hashtag, upi.category, up.created_at, ups.like AS total_like, ups.dislike AS total_dislike, uiv.action_vote::status_action_vote AS status
    FROM users u
    JOIN users_product up ON (up.ref_id = u.id)
    JOIN users_product_image upi ON (upi.ref_id_product = up.id_product)
    LEFT JOIN users_photo_stats ups ON (ups.ref_id_product = up.id_product)
    LEFT JOIN (
      SELECT ref_id_product, action_vote FROM users_interactions_vote WHERE ref_id_sender = (SELECT id FROM users WHERE public_id = ${idSender})
    ) uiv ON (uiv.ref_id_product = up.id_product)
    WHERE u.public_id = ${idTarget}
    GROUP BY
      upi.ref_id_product, upi.description, upi.url, upi.hashtag, upi.category, up.created_at, ups.like,ups.dislike,uiv.action_vote
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  if (!query) return [];

  const queryTotal = await prisma.$queryRaw<{ amount_products: number }[]>`
    SELECT COALESCE(COUNT(upi.ref_id_product), 0) AS amount_products 
    FROM users_product_image upi
    JOIN users_product up ON (up.id_product = upi.ref_id_product)
    JOIN users u ON (u.id = up.ref_id)
    WHERE u.public_id = ${idTarget}
    `;

  const hasMore = offset + limit < Number(queryTotal[0].amount_products);
  const data = camelcaseKeys(query);
  return { data, hasMore };
};

// * LIST CREATOR VIDEO
export const GetListCreatorsVideo = async ({
  idTarget,
  idSender,
  type,
  limit,
  offset,
}: {
  idTarget: string;
  idSender: string;
  type: string;
  limit: number;
  offset: number;
}) => {
  const query = await prisma.$queryRaw<TListCreatorVideo>`
    SELECT upv.ref_id_product AS id_product, upv.description, upv.url, upv.thumbnail_url, upv.duration, upv.hashtag, upv.category, up.created_at,
    COALESCE(uvs.like, 0) AS total_like, COALESCE(uvs.dislike, 0) AS total_dislike, uiv.action_vote::status_action_vote AS status
      FROM users_product_video upv
      JOIN users_product up ON (up.id_product = upv.ref_id_product)
      LEFT JOIN users_video_stats uvs ON (uvs.ref_id_product = up.id_product)
      LEFT JOIN (
        SELECT ref_id_product, action_vote FROM users_interactions_vote WHERE ref_id_sender = (SELECT id FROM users WHERE public_id = ${idSender})
      ) uiv ON (uiv.ref_id_product = up.id_product)
        WHERE up.ref_id = (SELECT id FROM users WHERE public_id = ${idTarget}) AND up.type = ${type}::type_product
      GROUP BY
      upv.ref_id_product, upv.description, upv.url, upv.hashtag, upv.category, upv.thumbnail_url, upv.duration, up.created_at, uvs.like, uvs.dislike, uiv.action_vote
    
    `;

  const checkAmount = await prisma.$queryRaw<{ amount_video: number }[]>`
    SELECT COALESCE(COUNT(id_product), 0) AS amount_video
    FROM users_product
    WHERE ref_id = (SELECT id FROM users WHERE public_id = ${idTarget}) AND type = ${type}::type_product
  `;

  const hasMore = offset + limit < Number(checkAmount[0].amount_video);

  const data = camelcaseKeys(query);

  return { data, hasMore };
};

// ? ACTIONS
export const PostLikeImage = async (
  id: string,
  refIdProduct: number,
  status: string,
  createdAt: Date
) => {
  return prisma.$transaction(async (tx) => {
    const queryCheck = await prisma.$queryRaw<
      { status: "like" | "dislike" | null }[]
    >`
        SELECT action_vote FROM users_interactions_vote WHERE ref_id_sender = (SELECT id FROM users WHERE public_id = ${id}) AND ref_id_product = ${refIdProduct} LIMIT 1
      `;
    if (queryCheck.length === 0) {
      await tx.$executeRaw`
          INSERT INTO users_interactions_vote (created_at, ref_id_product, ref_id_sender, action_vote)
          VALUES (${createdAt}::timestamp, ${refIdProduct},
          (SELECT id FROM users WHERE public_id = ${id}), ${status}::status_action_vote)
        `;
      // ? INSERT IMAGE STATS
      await tx.$executeRaw`
          INSERT INTO users_photo_stats (ref_id_product, "like", dislike)
          VALUES (${refIdProduct},
            CASE WHEN ${status} = 'like' THEN 1 ELSE 0 END,
            CASE WHEN ${status} = 'dislike' THEN 1 ELSE 0 END
          )
          ON CONFLICT (ref_id_product)
          DO UPDATE SET
            "like" = users_photo_stats."like" + CASE WHEN ${status} = 'like' THEN 1 ELSE 0 END,
            dislike = users_photo_stats.dislike + CASE WHEN ${status} = 'dislike' THEN 1 ELSE 0 END;
        `;

      // ? UPDATE USERS STATS
      await tx.$executeRaw`
          UPDATE users_stats SET
            total_like = users_stats.total_like + CASE WHEN ${status} = 'like'
          WHERE ref_id_user = (SELECT id FROM users WHERE public_id = ${id})
        `;
    } else {
      await tx.$executeRaw`
            UPDATE users_interactions_vote SET created_at = ${createdAt}::timestamp, action_vote = ${status}::status_action_vote
            WHERE ref_id_product = ${refIdProduct} AND ref_id_sender = (SELECT id FROM users WHERE public_id = ${id})
          `;
      // ! UPDATE IMAGE STATS
      await tx.$executeRaw`
          UPDATE users_photo_stats
          SET
            "like" = "like" + 
              CASE
                WHEN ${status} = 'like' THEN 1
                WHEN ${status} = 'dislike' THEN -1
                ELSE 0
              END,
            "dislike" = "dislike" +
              CASE
                WHEN ${status} = 'dislike' THEN 1
                WHEN ${status} = 'like' THEN -1
                ELSE 0
              END
          WHERE ref_id_product = ${refIdProduct};
        `;
      // ! UPDATE USERS STATS
      await tx.$executeRaw`
        UPDATE users_stats SET 
          total_like = 
            GREATEST(
              users_stats.total_like
              + CASE
                  WHEN ${status} = 'like' THEN 1
                  WHEN ${status} = 'dislike' THEN -1
                  ELSE 0
                END,
              0
            )
        WHERE ref_id_user = (SELECT id FROM users WHERE public_id = ${id})
      `;

      // ! "like" = ("like" + 1) -> nilai saat ini mau ditambah 1
      // ?   UPDATE users_photo_stats
      // ?  SET "like" = "like" + 1
      // ?  WHERE ref_id_product = 10;
      // ! ELSE 0 -> OPTIONAL
    }
  });
};

export const PostFollowUsers = async ({
  idSender,
  idReceiver,
  status,
}: {
  idSender: string;
  idReceiver: string;
  status: number;
}) => {
  return prisma.$transaction(async (tx) => {
    const queryCheck = await tx.$queryRaw<{ ref_id_sender: string }[]>`
      SELECT ref_id_sender FROM users_interactions_followers WHERE ref_id_sender = (SELECT id FROM users WHERE public_id = ${idSender})
    `;

    if (queryCheck.length === 0) {
      await tx.$executeRaw`
        INSERT INTO users_interactions_followers (ref_id_receiver, ref_id_sender, status)
        VALUES ((SELECT id FROM users WHERE public_id = ${idReceiver}), (SELECT id FROM users WHERE public_id = ${idSender}), ${status})
      `;
      // ! USERS STATS
      await tx.$executeRaw`
        INSERT INTO users_stats (ref_id_user, total_followers)
        VALUES ((SELECT id FROM users WHERE public_id = ${idReceiver}),
          CASE WHEN ${status} = true THEN 1 ELSE 0 END
        )
        ON CONFLICT (ref_id_user)
          DO UPDATE SET
          total_followers = users_stats.total_followers + CASE WHEN ${status} = true THEN 1 ELSE 0 END
      `;
    } else {
      await tx.$executeRaw`
        UPDATE users_interactions_followers SET status = ${status}
        WHERE ref_id_sender = (SELECT id FROM users WHERE public_id = ${idSender}) AND ref_id_receiver = (SELECT id FROM users WHERE public_id = ${idReceiver})
      `;
      // ? UPDATE USERS STATS
      await tx.$executeRaw`
        UPDATE users_stats SET 
          total_followers = users_stats.total_followers + CASE WHEN ${status} = false THEN -1 ELSE 0 END
        WHERE ref_id_user = (SELECT id FROM users WHERE public_id = ${idReceiver})
      `;
    }
  });
};
