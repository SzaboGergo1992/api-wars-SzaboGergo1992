import connection


@connection.connection_handler
def registration(cursor, username, hashed_password):
    user_details = {
        'username': username,
        'password': hashed_password
    }
    cursor.execute("""INSERT INTO users(username, password)
                      VALUES(%(username)s, %(password)s);""", user_details)


@connection.connection_handler
def get_password_by_username(cursor, username):

    cursor.execute("""SELECT password FROM users
                      WHERE username = %(username)s;""", {'username': username})
    password = cursor.fetchone()
    if password is not None:
        return password['password']
    else:
        return None


@connection.connection_handler
def check_username(cursor, username):

    cursor.execute("""SELECT username FROM users
                      WHERE username = %(username)s;""", {'username': username})
    user = cursor.fetchone()
    if user is not None:
        return user['username']
    else:
        return None


@connection.connection_handler
def get_user_id_by_username(cursor, username):
    cursor.execute("""SELECT id FROM users WHERE username = %(username)s;""", {'username': username})

    user_id = cursor.fetchone()
    return user_id['id']
