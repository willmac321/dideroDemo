from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from PyPDF2 import PdfReader
from werkzeug.wrappers import response
from collections import Counter

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# FIXME make this less permissive
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def do_pdf_things(file):
    # XXX this is where we'd ship the file to a 3rd party service or use a lib like
    # https://pypi.org/project/invoice2data/ after installing and setting up the ml packages on the server
    reader = PdfReader(file)
    number_of_pages = len(reader.pages)
    page = reader.pages[0]
    texts = page.extract_text()
    counts = None
    for text in texts.split('\n'):
        if counts:
            counts.update(Counter(text.split(" ")))
        else:
            counts = Counter(text.split(" "))

    if counts:
        counts = [{'word': k, 'count': v} for k, v in counts.items()]
    return  number_of_pages, texts, counts


@app.route("/api/upload", methods=['POST'])
def upload():
    if 'file' not in request.files:
        # prbly a better error to use here
        return "File not found", 404
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename) # pyright: ignore
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # do some pdf stuff now
        number_of_pages, texts, counts = do_pdf_things(file)
        # probably set up openApi/swagger here as well to help with typing on FE/BE
        return {
            "numberOfPages": number_of_pages,
            "text": texts,
            "wordFrequency": counts
        }
    return "Success", 200
