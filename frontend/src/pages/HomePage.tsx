import { useNavigate } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { TeacherDashboardView } from '../components/dashboard/TeacherDashboardView';
import { StudentDashboardView } from '../components/dashboard/StudentDashboardView';
import { useEffect } from 'react';

const HomePage = () => {
	const navigate = useNavigate();
	const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

  if (!user) return null; // optional: show a loading spinner here

  return (
		<>
			{user.role === "teacher" ? <TeacherDashboardView /> : <StudentDashboardView />}
		</>
  );
}

export default HomePage;