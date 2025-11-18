from fastapi import HTTPException
from models.database import get_connection, get_cursor, check_connection
from pydantic import BaseModel
import random
from typing import Optional
import cloudinary.uploader
import os
from datetime import datetime
from PIL import Image
from io import BytesIO


class GetAllCategories:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def get_categories(self, cursor):
        try:
            all_categories = []
            all_categories_ref = [
                "Photography",
                "Videography",
                "Digital Art",
                "Architecture",
                "Fashion",
                "Nature",
                "Food & Drink",
                "Automotive",
                "Astrophotography",
                "Mobile Shots",
                "Travel",
                "Creative Concepts",
                "Lifestyle & People",
                "Behind The Scenes",
                ]
            
            query_categories = '''
            SELECT upc.categories, COUNT(upc.categories) AS total_categories
            FROM users_product up
            LEFT JOIN product_image_categories upc ON (up.id_unique_product = upc. ref_id_u_product)
            GROUP BY upc.categories
            '''
            cursor.execute(query_categories)
            result = cursor.fetchall()
            
            # ? hasil dari result dijadikan variable
            db_dict = {row["categories"]: row["total_categories"] for row in result}
            
            # ? BENTUK UMUM => dict_obj.get(key, default_value) 
            
            for categories in all_categories_ref:
                total_categories = db_dict.get(categories, 0) 
                # ! ← ambil dari hasil query, jika tidak ada → 0
                # ? .get(categories => memcocokkan hasil db_dict ke referensi, kalau ada kembalikan nilainya, jika tidak ada KEMBALIKAN NILAI VALUE 0 !!)
                # ? .get() => MENGEMBALIKAN NILAI VALUE AJA !!!!! 
                all_categories.append({
                    'categories' : categories,
                    'total_categories' : total_categories,
                })
            
            return all_categories
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


class GetSubCategories:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    
    def get_filter_data(self, cursor, active_data, id_unique_creator):
        try:
            all_data = []
            query_filter = '''
            SELECT u.id_unique AS creator_id_unique, upc.ref_id_u_product AS id_unique_product, pi.description, up.created_at, pi.image_url, ud.pict_url AS creator_picture, us.status_read
            FROM product_image_categories upc
            JOIN users_product up ON (up.id_unique_product = upc.ref_id_u_product)
            JOIN product_image pi ON (up.id_unique_product = pi.ref_id_u_product)
            JOIN users u ON (u.id_unique = upc.ref_id_u_user)
            LEFT JOIN users_description ud ON (ud.ref_id_u = u.id_unique)
            LEFT JOIN (
                SELECT ref_id_u_product, categories, status_read
                FROM users_static
                WHERE ref_id_u_users = %s
            ) AS us ON us.categories = upc.categories AND us.ref_id_u_product = upc.ref_id_u_product
            WHERE upc.categories = %s
            '''
            cursor.execute(query_filter, (id_unique_creator, active_data))
            result = cursor.fetchall()
            
            for row in result:
                date_string = row['created_at']
                formatted_date = date_string.strftime("%d %B %Y")
                all_data.append({
                    'creator_id_unique': row['creator_id_unique'],
                    'id_unique_product': row['id_unique_product'],
                    'description': row['description'],
                    'image_url': row['image_url'],
                    'status_read': row['status_read'],
                    'creator_picture': row['creator_picture'],
                    'created_at': formatted_date
                })
            return all_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# * UPDATE STATUS ========
class UpdateStatusCategoriesModel(BaseModel):
    id_unique_product: int
    categories: str
    status_read: int
    read_at: datetime

class UpdateStatusCategories:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def insert_static(self, cursor, data: UpdateStatusCategoriesModel, id_unique_creator):
        try:
            query_insert_static = '''
                SELECT status_read FROM users_static
                WHERE ref_id_u_users = %s AND ref_id_u_product = %s AND categories = %s
            '''
            cursor.execute(query_insert_static, (id_unique_creator, data.id_unique_product, data.categories))
            result_check_static = cursor.fetchone()
            
            if not result_check_static:
                insert = '''
                INSERT INTO users_static (ref_id_u_users, ref_id_u_product, categories, status_read, read_at) VALUES (%s,%s,%s,%s,%s)
                '''
                cursor.execute(insert, (id_unique_creator, data.id_unique_product, data.categories, data.status_read, data.read_at))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * SPESIFIC PRODUCT ========
