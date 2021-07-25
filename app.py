from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

con = sqlite3.connect("rt.db")
cur = con.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS times (id INTEGER, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, rt INTEGER, pi INTEGER, PRIMARY KEY(id));")
con.commit()
con.close()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    rt = request.form.get("rt");
    pi = request.form.get("pi")
    if rt == None:
        return redirect("/")
    con = sqlite3.connect("rt.db")
    cur = con.cursor()
    cur.execute("INSERT INTO times (rt, pi) VALUES (?, ?)", (rt, pi))
    con.commit()
    con.close()
    return redirect("/")

@app.route("/view", methods=["GET", "POST"])
def view():
    con = sqlite3.connect("rt.db")
    cur = con.cursor()
    if (request.method == "GET"):
        return render_template("view.html", db=cur.execute("SELECT * FROM times"))
    row_id = request.form.get("id")
    cur.execute("DELETE FROM times WHERE id=?", (row_id,))
    con.commit()
    con.close()
    return redirect("/view")
