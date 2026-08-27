import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import News from './pages/News';
import Article from './pages/Article';
import SearchPage from './pages/Search';
import DigitalSafety from './pages/DigitalSafety';
import { CvePage, CoursesPage, GitHubPage, OfficialSourcesPage, ToolsPage } from './pages/Directories';
import Learning from './pages/Learning';
import { About, Community, Contact, Saved, Services, StaticPolicy } from './pages/InfoPages';
import { Login, Profile, Register } from './pages/Auth';
import Admin from './pages/Admin';
import { Events, Placeholder, Resources, Submit } from './pages/Misc';

export default function App(){return <Routes><Route element={<Layout/>}>
  <Route path="/" element={<Home/>}/>
  <Route path="/news" element={<News/>}/><Route path="/news/:slug" element={<Article/>}/><Route path="/cyber-alerts" element={<News alertsOnly/>}/>
  <Route path="/search" element={<SearchPage/>}/>
  <Route path="/tools" element={<ToolsPage/>}/><Route path="/tools/:slug" element={<ToolsPage/>}/><Route path="/osint" element={<ToolsPage osintOnly/>}/><Route path="/github" element={<GitHubPage/>}/>
  <Route path="/learn" element={<Learning/>}/><Route path="/roadmaps" element={<Learning roadmapOnly/>}/><Route path="/courses" element={<CoursesPage/>}/><Route path="/coupons" element={<CoursesPage coupons/>}/><Route path="/resources" element={<Resources/>}/><Route path="/events" element={<Events/>}/>
  <Route path="/digital-safety" element={<DigitalSafety/>}/><Route path="/digital-safety/:tool" element={<DigitalSafety/>}/><Route path="/password-check" element={<Navigate to="/digital-safety/password-check" replace/>}/><Route path="/email-safety" element={<Navigate to="/digital-safety/email-safety" replace/>}/><Route path="/url-check" element={<Navigate to="/digital-safety/url-check" replace/>}/><Route path="/qr-check" element={<Navigate to="/digital-safety/qr-check" replace/>}/><Route path="/file-hash" element={<Navigate to="/digital-safety/file-hash" replace/>}/><Route path="/domain-check" element={<Navigate to="/digital-safety/domain-check" replace/>}/><Route path="/security-checklists" element={<Navigate to="/digital-safety/security-checklists" replace/>}/><Route path="/reports" element={<Navigate to="/digital-safety/reports" replace/>}/><Route path="/cve" element={<CvePage/>}/>
  <Route path="/official-sources" element={<OfficialSourcesPage/>}/>
  <Route path="/services" element={<Services/>}/><Route path="/community" element={<Community/>}/><Route path="/submit" element={<Submit/>}/><Route path="/saved" element={<Saved/>}/><Route path="/profile" element={<Profile/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/privacy" element={<StaticPolicy kind="privacy"/>}/><Route path="/terms" element={<StaticPolicy kind="terms"/>}/><Route path="/responsible-use" element={<StaticPolicy kind="responsible"/>}/><Route path="/affiliate-disclosure" element={<StaticPolicy kind="affiliate"/>}/>
  <Route path="/admin" element={<Admin/>}/><Route path="/admin/posts" element={<Admin/>}/><Route path="/admin/tools" element={<Admin/>}/><Route path="/admin/repositories" element={<Admin/>}/><Route path="/admin/courses" element={<Admin/>}/><Route path="/admin/coupons" element={<Admin/>}/><Route path="/admin/resources" element={<Admin/>}/><Route path="/admin/events" element={<Admin/>}/><Route path="/admin/media" element={<Admin/>}/><Route path="/admin/submissions" element={<Admin/>}/><Route path="/admin/users" element={<Admin/>}/><Route path="/admin/settings" element={<Admin/>}/>
  <Route path="*" element={<Placeholder title="Page not found" lead="The requested NexVibe route does not exist."/>}/>
</Route></Routes>}
