import { useNavigate } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';
import { TeacherTopicView } from '../components/topic/TeacherTopicView';
import { StudentTopicView } from '../components/topic/StudentTopicView';

const TopicPage = () => {
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
			{user.role === "teacher" ? <TeacherTopicView /> : <StudentTopicView />}
		</>
  );
}

export default TopicPage;