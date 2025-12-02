import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