class GetSubSpesificProduct:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def get_spesific (self, cursor, id_unique_user, id_unique_product, categories, creator_id_unique):
        try:
            # ? => COALESCE 0 => jika hasil null pakai coalesce
            spesific_data = []
            query_check = '''
                SELECT ups.total_read, COALESCE(upv.total_like, 0) AS total_like, COALESCE(upv.total_dislike, 0) AS total_dislike, up.id_unique_product, u.id_unique AS creator_id_unique, COALESCE(uf.status, 0) AS status_follow, COALESCE(upb.status, 0) AS bookmark_status, COALESCE(upc.total_comment, 0) AS total_comment
                FROM users_product up
                LEFT JOIN (
                    SELECT ref_id_u_product,
                    COALESCE(SUM(like_count), 0) AS total_like,
                    COALESCE(SUM(dislike_count), 0) AS total_dislike
                    FROM product_image_vote
                    GROUP BY ref_id_u_product
                    ) AS upv ON (upv.ref_id_u_product = up.id_unique_product)
                LEFT JOIN (
                    SELECT ref_id_u_product, COUNT(ref_id_u_product) AS total_read
                    FROM users_static
                    WHERE ref_id_u_product = %s AND categories = %s
                    GROUP BY ref_id_u_product, categories
                    ) AS ups ON ups.ref_id_u_product = up.id_unique_product
                JOIN users u ON (u.id_unique = up.ref_id_u) AND u.id_unique = %s
                LEFT JOIN users_followers uf ON u.id_unique = uf.ref_id_u_receiver AND uf.ref_id_u_sender = %s
                LEFT JOIN product_image_bookmark upb ON upb.ref_id_u_product = up.id_unique_product AND upb.ref_id_u_users = %s AND upb.ref_id_u_product = %s
                LEFT JOIN (
                    SELECT ref_id_u_product, COUNT(text) AS total_comment
                    FROM product_image_comment
                    WHERE ref_id_u_product = %s IS NOT NULL
                    GROUP BY ref_id_u_product
                    ) AS upc ON (upc.ref_id_u_product = up.id_unique_product)
                WHERE up.id_unique_product = %s
            '''
            cursor.execute(query_check, (id_unique_product, categories, creator_id_unique, id_unique_user, id_unique_user, id_unique_product, id_unique_product, id_unique_product))
            result = cursor.fetchone()
            
            if result:
                spesific_data.append({
                    'creator_id_unique': result['creator_id_unique'],
                    'bookmark_status': result['bookmark_status'],
                    'id_unique_product': result['id_unique_product'],
                    'status_follow': result['status_follow'],
                    'total_read': result['total_read'],
                    'total_like': result['total_like'],
                    'total_dislike': result['total_dislike'],
                    'total_comment': result['total_comment']
                })
            return spesific_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * UPDATE VOTE PRODUCT ========
class SpesificVotedModel(BaseModel):
    receiver_creator_id_unique : int
    id_unique_product : int
    voted_type : str
    created_at : datetime

class SpesificVoted:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    
    def update(self, cursor, data : SpesificVotedModel, id_unique_creator):
        try:
            receiver_creator_id_unique = data.receiver_creator_id_unique
            ref_id_u_product = data.id_unique_product
            voted_type = data.voted_type
            created_at = data.created_at
            
            query_select = '''
            SELECT like_count, dislike_count FROM product_image_vote WHERE ref_id_u_sender = %s AND ref_id_u_product = %s
            '''
            cursor.execute(query_select, (id_unique_creator, ref_id_u_product))
            # ini mengembalikan jumlah dari like_count dan dislike
            existed = cursor.fetchone()
            
            if existed:
                like_count = existed['like_count']
                dislike_count = existed['dislike_count']
                
                if (voted_type == "like" and like_count > 0) or (voted_type == "dislike" and dislike_count > 0):
                    raise HTTPException(status_code=400, detail="Already give vote")
                
                # ! pengkondisian kau perbaiki lagi !!!
                like = like_count + (1 if voted_type == "like" else -1)
                dislike = dislike_count + (1 if voted_type == "dislike" else -1)

                query_update = '''
                UPDATE product_image_vote SET like_count = %s, dislike_count = %s, created_at = %s WHERE ref_id_u_sender = %s AND ref_id_u_product = %s
                '''
                cursor.execute(query_update, (like, dislike, created_at,id_unique_creator, ref_id_u_product))
            else:
                like_count = 1 if voted_type == "like" else 0
                dislike_count = 1 if voted_type == "dislike" else 0

                query_select_receiver_email = '''
                    SELECT email
                    FROM users WHERE id_unique = %s
                    LIMIT 1
                '''
                cursor.execute(query_select_receiver_email, (receiver_creator_id_unique,))
                result_receiver_email = cursor.fetchone()
                
                query_insert = '''
                INSERT INTO product_image_vote (ref_id_u_sender, ref_id_u_receiver, ref_id_u_product, like_count, dislike_count, created_at) VALUES (%s,%s,%s,%s,%s,%s)
                '''
                cursor.execute(query_insert, (id_unique_creator, receiver_creator_id_unique, ref_id_u_product, like_count, dislike_count, created_at))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * REPORT ========
