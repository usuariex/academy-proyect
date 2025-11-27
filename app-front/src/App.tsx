import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EvaluationList from './modules/evaluations/EvaluationList';
import EvaluationsLayout from './modules/evaluations/EvaluationsLayout';
import EvaluationWizard from './modules/evaluations/EvaluationWizard';
import StudentsLayout from './modules/students/layouts/StudentsLayout/StudentsLayout';
import StudentsPage from './modules/students/pages/StudentsPage/StudentsPage';
import HomePage from './modules/home/pages/HomePage';
import StudentsCreatePage from './modules/students/pages/StudentsCreatePage/StudentsCreatePage';

function App() {
  return (
    <Router>
      <Routes>

        {/* Ruta base con Layout general */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Sección Evaluaciones con sub-layout */}
          <Route path="evaluations" element={<EvaluationsLayout />}>
            <Route index element={<EvaluationList />} />
            <Route path="create" element={<EvaluationWizard />} />
          </Route>


          <Route path="students" element={<StudentsLayout />}>
            <Route index element={<StudentsPage />} />
            <Route path="create" element={<StudentsCreatePage />} />
          </Route>
          

        </Route>

      </Routes>
    </Router>
  )
}

export default App;
