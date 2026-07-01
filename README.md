# 🎬 Video Bot - AI-Powered Video Q&A

A modern, bright, and interactive chatbot UI for asking questions about videos. Feed it a YouTube video URL or ID, and ask questions to avoid wasting time watching entire videos.

## ✨ Features

- **📹 Video Player Integration** - Embed and play YouTube videos directly
- **💬 Interactive Chat** - Ask questions about video content in real-time
- **🎨 Bright Color Theme** - Modern, eye-catching gradient design
- **📊 Chat History** - Save and revisit previous chat sessions
- **📥 Export Chats** - Download chat history as text files
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **💾 Local Storage** - All data persists in your browser
- **⚡ Real-time Timestamps** - Get approximate timestamps for video references
- **🎯 Multiple Videos** - Manage and switch between multiple video sessions

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **CSS Modules** - Scoped styling
- **Lucide React** - Beautiful icon library

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd video-bot

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🎯 How to Use

### Adding a Video

1. Click the **"Add Video"** button in the sidebar
2. Paste a YouTube URL or Video ID
3. The video will be loaded and selected automatically

### Asking Questions

1. Type your question in the chat input field
2. Press **Enter** or click the **Send** button
3. The bot will respond with relevant information
4. Timestamps are included for reference

### Managing Chats

- **View History** - Click on any previous chat in the Chat History sidebar
- **Export Chat** - Click the download icon to save the current chat
- **Clear Chat** - Click the trash icon to clear current messages
- **Delete Session** - Remove entire chat sessions from history

### Mobile Usage

- Tap the **menu icon** (☰) to toggle the sidebar
- Videos and chat adapt to smaller screens
- All features remain fully accessible

## 🎨 Color Theme

The UI features a bright, modern color scheme:

- **Primary**: Cyan (#00d4ff) - Main interactive elements
- **Secondary**: Pink (#ff006e) - Accents and highlights
- **Accent**: Gold (#ffbe0b) - Special buttons and features
- **Success**: Bright Green (#05ff00) - Positive actions
- **Error**: Red (#ff006e) - Destructive actions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── VideoPlayer/     # Video player component
│   ├── VideoInput/      # Video URL input component
│   ├── ChatWindow/      # Chat interface component
│   └── ChatHistory/     # Chat history sidebar
├── styles/              # Global CSS
├── types/               # TypeScript interfaces
├── App.tsx              # Main app component
└── index.tsx            # Entry point
```

## 🔧 Component API

### VideoPlayer
```typescript
<VideoPlayer
  url={string}          // YouTube URL or Video ID
  title={string}        // Video title
/>
```

### VideoInput
```typescript
<VideoInput
  onAddVideo={handler}      // Called when video is added
  onSelectVideo={handler}   // Called when video is selected
  videos={Video[]}          // List of added videos
/>
```

### ChatWindow
```typescript
<ChatWindow
  selectedVideo={Video | null}  // Currently selected video
  messages={Message[]}          // Chat messages
  onSendMessage={handler}       // Called when message is sent
  onClearChat={handler}         // Called to clear chat
  onExportChat={handler}        // Called to export chat
  isLoading={boolean}           // Loading state
/>
```

### ChatHistory
```typescript
<ChatHistory
  sessions={ChatSession[]}    // List of chat sessions
  currentSessionId={string}   // Currently active session
  onSelectSession={handler}   // Called when session is selected
  onDeleteSession={handler}   // Called when session is deleted
/>
```

## 💾 Data Persistence

All data is automatically saved to browser's localStorage:

- **videos** - List of added videos
- **chatSessions** - All chat sessions and messages

Data persists between browser sessions and survives page refreshes.

## 📱 Responsive Breakpoints

- **Desktop** (1024px+) - Full split-screen layout
- **Tablet** (768px-1023px) - Stacked layout with flexible sizing
- **Mobile** (< 768px) - Full mobile experience with collapsible sidebar

## 🎯 Future Enhancements

- Integration with AI APIs for actual video analysis
- User authentication and cloud sync
- Video transcription and search
- Collaborative chat sessions
- Custom AI model fine-tuning
- Support for multiple video platforms
- Advanced timestamp navigation

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by Video Bot Team**