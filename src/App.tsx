
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Education from './pages/Education';
import Detection from './pages/Detection';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AnalyzeReport from './pages/AnalyzeReport';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/detect" element={
              <PrivateRoute>
                <Detection />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/analyze" element={
              <PrivateRoute>
                <AnalyzeReport />
              </PrivateRoute>
            } />
            <Route path="/education" element={<Education />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
