from flask import Flask, render_template, redirect, request, url_for, session
import bcrypt
import data_manager
from datetime import timedelta


app = Flask(__name__)


app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/registration", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        if session.get('username') is not None:
            return redirect(url_for('loginerror'))
        else:
            return render_template('register.html', error=None)
    elif request.method == 'POST':
        username = request.form['username']
        if data_manager.check_username(username) == username:
            return render_template('register.html', error="taken")
        else:
            password = request.form['password']
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            hashed_password = hashed_password.decode('utf-8')
            data_manager.registration(username, hashed_password)
            return redirect(url_for('index'))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if session.get('username') is not None:
            return redirect(url_for('loginerror'))
        else:
            return render_template('login.html', error=None)
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = data_manager.get_password_by_username(username)
        if hashed_password is not None:
            hashed_password = hashed_password.encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password) is True:
                session['username'] = username
                session['user_id'] = int(data_manager.get_user_id_by_username(username))
                session.permanent = True
                return redirect(url_for('index'))
            else:
                return render_template('login.html', error="not valid")
        else:
            return render_template('login.html', error="not valid")


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return redirect(url_for('index'))


@app.route('/loginerror')
def loginerror():
    return render_template('loginerror.html')


if __name__ == '__main__':
    app.run(debug=True, port=8000)
