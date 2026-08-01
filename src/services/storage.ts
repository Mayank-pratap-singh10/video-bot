// src/services/storage.ts

const STORAGE_KEY = "video-bot-state";

export default class StorageService {
  static save(data: unknown) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save state:", err);
    }
  }

  static load<T>() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    const state = JSON.parse(data);

    // Restore Video dates
    state.videos?.forEach((video: any) => {
      video.addedAt = new Date(video.addedAt);
    });

    // Restore Session dates
    state.chatSessions?.forEach((session: any) => {
      session.createdAt = new Date(session.createdAt);
      session.updatedAt = new Date(session.updatedAt);

      session.messages?.forEach((msg: any) => {
        msg.timestamp = new Date(msg.timestamp);
      });
    });

    // Restore current messages
    state.messages?.forEach((msg: any) => {
      msg.timestamp = new Date(msg.timestamp);
    });

    return state as T;

  } catch (err) {
    console.error(err);
    return null;
  }
}

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}