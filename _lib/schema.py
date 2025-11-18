# from connection import get_connection, dict_cursor

# connection = get_connection()
# cursor = dict_cursor(connection)


# * ============ USERS ============
# ? untuk ENUM harus dibuat typenya dulu 
# ? => ini contohnya => prototype3=# CREATE TYPE user_role AS ENUM ('admin', 'creator', 'guest');
# CREATE TYPE

users = '''
    CREATE TABLE users (
        id_unique INT NOT NULL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL UNIQUE,
        role user_role DEFAULT 'guest',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
'''
# cursor.execute(users)


users_description = '''
    CREATE TABLE users_description (
        ref_id_u INT NOT NULL,
        id_unique INT NOT NULL PRIMARY KEY,
        username VARCHAR(50) DEFAULT NULL,
        bio TEXT,
        gender gender DEFAULT NULL,
        phone_number INT DEFAULT NULL,
        location VARCHAR(100) DEFAULT NULL,
        pict_webp VARCHAR(255) DEFAULT NULL,
        pict_url VARCHAR(255) DEFAULT NULL,
        update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_description)


users_description_social_link = '''
    CREATE TABLE users_social_link (
        ref_id_u INT NOT NULL,
        id_unique INT NOT NULL PRIMARY KEY,
        platform VARCHAR(100) DEFAULT NULL,
        social_link VARCHAR(100) DEFAULT NULL,
        update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_description_social_link)


# * ============ USERS FOLLOWER ============
users_followers = '''
    CREATE TABLE users_followers (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT NOT NULL,
        status boolean DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_followers)


# * ============ USERS STATIC ============
users_static = '''
    CREATE TABLE users_static (
        ref_id_u_users INT NOT NULL,
        ref_id_u_product INT NOT NULL,
        categories VARCHAR(255) NOT NULL,
        status_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique),
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product)
    )
'''
# cursor.execute(users_static)


# * ============ USERS PRODUCT ============
product = '''
    CREATE TABLE users_product (
        ref_iu INT NOT NULL,
        iuProduct INT NOT NULL UNIQUE PRIMARY KEY,
        type type_product DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        folderName VARCHAR(255) NOT NULL,
        status boolean DEFAULT TRUE
        FOREIGN KEY (ref_iu) REFERENCES users(idUnique) ON DELETE CASCADE
    )
'''
# cursor.execute(product)
# cursor.execute("ALTER TABLE users_product ADD COLUMN status boolean DEFAULT TRUE")


product_img = '''
    CREATE TABLE product_image (
        ref_id_u_product INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        image_name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(product_img)


product_image_hashtag = '''
    CREATE TABLE product_image_hashtag (
        ref_id_u_users INT NOT NULL,
        ref_id_u_product INT NOT NULL,
        hashtag VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_hashtag)


product_image_categories = '''
    CREATE TABLE product_image_categories (
        ref_id_u_product INT NOT NULL,
        ref_id_u_user INT NOT NULL,
        categories VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_user) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_categories)


product_image_bookmark = '''
    CREATE TABLE product_image_bookmark (
        ref_id_u_users INT DEFAULT NULL,
        ref_id_u_product INT DEFAULT NULL,
        status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_bookmark)


product_image_comment = '''
    CREATE TABLE product_image_comment (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_product INT NOT NULL,
        id_unique_cm INT NOT NULL PRIMARY KEY,
        text VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_comment)