class ReportModel(BaseModel):
    id_unique_report: int
    creator_id_unique : int
    disc_id_post_report: Optional[int]
    image_id_post_report: Optional[int]
    text_report: str
    type_post_report: Optional[str]
    status: Optional[str]
    created_at: datetime

class ProductImageReport:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    
    def insert_report(self, cursor, data: ReportModel, id_unique_creator_sender):
        try:
            id_unique_report = data.id_unique_report
            ref_id_u_receiver = data.creator_id_unique
            ref_id_u_image = data.image_id_post_report
            text = data.text_report
            type_post_report = data.type_post_report
            status = data.status
            created_at = data.created_at

            query_check = '''
                SELECT COUNT(*) FROM users_report_image
                WHERE ref_id_u_sender = %s AND ref_id_u_receiver = %s AND ref_id_u_image = %s
            '''
            cursor.execute(query_check, (id_unique_creator_sender, ref_id_u_receiver, ref_id_u_image))
            result = cursor.fetchone()[0]

            if result >= 1:
                raise HTTPException(status_code=403, detail="Sorry, Cannot Report Anymore!")
            else:
                # ? users_report DB =====
                query_users_report = '''
                    INSERT INTO users_report (ref_id_u_sender_report, id_unique_report, type, created_at) VALUES (%s,%s,%s,%s)
                '''
                cursor.execute(query_users_report, (id_unique_creator_sender,id_unique_report, type_post_report, created_at))
                
                # ? users_report_image DB =====
                query_users_report_image = '''
                    INSERT INTO users_report_image (ref_id_u_sender, ref_id_u_receiver, ref_id_u_image, ref_id_u_report, text, status, change_status_at) VALUES (%s,%s,%s,%s,%s,%s,%s), (%s,%s,%s,%s,%s,%s,%s)'''
                cursor.execute(query_users_report_image, (id_unique_creator_sender, ref_id_u_receiver, ref_id_u_image, id_unique_report, text, 'read', created_at,
                id_unique_creator_sender, ref_id_u_receiver, ref_id_u_image, id_unique_report, text, status, None))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * BOOKMARK ========
class BookmarkModel(BaseModel):
    ref_id_u_product: int
    status: int
    created_at: datetime
    actionType: str

class AddOrDelBookmark:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def insert_bookmark(self, cursor, data: BookmarkModel, id_unique_creator):
        try:
            query_check = '''
                SELECT ref_id_u_users, ref_id_u_product, status FROM product_image_bookmark WHERE ref_id_u_users = %s AND ref_id_u_product = %s
            '''
            cursor.execute(query_check, (id_unique_creator, data.ref_id_u_product))
            result = cursor.fetchone()
            if result:
                if result["status"] == 0:
                    status_now = 1
                else:
                    status_now = 0
                
                query_update = '''
                    UPDATE product_image_bookmark SET ref_id_u_users = %s, ref_id_u_product = %s, status = %s, created_at = %s WHERE ref_id_u_users = %s AND ref_id_u_product = %s
                '''
                cursor.execute(query_update, (id_unique_creator, data.ref_id_u_product, status_now, data.created_at, id_unique_creator, data.ref_id_u_product))
            else:
                query_insert = '''
                    INSERT INTO product_image_bookmark (ref_id_u_users, ref_id_u_product, status, created_at) VALUES (%s,%s,%s,%s)
                '''
                cursor.execute(query_insert, (id_unique_creator, data.ref_id_u_product, data.status, data.created_at))

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * FOLLOW ========
class FollowModel(BaseModel):
    id_unique_product: int
    receiver_creator_id_unique: int
    status_follow: int
    update_at: datetime
    actionType: str

