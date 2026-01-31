from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/causes')
def causes():
    return render_template("causes.html")

@app.route('/donate')
def donate():
    return render_template("donate.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    # In production, you'd save this to a database or send an email
    print(f"Contact form submission: {data}")
    return jsonify({"success": True, "message": "Thank you for your message!"})

@app.route('/api/donate', methods=['POST'])
def submit_donation():
    data = request.get_json()
    # In production, integrate with payment gateway
    print(f"Donation submission: {data}")
    return jsonify({"success": True, "message": "Thank you for your generous donation!"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10000)