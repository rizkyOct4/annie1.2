from fastapi import HTTPException
from models.database import get_connection, get_cursor, check_connection
from itsdangerous import URLSafeTimedSerializer
from pydantic import BaseModel
import os
from datetime import datetime
from typing import Optional


# STILL ??? !!! u must find tf out !!
from PIL import Image
from io import BytesIO
import cloudinary.uploader


# * ====================== GET =======================
class GetProducts:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    
    def get_product(self, cursor, id_unique):
        try:
            all_product = []
            query = '''
            SELECT
                up.id_unique_product,
                pi.description,
                pi.image_url,
                up.created_at,
                COALESCE(SUM(pv.like_count), 0) AS like_count,
                COALESCE(SUM(pv.dislike_count), 0) AS dislike_count,
                COALESCE(COUNT(pb.ref_id_u_product), 0) AS bookmark_count,
                uh.hashtag, upc.categories
            FROM users_product up
            JOIN product_image pi ON (pi.ref_id_u_product = up.id_unique_product)
            JOIN users u ON (u.id_unique = up.ref_id_u)
            LEFT JOIN product_image_vote pv ON (pv.ref_id_u_product = up.id_unique_product)
            LEFT JOIN product_image_bookmark pb ON (pb.ref_id_u_product = up.id_unique_product)
            LEFT JOIN (
                SELECT 
                    ref_id_u_users,
                    ref_id_u_product,
                    GROUP_CONCAT(hashtag) AS hashtag
                FROM product_image_hashtag
                WHERE ref_id_u_users = %s
                GROUP BY ref_id_u_users, ref_id_u_product
            ) AS uh ON up.ref_id_u = uh.ref_id_u_users AND up.id_unique_product = uh.ref_id_u_product
            LEFT JOIN (
                SELECT ref_id_u_product,
                GROUP_CONCAT(categories) AS categories
                FROM product_image_categories
                GROUP BY ref_id_u_product
            ) AS upc ON upc.ref_id_u_product = up.id_unique_product
            WHERE up.ref_id_u = %s
            GROUP BY up.id_unique_product, pi.description, pi.image_url
            '''
            cursor.execute(query, (id_unique, id_unique))
            result = cursor.fetchall()

            for row in result:
                # ? hashtag
                raw_hashtag = row.get('hashtag')
                array_hash = raw_hashtag.split(",") if raw_hashtag else []
                
                # ? categories
                raw_categories = row.get('categories')
                array_categories = raw_categories.split(",") if raw_categories else []
                
                if 'hashtag' and 'categories' in row:
                    del row['hashtag']
                    del row['categories']
                
                date_string = row['created_at']
                formatted_date = date_string.strftime("%d %B %Y")
                all_product.append({
                    'id_unique_product' : row['id_unique_product'],
                    'description' : row['description'],
                    'hashtags' : array_hash,
                    'categories' : array_categories,
                    'like_count' : row['like_count'],
                    'dislike_count' : row['dislike_count'],
                    'bookmark_count' : row['bookmark_count'],
                    'image_url' : row['image_url'],
                    'created_at': formatted_date 
                })
            return all_product
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# * ====================== POST =======================
class PostModel(BaseModel):
    id_unique_product : int
    description : str
    image_name : str
    image_path : str
    created_at : datetime
    categories : Optional[list[str]]
    hashtags : Optional[list[str]]
    type_data: str