product_image_sub_comment = '''
    CREATE TABLE product_image_sub_comment (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT DEFAULT NULL,
        ref_id_unique_cm INT NOT NULL,
        id_unique_sub_cm INT NOT NULL PRIMARY KEY,
        text VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status_edit BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_unique_cm) REFERENCES product_image_comment(id_unique_cm) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_sub_comment)


product_image_vote = '''
    CREATE TABLE product_image_vote (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT NOT NULL,
        ref_id_u_product INT NOT NULL,
        like_count INT DEFAULT 0,
        dislike_count INT DEFAULT 0,
        status status_vote DEFAULT 'receive',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(product_image_vote)


# * ============ USERS EMAIL ============
users_email = '''
    CREATE TABLE users_email (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT NOT NULL,
        ref_id_u_product INT NOT NULL,
        id_unique_email INT NOT NULL PRIMARY KEY,
        type type_email DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_product) REFERENCES users_product(id_unique_product) ON DELETE CASCADE
    )
'''
# cursor.execute(users_email)


users_email_message = '''
    CREATE TABLE users_email_message (
        ref_id_unique_email INT NOT NULL,
        id_unique_email_msg INT NOT NULL PRIMARY KEY,
        subject VARCHAR(255) DEFAULT NULL,
        text VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (ref_id_unique_email) REFERENCES users_email(id_unique_email) ON DELETE CASCADE
    )
'''
# cursor.execute(users_email_message)


users_email_status = '''
    CREATE TABLE users_email_status (
        ref_id_u_email INT NOT NULL,
        ref_id_u_users INT NOT NULL,
        is_read boolean DEFAULT FALSE,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_email) REFERENCES users_email(id_unique_email) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_email_status)


# * ============ USERS DISCUSSION ============
users_discussion = '''
    CREATE TABLE users_discussion (
        ref_id_u_users INT NOT NULL,
        id_unique_disc INT NOT NULL UNIQUE PRIMARY KEY,
        hashtag VARCHAR(255) NOT NULL,
        text VARCHAR(255) DEFAULT NULL,
        url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_discussion)


users_discussion_comment = '''
    CREATE TABLE users_discussion_comment (
        ref_id_u_discussion INT NOT NULL,
        ref_id_u_sender INT NOT NULL,
        id_unique_disc_cm INT NOT NULL,
        text VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_discussion) REFERENCES users_discussion(id_unique_disc) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_discussion_comment)


users_discussion_archive = '''
    CREATE TABLE users_discussion_archive (
        ref_id_u_users INT NOT NULL,
        ref_id_u_discussion INT NOT NULL,
        status boolean DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_users) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_discussion) REFERENCES users_discussion(id_unique_disc) ON DELETE CASCADE
    )
'''
# cursor.execute(users_discussion_archive)


# * ============ USERS REPORT ============
users_report = '''
    CREATE TABLE users_report (
        ref_id_u_sender_report INT NOT NULL,
        id_unique_report INT NOT NULL PRIMARY KEY,
        type type_report DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender_report) REFERENCES users(id_unique) ON DELETE CASCADE
    )
'''
# cursor.execute(users_report)


users_report_image = '''
    CREATE TABLE users_report_image (
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT NOT NULL,
        ref_id_u_image INT NOT NULL,
        ref_id_u_report INT NOT NULL,
        text VARCHAR(255) NOT NULL,
        status status_report_image DEFAULT 'receive',
        change_status_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_image) REFERENCES users_product(id_unique_product) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_report) REFERENCES users_report(id_unique_report) ON DELETE CASCADE
    )
'''
# cursor.execute(users_report_image)


users_report_discussion = '''
    CREATE TABLE users_report_discussion (
        ref_parent_id_u_report INT NOT NULL,
        ref_id_u_sender INT NOT NULL,
        ref_id_u_receiver INT NOT NULL,
        ref_id_u_discussion INT NOT NULL,
        id_unique_discussion INT NOT NULL PRIMARY KEY,
        status status_report_discussion DEFAULT 'receive',
        text VARCHAR(255) NOT NULL,
        change_status_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ref_parent_id_u_report) REFERENCES users_report(id_unique_report) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_sender) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_receiver) REFERENCES users(id_unique) ON DELETE CASCADE,
        FOREIGN KEY (ref_id_u_discussion) REFERENCES users_discussion(id_unique_disc) ON DELETE CASCADE
    )
'''
# cursor.execute(users_report_discussion)




connection.commit()