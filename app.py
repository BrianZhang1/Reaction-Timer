from sqlite3.dbapi2 import IntegrityError
from flask import Flask, render_template, request, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "secret secret spook"

# Create table if it doesn't exist
con = sqlite3.connect("data.db")
cur = con.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS users (
    id INTEGER,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY(id))
    """)
cur.execute("""CREATE TABLE IF NOT EXISTS rts (
    id INTEGER,
    uid INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rt INTEGER NOT NULL,
    pi INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (uid) REFERENCES users(id));
""")
con.commit()
cur.close()
con.close()

def uid_to_username(uid):
    con = sqlite3.connect("data.db")
    cur = con.cursor()
    cur.execute("SELECT username FROM users WHERE id = ?", (uid,))
    username = cur.fetchone()
    if username:
        username = username[0]
    cur.close()
    con.close()
    return username

@app.route("/")
def index():
    if not session.get("logged_in"):
        session["logged_in"] = False

    logged_in = session["logged_in"]
    if logged_in:
        username = uid_to_username(session["uid"])
        return render_template("index.html", logged_in=True, username=username)

    elif not logged_in:
        return render_template("index.html", logged_in=False)


@app.route("/test", methods=["GET", "POST"])
def test():
    if not session.get("logged_in"):
        session["logged_in"] = False

    if request.method == "GET":
        logged_in = session["logged_in"]
        if logged_in:
            username = uid_to_username(session["uid"])
            return render_template("test.html", logged_in=True, username=username)
        elif not logged_in:
            return render_template("test.html", logged_in=False)


    elif request.method == "POST":
        logged_in = session["logged_in"]
        if logged_in:
            rt = request.form.get("rt")
            pi = request.form.get("pi")
            con = sqlite3.connect("data.db")
            cur = con.cursor()
            cur.execute("INSERT INTO rts (uid, rt, pi) VALUES (?, ?, ?)", (session["uid"], rt, pi))
            con.commit()
            cur.close()
            con.close()
            return redirect("/test")
        else:
            return redirect("/login")


@app.route("/view", methods=["GET", "POST"])
def view():
    if not session.get("logged_in"):
        session["logged_in"] = False

    if (request.method == "GET"):
        con = sqlite3.connect("data.db")
        cur = con.cursor()
        cur.execute("""
            SELECT * FROM rts
            JOIN users ON users.id = rts.uid
            """)
        db = cur.fetchall()
        logged_in = session["logged_in"]
        if logged_in:
            username = uid_to_username(session["uid"])
            return render_template("view.html", db=db, logged_in=True, username=username)
        elif not logged_in:
            return render_template("view.html", db=db, logged_in=False)

    elif (request.method == "POST"):
        con = sqlite3.connect("data.db")
        cur = con.cursor()
        row_id = request.form.get("id")
        cur.execute("DELETE FROM rts WHERE id=?", (row_id,))
        con.commit()
        cur.close()
        con.close()
        return redirect("/view")

@app.route("/login", methods=["GET", "POST"])
def login():
    if not session.get("logged_in"):
        session["logged_in"] = False

    logged_in = session.get("logged_in")
    if request.method == "GET":
        if not logged_in:
            return render_template("login.html")
        else:
            return redirect("/")
    elif request.method == "POST":
        usernameInput = request.form.get("username")
        passwordInput = request.form.get("password")
        con = sqlite3.connect("data.db")
        cur = con.cursor()
        cur.execute("SELECT password FROM users WHERE username = ?", (usernameInput,))
        password = cur.fetchone()
        if password:
            password = password[0]
        else:
            return render_template("login.html", failed=True)
        if password == passwordInput:
            cur.execute("SELECT id FROM users WHERE username = ?", (usernameInput,))
            uid = cur.fetchone()[0]
            session["logged_in"] = True
            session["uid"] = uid
        else:
            return render_template("login.html", failed=True)
        cur.close()
        con.close()
        return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if not session.get("logged_in"):
        session["logged_in"] = False

    if (request.method == "GET"):
        if not session["logged_in"]:
            return render_template("register.html")
        else:
            return redirect("/")
    
    elif (request.method == "POST"):
        username = request.form.get("username")
        password = request.form.get("password")
        con = sqlite3.connect("data.db")
        cur = con.cursor()

        try:
            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        except IntegrityError:
            return render_template("register.html", usernameTaken=True)
        cur.execute("SELECT id FROM users WHERE username = ?", (username,))
        uid = cur.fetchone()[0]
        con.commit()
        cur.close()
        con.close()

        session["logged_in"] = True
        session["uid"] = uid
        return redirect("/")

@app.route("/logout", methods=["GET"])
def logout():
    if not session.get("logged_in"):
        session["logged_in"] = False

    logged_in = session["logged_in"]
    if logged_in:
        session["logged_in"] = False
        session.pop("uid")
    return redirect("/")

@app.route("/profile", methods=["GET"])
def profile():
    if not session.get("logged_in"):
        session["logged_in"] = False
    logged_in = session["logged_in"]

    if logged_in:
        username = uid_to_username(session["uid"])
        return render_template("profile.html", logged_in=True, username=username)

    elif not logged_in:
        return render_template("profile.html", logged_in=False)