class AddOrPutFollow:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def insert_follow(self, cursor, data: FollowModel, id_unique_creator):
        try:
            query_check = '''
                SELECT ref_id_u_sender, ref_id_u_receiver, status FROM users_followers WHERE ref_id_u_sender = %s AND ref_id_u_receiver = %s
            '''
            cursor.execute(query_check, (id_unique_creator, data.receiver_creator_id_unique))
            result = cursor.fetchone()
            
            if result:
                if result['status'] == 1:
                    status_now = 0
                else:
                    status_now = 1

                query_update = '''
                    UPDATE users_followers SET status = %s, created_at = %s
                    WHERE ref_id_u_sender = %s AND ref_id_u_receiver = %s
                '''
                cursor.execute(query_update, (status_now, data.update_at, id_unique_creator, data.receiver_creator_id_unique))
            else:
                query_insert = '''
                    INSERT INTO users_followers (ref_id_u_sender, ref_id_u_receiver, status, created_at) VALUES (%s,%s,%s,%s)
                '''
                cursor.execute(query_insert, (id_unique_creator, data.receiver_creator_id_unique, data.status_follow, data.update_at))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * COMMENT ========
class GetSpesificComments:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def get_spesific_comments(self, cursor, id_unique_product):
        try:
            all_comments = []
            
            query_select = '''
                SELECT
                u.id_unique AS creator_id_unique, u.first_name, pc.text, pc.id_unique_cm, ud.pict_url, COALESCE(psb.other_reply, 0) AS other_reply
                FROM product_image_comment pc
                JOIN users u ON (u.id_unique = pc.ref_id_u_sender)
                LEFT JOIN users_description ud ON (ud.ref_id_u = u.id_unique)
                LEFT JOIN(
                    SELECT ref_id_unique_cm, COALESCE(COUNT(ref_id_unique_cm), 0) AS other_reply
                    FROM product_image_sub_comment
                    GROUP BY ref_id_unique_cm
                ) psb ON (psb.ref_id_unique_cm = pc.id_unique_cm)
                WHERE pc.ref_id_u_product = %s
            '''
            cursor.execute(query_select, (id_unique_product,))
            result = cursor.fetchall()
            
            for row in result:
                all_comments.append({
                    'creator_id_unique': row['creator_id_unique'],
                    'first_name': row['first_name'],
                    'pict_url': row['pict_url'],
                    'id_unique_cm': row['id_unique_cm'],
                    'text': row['text'],
                    'other_reply': row['other_reply']
                })
            return all_comments
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * POST COMMENT ========
class PostCommentModel(BaseModel):
    ref_id_u_product: int
    id_unique_cm: int
    text: str
    created_at: datetime

class PostNewComment:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def post_comment(self, cursor, data: PostCommentModel, id_unique_sender):
        try:
            query_insert = '''
                INSERT INTO product_image_comment (ref_id_u_sender, ref_id_u_product, id_unique_cm, text, created_at) VALUES (%s,%s,%s,%s,%s)
            '''
            cursor.execute(query_insert, (id_unique_sender, data.ref_id_u_product, data.id_unique_cm, data.text, data.created_at))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    def get_comment(self, cursor, data: PostCommentModel, id_unique_sender):
        try:
            query_select = '''
                SELECT
                u.first_name, pc.text, pc.id_unique_cm, ud.pict_url
                FROM product_image_comment pc
                JOIN users u ON (u.id_unique = pc.ref_id_u_sender)
                LEFT JOIN users_description ud ON (ud.ref_id_u = u.id_unique)
                WHERE id_unique_cm = %s AND ref_id_u_product = %s AND ref_id_u_sender = %s
            '''
            cursor.execute(query_select, (data.id_unique_cm, data.ref_id_u_product, id_unique_sender))
            result = cursor.fetchone()
            
            if result:
                return ({
                    'first_name': result['first_name'],
                    'pict_url': result['pict_url'],
                    'id_unique_cm': result['id_unique_cm'],
                    'text': result['text'],
                })
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * SUB COMMENT ========
class GetSubComments:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def get_sub_comment(self, cursor, parent_creator_id_unique, id_unique_comment):
        try:
            all_sub_comment = []
            query_select = '''
                SELECT
                sender.id_unique AS sender_id_unique,
                sender.first_name AS sender_first_name,
                receiver.id_unique AS receiver_id_unique,
                receiver.first_name AS receiver_first_name,
                psc.id_unique_sub_cm, psc.text, psc.status_edit, 
                desc_sender.pict_url AS sender_pict_url
                FROM product_image_sub_comment psc
                JOIN (
                    SELECT ref_id_u_sender, id_unique_cm
                    FROM product_image_comment
                    WHERE ref_id_u_sender = %s
                    ) pc ON psc.ref_id_unique_cm = pc.id_unique_cm
                JOIN users sender ON (psc.ref_id_u_sender = sender.id_unique)
                LEFT JOIN users receiver ON (psc.ref_id_u_receiver = receiver.id_unique)
                LEFT JOIN users_description desc_sender ON (desc_sender.ref_id_u = psc.ref_id_u_sender)
                LEFT JOIN users_description desc_receiver ON (desc_receiver.ref_id_u = psc.ref_id_u_receiver)
                WHERE psc.ref_id_unique_cm = %s
                ORDER BY psc.created_at ASC
            '''
            cursor.execute(query_select, (parent_creator_id_unique, id_unique_comment))
            result = cursor.fetchall()
            
            if result:
                for row in result:
                    all_sub_comment.append({
                        "sender_id_unique" : row['sender_id_unique'],
                        "sender_first_name" : row['sender_first_name'],
                        "receiver_id_unique" : row['receiver_id_unique'],
                        "receiver_first_name" : row['receiver_first_name'],
                        "id_unique_sub_cm" : row['id_unique_sub_cm'],
                        "text" : row['text'],
                        "sender_pict_url" : row['sender_pict_url'],
                        "status" : row['status_edit']
                    })
            return all_sub_comment
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * POST SUB COMMENT ========
class PostSubCommentModel(BaseModel):
    ref_id_u_receiver: Optional[int]
    ref_id_unique_cm: int
    id_unique_sub_cm: int
    text: str
    status: int
    created_at: datetime


