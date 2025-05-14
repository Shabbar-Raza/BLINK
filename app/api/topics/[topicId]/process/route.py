from typing import Optional
from PyPDF2 import PdfReader
from docx import Document
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi
import io

def extract_text_from_pdf(pdf_file) -> Optional[str]:
    try:
        pdf_reader = PdfReader(io.BytesIO(pdf_file))
        text = []
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
        
        if not text:
            return None
            
        return "\n".join(text)
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return None

def extract_text_from_docx(docx_file) -> Optional[str]:
    try:
        doc = Document(io.BytesIO(docx_file))
        text = "\n".join(paragraph.text for paragraph in doc.paragraphs if paragraph.text)
        if not text:
            return None
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {str(e)}")
        return None

def extract_text_from_txt(txt_file) -> Optional[str]:
    try:
        text = txt_file.decode('utf-8')
        if not text:
            return None
        return text
    except Exception as e:
        print(f"Error reading text file: {str(e)}")
        return None

class ProcessHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_type, pdict = cgi.parse_header(self.headers['Content-Type'])
            
            if content_type == 'multipart/form-data':
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )
                
                file_item = form['file']
                file_type = form['fileType'].value
                file_content = file_item.file.read()
                
                if file_type == 'application/pdf':
                    text = extract_text_from_pdf(file_content)
                elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    text = extract_text_from_docx(file_content)
                elif file_type == 'text/plain':
                    text = extract_text_from_txt(file_content)
                else:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'error': 'Unsupported file format'
                    }).encode())
                    return

                if text is None:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'error': 'Could not extract text from file'
                    }).encode())
                    return

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'text': text
                }).encode())
            else:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Invalid content type'
                }).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': str(e)
            }).encode())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProcessHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server() 