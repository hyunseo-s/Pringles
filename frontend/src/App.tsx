import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import { MantineProvider } from '@mantine/core'
import TopicPage from './pages/TopicPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserProvider } from './context/UserContext'
import { Notifications } from '@mantine/notifications'
import NavBar from './components/NavBar'

function App() {
	
  return (
    <>
			<MantineProvider>
				<Notifications />
				<UserProvider>
					<BrowserRouter>
						<NavBar />
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="/topic/:topicId" element={<TopicPage />} />
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/quiz/:topicId/:sessionId" element={<QuizPage />} />
						</Routes>
					</BrowserRouter>
				</UserProvider>
			</MantineProvider>
    </>
  )
}

export default App
