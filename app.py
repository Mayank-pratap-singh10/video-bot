from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import load_video, ask_question

app = FastAPI()

# Allow React Frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    video_id: str


class QuestionRequest(BaseModel):
    question: str


@app.post("/load-video")
def load(video: VideoRequest):

    message = load_video(video.video_id)

    return {
        "success": True,
        "message": message,
    }


@app.post("/ask")
def ask(data: QuestionRequest):

    answer = ask_question(data.question)

    return {
        "answer": answer,
    }