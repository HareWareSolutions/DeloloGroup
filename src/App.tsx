import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Research from './pages/Research';
import Publications from './pages/Publications';
import Values from './pages/Values';
import Members from './pages/Members';
import Fabio from './pages/Fabio';
import News from './pages/News';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="research" element={<Research />} />
          <Route path="publications" element={<Publications />} />
          <Route path="values" element={<Values />} />
          <Route path="members" element={<Members />} />
          <Route path="fabio-delolo" element={<Fabio />} />
          <Route path="news" element={<News />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<div>Manage Members (Coming Soon)</div>} />
          <Route path="publications" element={<div>Manage Publications (Coming Soon)</div>} />
          <Route path="news" element={<div>Manage News (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
