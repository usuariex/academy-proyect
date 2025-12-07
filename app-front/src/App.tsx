import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutGlobal } from '@/components/layout';
import {
  EvaluationListView,
  EvaluationsLayout,
  EvaluationWizard
} from '@evaluations/view';
import {
  StudentDashboardView,
  StudentsCreateView,
  StudentsLayout
} from '@students/View';

import HomePage from './pages/home/HomePage';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LayoutGlobal />}>
          <Route index element={<HomePage />} />


          <Route path="evaluations" element={<EvaluationsLayout />}>
            <Route index element={<EvaluationListView />} />
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