class PostNewSubComment:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def post_sub_comment(self, cursor, data: PostSubCommentModel, id_unique_sender):
        try:
            query_insert = '''
                INSERT INTO product_image_sub_comment (ref_id_u_sender, ref_id_u_receiver, ref_id_unique_cm, id_unique_sub_cm, text, created_at, status_edit) VALUES (%s,%s,%s,%s,%s,%s,%s)
            '''
            cursor.execute(query_insert, (id_unique_sender, data.ref_id_u_receiver, data.ref_id_unique_cm, data.id_unique_sub_cm, data.text, data.created_at, data.status))
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    def output_post_sub_comment(self, cursor, data: PostSubCommentModel):
        try:
            query_select = '''
                SELECT
                sender.id_unique AS sender_id_unique,
                sender.first_name AS sender_first_name,
                receiver.id_unique AS receiver_id_unique,
                receiver.first_name AS receiver_first_name,
                psc.id_unique_sub_cm, psc.text, psc.status_edit, 
                desc_sender.pict_url AS sender_pict_url
                FROM product_image_sub_comment psc
                JOIN users sender ON (psc.ref_id_u_sender = sender.id_unique)
                JOIN users receiver ON (psc.ref_id_u_receiver = receiver.id_unique)
                LEFT JOIN users_description desc_sender ON (desc_sender.ref_id_u = psc.ref_id_u_sender)
                LEFT JOIN users_description desc_receiver ON (desc_receiver.ref_id_u = psc.ref_id_u_receiver)
                WHERE psc.id_unique_sub_cm = %s
            '''
            cursor.execute(query_select, (data.id_unique_sub_cm, ))
            result = cursor.fetchone()
            
            if result:
                return ({
                    "sender_id_unique" : result['sender_id_unique'],
                    "sender_first_name" : result['sender_first_name'],
                    "receiver_id_unique" : result['receiver_id_unique'],
                    "receiver_first_name" : result['receiver_first_name'],
                    "id_unique_sub_cm" : result['id_unique_sub_cm'],
                    "text" : result['text'],
                    "sender_pict_url" : result['sender_pict_url'],
                    "status" : result['status_edit']
                })
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


class UpdataSubCommentModel(BaseModel):
    ref_id_u_receiver: int
    ref_id_unique_cm: int
    id_unique_sub_cm: int
    text: str
    created_at: datetime
    status: int
    type_action: str

class UpdateSubComment:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    def update(self, cursor, data: UpdataSubCommentModel, id_unique_sender):
        try:
            query_update = '''
                UPDATE product_image_sub_comment SET text = %s, created_at = %s, status_edit = %s WHERE ref_id_u_sender = %s AND ref_id_u_receiver = %s AND ref_id_unique_cm = %s AND id_unique_sub_cm = %s
            '''
            cursor.execute(query_update, (data.text, data.created_at, data.status, id_unique_sender, data.ref_id_u_receiver, data.ref_id_unique_cm, data.id_unique_sub_cm))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))



