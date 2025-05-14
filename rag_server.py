from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
from pathlib import Path
import os
import shutil
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
import PyPDF2
import docx
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Storage for chat sessions
UPLOAD_DIR = Path("uploaded_documents")
UPLOAD_DIR.mkdir(exist_ok=True)

chat_sessions: Dict[str, ConversationalRetrievalChain] = {}

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: str
    query: str
    history: List[Message]

def create_vector_store(text: str, session_id: str):
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)

    # Create embeddings and vector store
    embeddings = OpenAIEmbeddings()
    vector_store = Chroma.from_texts(
        chunks,
        embeddings,
        collection_name=f"collection_{session_id}"
    )

    return vector_store

def create_chat_chain(vector_store):
    # Create retrieval chain
    llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")
    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True,
        verbose=True,
    )
    return chain

def extract_text_from_file(file_path: str) -> str:
    file_extension = Path(file_path).suffix.lower()
    
    if file_extension == '.pdf':
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    elif file_extension in ['.docx', '.doc']:
        doc = docx.Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    elif file_extension == '.txt':
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Create file path
        file_path = UPLOAD_DIR / f"{session_id}_{file.filename}"
        
        # Save uploaded file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text from document
        text = extract_text_from_file(str(file_path))
        
        # Create vector store and chat chain
        vector_store = create_vector_store(text, session_id)
        chat_chain = create_chat_chain(vector_store)
        
        # Store chat chain in session
        chat_sessions[session_id] = chat_chain
        
        return {"session_id": session_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up uploaded file
        if 'file_path' in locals():
            file_path.unlink(missing_ok=True)

@app.get("/chat-history/{session_id}")
async def get_chat_history(session_id: str):
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Return empty history for new sessions
    return {"messages": []}

@app.post("/chat/")
async def chat(request: ChatRequest):
    try:
        if request.session_id not in chat_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_chain = chat_sessions[request.session_id]
        
        # Convert chat history to the format expected by the chain
        history = [(msg.content, msg.content) if msg.role == "user" else (None, msg.content) 
                  for msg in request.history if msg.role in ["user", "assistant"]]
        
        # Get response from chain
        result = chat_chain({"question": request.query, "chat_history": history})
        
        return {
            "answer": result["answer"],
            "sources": [str(doc.metadata) for doc in result.get("source_documents", [])]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
async def shutdown_event():
    # Clean up uploaded documents directory
    shutil.rmtree(UPLOAD_DIR, ignore_errors=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 