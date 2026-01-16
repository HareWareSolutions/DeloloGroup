import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ManageMembers from './pages/admin/ManageMembers';
import ManagePublications from './pages/admin/ManagePublications';
import ManageNews from './pages/admin/ManageNews';

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
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<ManageMembers />} />
          <Route path="publications" element={<ManagePublications />} />
          <Route path="news" element={<ManageNews />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
