import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Welcome } from './pages/Welcome'
import { TopicsPage, TopicPage, PracticePage } from './pages/Learn'
import { WarmupPage, TestsPage, TestRun, Planner } from './pages/Tests'
import { FormulasPage } from './pages/Formulas'
import { ProgressPage, ParentPage } from './pages/Progress'
import { SettingsPage, MorePage } from './pages/Settings'
import { useStore } from './lib/store'
import { MasteryHome, MasterySession } from './pages/Mastery'

function MasteryKeyed() {
  const { id } = useParams()
  return <MasterySession key={id} />
}

function Gate({ children }: { children: React.ReactNode }) {
  const placed = useStore((s) => s.profile.placed)
  return placed ? <>{children}</> : <Navigate to="/welcome" replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Gate><Home /></Gate>} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/practice/:id" element={<PracticePage />} />
          <Route path="/warmup" element={<WarmupPage />} />
          <Route path="/master" element={<MasteryHome />} />
          <Route path="/master/:id" element={<MasteryKeyed />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:kind" element={<TestRun />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/formulas" element={<FormulasPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
