import { useNavigate, useParams } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { TeacherTopicView } from '../components/topic/TeacherTopicView';
import { StudentTopicView } from '../components/topic/StudentTopicView';
import { get } from '../utils/apiClient';
import { handleError } from '../utils/handlers';
import type { Topic } from '../types/Topic';

const TopicPage = () => {
	const navigate = useNavigate();
  const { topicId } = useParams(); 
	const { user } = useUser();
  const [topic, setTopic] = useState<Topic>({ topic: 0, topicName: '', teacherData: {}});
  
  useEffect(() => {
    const fetchTopicData = async () => {
      const id = parseInt(topicId ?? "0");

      // Fetch name of topic
      const name = await get(`/topics/${topicId}/name`, undefined);
      if (name.error) {
        handleError(name.error);
        return;
      }

      // Fetch topic data
      const res = await get(`/topic/${topicId}/${user?.role}/data`, undefined);
      if (res.error) {
        handleError(res.error);
        return;
      }

      const newTopic : Topic = {
        topic: id,
        topicName: name.topicname,
        teacherData: {}
      }

      if (user?.role === "student") {
        setTopic({ ...newTopic, studentData: res });
      } else {
        setTopic({ ...newTopic, teacherData: res });
      }
    }

    fetchTopicData();
  }, [user, topicId]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

  if (!user) return null; // optional: show a loading spinner here

  return (
		<>
			{user.role === "teacher" ? <TeacherTopicView topic={topic} /> : <StudentTopicView topic={topic} />}
		</>
  );
}

export default TopicPage;