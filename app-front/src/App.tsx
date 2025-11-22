import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EvaluacionList from './modules/evaluaciones/EvaluacionList';

function App() {


  return (
    <Router>
      <Routes>
        {/* Ruta base "/" renderiza SexoList */}
        <Route path="/" element={<Layout />} >

        <Route path="evaluaciones" element={<EvaluacionList />} />
        {/* <Route path="alumnos" element={<AlumnoList />} /> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App;