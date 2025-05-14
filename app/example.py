import streamlit as st
import openai
from PyPDF2 import PdfReader
from docx import Document
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def configure_page():
    st.set_page_config(
        page_title="Document Chat with OpenAI",
        page_icon="📚",
        layout="wide"
    )
    st.title("BLINK AI")

def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        if page.extract_text():
            text += page.extract_text()
    return text

def extract_text_from_docx(docx_file):
    doc = Document(docx_file)
    text = "\n".join(paragraph.text for paragraph in doc.paragraphs)
    return text

def extract_text_from_txt(txt_file):
    return txt_file.read().decode('utf-8')

def process_file(uploaded_file):
    if uploaded_file.type == "application/pdf":
        return extract_text_from_pdf(uploaded_file)
    elif uploaded_file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return extract_text_from_docx(uploaded_file)
    elif uploaded_file.type == "text/plain":
        return extract_text_from_txt(uploaded_file)
    else:
        st.error("Unsupported file format. Please upload PDF, DOCX, or TXT files.")
        return None

def get_openai_response(conversation, user_question):
    try:
        system_prompt = "You are an AI assistant focused on analyzing and answering questions about the provided document."
        full_prompt = f"{system_prompt}\nDocument content for reference:\n{st.session_state.document_text[:100000]}\nPrevious conversation:\n{conversation}\nUser question:\n{user_question}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": full_prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        st.error(f"Error getting response from OpenAI: {str(e)}")
        return None

def generate_notes(document_text):
    try:
        system_prompt = """You are a professional note-taking assistant. Create clear, concise, and well-structured notes from the provided document. 
        The notes should:
        1. Include main topics and key points
        2. Be organized with headings and subheadings
        3. Use bullet points for better readability
        4. Highlight important concepts"""

        full_prompt = f"{system_prompt}\nDocument content:\n{document_text[:100000]}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": full_prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        st.error(f"Error generating notes: {str(e)}")
        return None

def generate_quiz(document_text):
    try:
        system_prompt = """You are a quiz generator. Create a comprehensive quiz from the provided document content.
        The quiz should:
        1. Include 10 questions
        2. Mix multiple choice and short answer questions
        3. Cover key concepts from the document
        4. Include answers after each question
        5. Vary in difficulty"""

        full_prompt = f"{system_prompt}\nDocument content:\n{document_text[:100000]}"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": full_prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        st.error(f"Error generating quiz: {str(e)}")
        return None

def main():
    configure_page()

    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    if 'document_text' not in st.session_state:
        st.session_state.document_text = None
    if 'generated_notes' not in st.session_state:
        st.session_state.generated_notes = None
    if 'generated_quiz' not in st.session_state:
        st.session_state.generated_quiz = None

    with st.sidebar:
        st.header("Upload Document")
        uploaded_file = st.file_uploader(
            "Choose a file",
            type=['pdf', 'docx', 'txt'],
            help="Upload your document here"
        )

        if uploaded_file and st.button("Process Document"):
            with st.spinner("Processing document..."):
                st.session_state.document_text = process_file(uploaded_file)
                if st.session_state.document_text:
                    st.success("Document processed successfully!")
                    initial_prompt = f"""You are an AI assistant specifically focused on analyzing this document:
                    {st.session_state.document_text[:2000]}...
                    
                    Important rules:
                    1. Only answer questions directly related to this document's content
                    2. If a question is not about the document, politely decline to answer
                    3. Do not provide information from outside the document
                    4. Base all responses strictly on the document's content
                    5. If information isn't in the document, clearly state that"""
                    
                    st.session_state.chat_history = [(initial_prompt, "I'm ready to help you with questions about this document. Please keep your questions focused on the document's content.")]

        if st.session_state.document_text is not None:
            st.header("Additional Features")
            if st.button("Generate Notes"):
                with st.spinner("Generating notes..."):
                    st.session_state.generated_notes = generate_notes(st.session_state.document_text)
                    if st.session_state.generated_notes:
                        st.success("Notes generated successfully!")

            if st.button("Generate Quiz"):
                with st.spinner("Generating quiz..."):
                    st.session_state.generated_quiz = generate_quiz(st.session_state.document_text)
                    if st.session_state.generated_quiz:
                        st.success("Quiz generated successfully!")

    if st.session_state.document_text is not None:
        tab1, tab2, tab3 = st.tabs(["Chat", "Notes", "Quiz"])
        
        with tab1:
            chat_container = st.container()
            with chat_container:
                for message in st.session_state.chat_history[1:]:
                    with st.chat_message("user" if message[0] != "Assistant" else "assistant"):
                        st.write(message[1])

                user_question = st.chat_input("Ask a question about your document")
                
                if user_question:
                    with st.chat_message("user"):
                        st.write(user_question)

                    with st.chat_message("assistant"):
                        with st.spinner("Thinking..."):
                            conversation = "\n".join(
                                f"{'User' if i%2==0 else 'Assistant'}: {msg}"
                                for i, msg in enumerate(m[1] for m in st.session_state.chat_history)
                            )
                            response = get_openai_response(conversation, user_question)
                            if response:
                                st.write(response)
                                st.session_state.chat_history.append(("User", user_question))
                                st.session_state.chat_history.append(("Assistant", response))
        
        with tab2:
            if st.session_state.generated_notes:
                st.markdown(st.session_state.generated_notes)
            else:
                st.info("Click 'Generate Notes' in the sidebar to create notes from your document.")
        
        with tab3:
            if st.session_state.generated_quiz:
                st.markdown(st.session_state.generated_quiz)
            else:
                st.info("Click 'Generate Quiz' in the sidebar to create a quiz from your document.")
    else:
        st.info("Please upload a document to start chatting!")

if __name__ == "__main__":
    main()