class Post:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)

    async def save_image(self, cursor, email_user, image_name, image_binary):
        try:
            # Ubah ke .webp
            image_name = os.path.splitext(image_name)[0] + '.webp'

            query_select_double = 'SELECT image_name FROM product_image WHERE image_name = %s'
            cursor.execute(query_select_double, (image_name,))
            double_img = cursor.fetchall()

            if double_img:
                raise HTTPException(status_code=404, detail="Photos already exists")

            # Resize dan convert ke WEBP
            img = Image.open(BytesIO(image_binary)) # ? membuka gambar dari data biner.
            max_size = (800, 800) 
            img.thumbnail(max_size) # ? resize gambar supaya ukuran maksimal 800x800 (tanpa memotong).

            # ! hasil akhir dari foto yg masuk ke cloud ini !!!!
            buffer = BytesIO() # ? buat wadah kosong di RAM.
            img.save(buffer, format="WEBP", quality=85) # ? simpan hasil ke buffer dalam format WEBP.
            buffer.seek(0) # ? reset posisi buffer ke awal agar bisa dibaca saat upload.

            # ! ALURNYA 
            # *1 buffer = BytesIO()               # Buat wadah kosong
            # *2 img.save(buffer, format="WEBP")  # Simpan gambar hasil olahan ke dalam buffer
            # *3 buffer.seek(0)                   # Kembali ke posisi awal (biar bisa dibaca saat upload)


            # Upload ke Cloudinary
            result = cloudinary.uploader.upload(
                buffer,
                folder=f"users_product/{email_user}/", # ? folder tujuan/ sub
                public_id=image_name, # ? valuenya
                resource_type="image" # ? type
            )

            # Kembalikan URL secure dari image di Cloudinary
            # ? kenapa pakai "secure_url" ?? karena HTTPS lebih aman, Cocok dipakai di frontend (gambar tampil di website), Cocok dipakai di frontend (gambar tampil di website)
            return result["secure_url"]
        except HTTPException as e:
            raise HTTPException(status_code=500, detail=str(e))

    def insert(self, cursor, data: PostModel, url, email_user, id_unique_creator):
        try:
            image_name = os.path.splitext(data.image_name)[0] + '.webp'  # ?Mengganti ekstensi menjadi .webp

            # * PARENT PRODUCT IMAGE
            query_product_parent = '''
                INSERT INTO users_product (ref_id_u, id_unique_product, type,created_at) VALUES (%s,%s,%s,%s)'''
            cursor.execute(query_product_parent, (id_unique_creator, data.id_unique_product, data.type_data, data.created_at))
            
            # * PRODUCT IMAGE
            query_product_image = '''
                INSERT INTO product_image (ref_id_u_product, description, image_name, image_url) VALUES (%s,%s,%s,%s)'''
            cursor.execute(query_product_image, (data.id_unique_product, data.description, image_name, url))
            
            # * PRODUCT CATEGORIES
            query_categories = '''
                INSERT INTO product_image_categories (ref_id_u_user, ref_id_u_product, categories, created_at) VALUES (%s,%s,%s,%s)
            '''
            category_values = [(id_unique_creator, data.id_unique_product, category, data.created_at) for category in data.categories]
            cursor.executemany(query_categories, category_values)
            
            query_hashtags = '''
                INSERT INTO product_image_hashtag ( ref_id_u_users, ref_id_u_product, hashtag, created_at) VALUES (%s,%s,%s,%s)
            '''
            hashtag_values = [(id_unique_creator, data.id_unique_product, hashtag, data.created_at) for hashtag in data.hashtags]
            cursor.executemany(query_hashtags, hashtag_values)
            
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    def result_post(self, cursor, data: PostModel, id_unique_creator):
        try:
            query_select = '''
            SELECT
                u.id_unique AS id_unique_user,
                up.id_unique_product,
                pi.description,
                pi.image_url,
                up.created_at,
                COALESCE(SUM(pv.like_count), 0) AS like_count,
                COALESCE(SUM(pv.dislike_count), 0) AS dislike_count,
                COALESCE(COUNT(pb.ref_id_u_product), 0) AS bookmark_count,
                uh.hashtag, upc.categories
            FROM users_product up
            JOIN product_image pi ON (pi.ref_id_u_product = up.id_unique_product)
            JOIN users u ON (u.id_unique = up.ref_id_u)
            LEFT JOIN product_image_vote pv ON (pv.ref_id_u_product = up.id_unique_product)
            LEFT JOIN product_image_bookmark pb ON (pb.ref_id_u_product = up.id_unique_product)
            LEFT JOIN (
                SELECT 
                    ref_id_u_users,
                    ref_id_u_product,
                    GROUP_CONCAT(hashtag) AS hashtag
                FROM product_image_hashtag
                WHERE ref_id_u_users = %s AND ref_id_u_product = %s
                GROUP BY ref_id_u_users, ref_id_u_product
            ) AS uh ON up.ref_id_u = uh.ref_id_u_users AND up.id_unique_product = uh.ref_id_u_product
            LEFT JOIN (
                SELECT ref_id_u_product,
                GROUP_CONCAT(categories) AS categories
                FROM product_image_categories
                WHERE ref_id_u_product = %s
                GROUP BY ref_id_u_product
            ) AS upc ON upc.ref_id_u_product = up.id_unique_product
            WHERE up.id_unique_product = %s
            GROUP BY up.id_unique_product, pi.description, pi.image_url
            '''
            cursor.execute(query_select, (id_unique_creator, data.id_unique_product, data.id_unique_product, data.id_unique_product))
            result = cursor.fetchone()
            
            if result:
                raw_hashtag = result.get('hashtag')
                array_hash = raw_hashtag.split(",") if raw_hashtag else []
                
                # ? categories
                raw_categories = result.get('categories')
                array_categories = raw_categories.split(",") if raw_categories else []
                
                if 'hashtag' and 'categories' in result:
                    del result['hashtag']
                    del result['categories']
                
                date_string = result['created_at']
                formatted_date = date_string.strftime("%d %B %Y")
                return ({
                    'id_unique_product' : result['id_unique_product'],
                    'description' : result['description'],
                    'hashtags' : array_hash,
                    'categories' : array_categories,
                    'like_count' : result['like_count'],
                    'dislike_count' : result['dislike_count'],
                    'bookmark_count' : result['bookmark_count'],
                    'image_url' : result['image_url'],
                    'created_at': formatted_date 
                })
        except HTTPException as e:
            raise e


