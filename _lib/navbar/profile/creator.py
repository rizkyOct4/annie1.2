from fastapi import APIRouter, HTTPException, Request, Depends
from models.database import get_connection
from services.profile.creator_services import PostModel, PutModel, DeleteModel, Post , PutProducts, DeleteProduct, GetProducts
import base64
from auth.index import verify_token

router = APIRouter()


# ? DEPENDS() macam callback ?, digunakan untuk isi parameter endpoint
@router.get('/GetProductUserAPI')
async def getProducts(req: Request, user_data=Depends(verify_token)):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        with connection:
            id_unique = user_data.get("id_unique")
            item = GetProducts()
            
            if id_unique is not None:
                return item.get_product(cursor, id_unique)
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/PostProductUserAPI')
async def postProduct(data: PostModel, user_data=Depends(verify_token)):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    # bentuk asli dari foto
    header, encoded = data.image_path.split(',', 1)
    image_binary = base64.b64decode(encoded)
    # data baru berupa str ????
    image_name = str(data.image_name)
    try:
        with connection:
            result = Post()
            email_user = user_data.get("email")
            id_unique_creator = user_data.get("id_unique")
            
            if data.type_data == "photo":
                url = await result.save_image(cursor, email_user, image_name, image_binary)
                result.insert(cursor, data, url, email_user, id_unique_creator)
                result_data = result.result_post(cursor, data, id_unique_creator)

            connection.commit()
            return {'message': 'Post Product Success', 'output': result_data}
    except HTTPException as e:
        raise e
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put('/PutProductUserAPI')
async def putProducts(data : PutModel, user_data=Depends(verify_token)):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        with connection:
            result = PutProducts()
            email_user = user_data.get("email")
            id_unique_creator = user_data.get("id_unique")
            
            if data.image_path and "," in data.image_path:
                header, encoded = data.image_path.split(',', 1)
                image_binary = base64.b64decode(encoded)
                
                url = await result.update_img(cursor, email_user, data.id_unique_product, image_binary, data.image_name, data.prev_url)

                result.update(cursor, data, url, id_unique_creator)
            else:
                result.update(cursor, data, None, id_unique_creator)
            
            result_data = result.result_put(cursor, data.id_unique_product, id_unique_creator)
            connection.commit()
            return {'message': 'Update Success', 'output': result_data}
    except HTTPException as e:
        raise e
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/DeleteProductUserAPI')
async def deleteProduct(data: DeleteModel, user_data=Depends(verify_token)):
    connection = get_connection()
    # ? TUPLE DICTIONARY ???? !!!!!
    cursor = connection.cursor(dictionary=True)
    try:
        with connection:
            email_user = user_data.get('email')
            result = DeleteProduct()
            await result.delete_image(cursor, data.id_unique_product, email_user)
            result.delete(cursor, data.id_unique_product)
            connection.commit()
            return {'message' : 'Delete Success'}
    except HTTPException as e:
        raise e
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))

