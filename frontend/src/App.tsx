import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import { MantineProvider } from '@mantine/core'
import TopicPage from './pages/TopicPage'
import DashboardPage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserProvider } from './contexts/UserContext'

function App() {
	
  return (
    <>
			<MantineProvider>
				<UserProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="/topic" element={<TopicPage />} />
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/quiz" element={<QuizPage />} />
						</Routes>
					</BrowserRouter>
				</UserProvider>
			</MantineProvider>
    </>
  )
}

export default App
