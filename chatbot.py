import os
from dotenv import load_dotenv

from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.runnables import (
    RunnableParallel,
    RunnableLambda,
    RunnablePassthrough,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate

load_dotenv()


# Load Model


model = ChatOpenAI(
    model="meta-llama-3-8b-instruct",
    base_url=os.getenv("BASE_URL"),
    api_key="lm-studio",
    temperature=0.7,
)

embeddings = OpenAIEmbeddings(
    model="nomic-embed-text-v1.5",
    base_url=os.getenv("BASE_URL"),
    api_key="lm-studio",
    check_embedding_ctx_length=False,
)


# Global Variables

vector_store = None
retriever = None
chain = None


# Prompt


prompt = PromptTemplate(
    template="""
You are a helpful assistant.

Answer ONLY from the provided transcript.

If the transcript does not contain the answer,
simply reply:
"Information not available."

Context:
{context}

Question:
{question}
""",
    input_variables=["context", "question"],
)



# Helper Function


def format_docs(retrieved_docs):
    return "\n\n".join(doc.page_content for doc in retrieved_docs)



# Load Video Function


def load_video(video_id):

    global vector_store
    global retriever
    global chain

    try:
        ytt_api = YouTubeTranscriptApi()

        transcript = ytt_api.fetch(video_id)

        text = " ".join([item.text for item in transcript])

    except TranscriptsDisabled:
        raise Exception("No captions available for this video.")

    except NoTranscriptFound:
        raise Exception("Transcript not found.")

    except VideoUnavailable:
        raise Exception("Video unavailable.")

    # Text Splitting
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.create_documents([text])

    print(f"Number of Chunks: {len(chunks)}")

    # Embedding
    vector_store = FAISS.from_documents(
        chunks,
        embeddings,
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k":4},
    )

    # Chain
    chain = (
        RunnableParallel(
            {
                "context": retriever | RunnableLambda(format_docs),
                "question": RunnablePassthrough(),
            }
        )
        | prompt
        | model
        | StrOutputParser()
    )

    return "Video indexed successfully."



# Ask Question Function


def ask_question(question):

    global chain

    if chain is None:
        return "Please load a YouTube video first."

    answer = chain.invoke(question)

    return answer