# * ====================== PUT =======================
class PutModel(BaseModel):
    id_unique_product : int
    description : Optional[str]
    image_name : Optional[str]
    image_path : Optional[str]
    created_at: datetime
    prev_url: str
    categories : Optional[list[str]]
    hashtags : Optional[list[str]]

class PutProducts:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)

    async def update_img(self, cursor, email_user, id_unique_product, image_binary, image_name, prev_url):
        try:
            image_name_webp = os.path.splitext(image_name)[0] + '.webp'
            
            query_select_double = 'SELECT image_name FROM product_image WHERE ref_id_u_product = %s'
            cursor.execute(query_select_double, (id_unique_product,))
            prev_img = cursor.fetchone()

            if prev_img:
                cloudinary.uploader.destroy( # ? .destroy tidak memiliki parameter folder
                public_id=f"users_product/{email_user}/{prev_img['image_name']}", # ? path langsung ke image yg ingin dihapus
                resource_type="image",
                )
            else:
                raise HTTPException(status_code=404, detail="Photos already exists")

            img_update = Image.open(BytesIO(image_binary)) # ? membuka gambar dari data biner.
            max_size = (800, 800) 
            img_update.thumbnail(max_size) # ? resize gambar supaya ukuran maksimal 800x800 (tanpa memotong).

            buffer = BytesIO() 
            img_update.save(buffer, format="WEBP", quality=85)
            buffer.seek(0)
            url = cloudinary.uploader.upload(
                buffer,
                folder=f"users_product/{email_user}",
                public_id=image_name_webp,
                resource_type="image"
            )
            return url['secure_url'] 
        except HTTPException as e:
            raise e
    
    def update(self, cursor, data : PutModel, url, id_unique_creator):
        try:
            if url:
                # ? UPDATE USERS PRODUCT==== 
                image_name_webp = os.path.splitext(data.image_name)[0] + '.webp'
                query_parent = '''
                UPDATE users_product SET created_at = %s WHERE id_unique_product = %s'''
                cursor.execute(query_parent, (data.created_at, data.id_unique_product))
                query = '''
                UPDATE product_image SET description = %s, image_name = %s, image_url = %s, WHERE ref_id_u_product = %s
                '''
                cursor.execute(query, (data.description, image_name_webp, url, data.id_unique_product))
            else:
                query_parent = '''
                UPDATE users_product SET created_at = %s WHERE id_unique_product = %s'''
                cursor.execute(query_parent, (data.created_at, data.id_unique_product))
                
                query = '''
                UPDATE product_image SET description = %s WHERE ref_id_u_product = %s
                '''
                cursor.execute(query, (data.description, data.id_unique_product))
            
            # * CATEGORIES ==== 
            query_delete = '''
                DELETE FROM product_image_categories WHERE ref_id_u_product = %s AND ref_id_u_user = %s
            '''
            cursor.execute(query_delete, (data.id_unique_product, id_unique_creator))
            
            query_categories = '''
                INSERT INTO product_image_categories (ref_id_u_user, ref_id_u_product, categories, created_at) VALUES (%s,%s,%s,%s)
            '''
            categories_values = [(id_unique_creator, data.id_unique_product, categories, data.created_at) for categories in data.categories]
            cursor.executemany(query_categories, categories_values)
            
            # * HASHTAG ==== 
            query_delete_hashtag = '''
                DELETE FROM product_image_hashtag WHERE ref_id_u_users = %s AND ref_id_u_product = %s
            '''
            cursor.execute(query_delete_hashtag, (id_unique_creator, data.id_unique_product))

            query_insert_hashtag = '''
                INSERT INTO product_image_hashtag (ref_id_u_users, ref_id_u_product, hashtag, created_at) VALUES (%s,%s,%s,%s)
            '''
            hashtag_values = [(id_unique_creator, data.id_unique_product, hashtag, data.created_at) for hashtag in data.hashtags]
            cursor.executemany(query_insert_hashtag, hashtag_values)
        except HTTPException as e:
            raise e

    def result_put(self, cursor, id_unique_product, id_unique_creator):
        try:
            query_select = '''
            SELECT
                u.id_unique AS id_unique_user,
                up.id_unique_product,
                pi.description,
                pi.image_url,
                up.created_at,
                COALESCE(SUM(pv.like_count), 0) AS like_count,
                COALESCE(SUM(pv.dislike_count), 0) AS dislike_count,
                COALESCE(COUNT(pb.ref_id_u_product), 0) AS bookmark_count,
                uh.hashtag, upc.categories
            FROM users_product up
            JOIN product_image pi ON (pi.ref_id_u_product = up.id_unique_product)
            JOIN users u ON (u.id_unique = up.ref_id_u)
            LEFT JOIN product_image_vote pv ON (pv.ref_id_u_product = up.id_unique_product)
            LEFT JOIN product_image_bookmark pb ON (pb.ref_id_u_product = up.id_unique_product)
            LEFT JOIN (
                SELECT 
                    ref_id_u_users,
                    ref_id_u_product,
                    GROUP_CONCAT(hashtag) AS hashtag
                FROM product_image_hashtag
                WHERE ref_id_u_users = %s AND ref_id_u_product = %s
                GROUP BY ref_id_u_users, ref_id_u_product
            ) AS uh ON up.ref_id_u = uh.ref_id_u_users AND up.id_unique_product = uh.ref_id_u_product
            LEFT JOIN (
                SELECT ref_id_u_product,
                GROUP_CONCAT(categories) AS categories
                FROM product_image_categories
                WHERE ref_id_u_product = %s
                GROUP BY ref_id_u_product
            ) AS upc ON upc.ref_id_u_product = up.id_unique_product
            WHERE up.id_unique_product = %s
            GROUP BY up.id_unique_product, pi.description, pi.image_url
            '''
            cursor.execute(query_select, (id_unique_creator, id_unique_product, id_unique_product, id_unique_product))
            result = cursor.fetchone()
            
            if result:
                raw_hashtag = result.get('hashtag')
                array_hash = raw_hashtag.split(",") if raw_hashtag else []
                
                # ? categories
                raw_categories = result.get('categories')
                array_categories = raw_categories.split(",") if raw_categories else []
                
                if 'hashtag' and 'categories' in result:
                    del result['hashtag']
                    del result['categories']
                
                date_string = result['created_at']
                formatted_date = date_string.strftime("%d %B %Y")
                return ({
                    'id_unique_product' : result['id_unique_product'],
                    'description' : result['description'],
                    'hashtags' : array_hash,
                    'categories' : array_categories,
                    'like_count' : result['like_count'],
                    'dislike_count' : result['dislike_count'],
                    'bookmark_count' : result['bookmark_count'],
                    'image_url' : result['image_url'],
                    'created_at': formatted_date 
                })
        except HTTPException as e:
            raise e


# * ====================== DELETE =======================
class DeleteModel(BaseModel):
    id_unique_product: int

class DeleteProduct:
    def __init__(self):
        self.connection = get_connection()
        check_connection(self.connection)
        self.cursor = get_cursor(self.connection)
    
    async def delete_image(self, cursor, id_unique_product, email_user):
        try:
            query_select = 'SELECT image_name FROM product_image WHERE ref_id_u_product = %s'
            cursor.execute(query_select, (id_unique_product,))
            result = cursor.fetchone()
            
            if result:
                cloudinary.uploader.destroy(
                    public_id=f"users_product/{email_user}/{result['image_name']}", # ? path langsung ke image yg ingin dihapus
                    resource_type="image",
                )
            else:
                raise HTTPException(status_code=404, detail="Image doesnt exists")
        except HTTPException as e:
            raise e

    def delete(self, cursor, id_unique_product):
        try:
            query_delete = 'DELETE FROM users_product WHERE id_unique_product = %s'
            cursor.execute(query_delete, (id_unique_product,))
        except HTTPException as e:
            raise e


