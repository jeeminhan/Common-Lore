import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SoloPlay from './pages/SoloPlay';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Game from './pages/Game';
import SessionReview from './pages/SessionReview';
import HowToPlay from './pages/HowToPlay';
import FeedbackProvider from './components/feedback/FeedbackProvider';

function App() {
  return (
    <div className="min-h-screen bg-navy-900">
      <FeedbackProvider />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solo" element={<SoloPlay />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/join/:roomCode" element={<JoinRoom />} />
        <Route path="/game/:roomCode" element={<Game />} />
        <Route path="/session/:sessionId" element={<SessionReview />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
      </Routes>
    </div>
  );
}

export default App;
