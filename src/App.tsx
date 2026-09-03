import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ContentDetailPage } from './pages/ContentDetailPage';
import { AipmInterviewPage } from './pages/AipmInterviewPage';
import { AipmArticlePage } from './pages/AipmArticlePage';
import { AipmModulePage } from './pages/AipmModulePage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="aipm" element={<AipmInterviewPage />} />
        <Route path="aipm/:moduleId" element={<AipmModulePage />} />
        <Route path="aipm/:moduleId/*" element={<AipmArticlePage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="content/:id" element={<ContentDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
      </Route>
    </Routes>
  );
}
