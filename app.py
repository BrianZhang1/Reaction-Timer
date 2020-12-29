from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    rt = request.form.get("rt");
    pi = request.form.get("pi")
    if rt == None:
        return redirect("/")
    connection = sqlite3.connect("rt.db")
    cursor = connection.cursor()
    cursor.execute("INSERT INTO times (rt, pi) VALUES (?, ?)", (rt, pi))
    connection.commit()
    return redirect("/")

# Error is here. DELETE FROM isn't returning any errors, but it also isn't working.
@app.route("/view", methods=["GET", "POST"])
def view():
    connection = sqlite3.connect("rt.db")
    cursor = connection.cursor()
    if (request.method == "GET"):
        cursor.execute("SELECT * FROM times")
        db = cursor.fetchall()
        return render_template("view.html", db=db)
    row_id = request.form.get("id")
    cursor.execute("DELETE FROM times WHERE id=?", (row_id,))
    connection.commit()
    return redirect("/view")
