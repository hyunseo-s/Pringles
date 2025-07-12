import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { TeacherTopicView } from '../components/topic/TeacherTopicView';
import { StudentTopicView } from '../components/topic/StudentTopicView';
import type { Topic } from '../types/Topic';

const TopicPage = () => {
	const navigate = useNavigate();
	const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

  if (!user) return null; // optional: show a loading spinner here

	const topic: Topic = {
		name: 'Algebra'
	}

  return (
		<>
			{user.role === "teacher" ? <TeacherTopicView topic={topic} /> : <StudentTopicView topic={topic} />}
		</>
  );
}

export default TopicPage;