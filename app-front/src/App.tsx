import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/LayoutGlobal';
import EvaluationList from './pages/evaluations/EvaluationList';
import EvaluationsLayout from './pages/evaluations/EvaluationsLayout';
import EvaluationWizard from './pages/evaluations/EvaluationWizard';
import StudentsLayout from './pages/students/StudentsLayout';
import { StudentDashboardView, StudentsCreateView } from '@students/View';

import HomePage from './pages/home/pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />


          <Route path="evaluations" element={<EvaluationsLayout />}>
            <Route index element={<EvaluationList />} />
            <Route path="create" element={<EvaluationWizard />} />
          </Route>


          <Route path="students" element={<StudentsLayout />}>
            <Route index element={<StudentDashboardView />} />
            <Route path="create" element={<StudentsCreateView />} />
          </Route>


        </Route>

      </Routes>
    </Router>
  )
}

export default App;
