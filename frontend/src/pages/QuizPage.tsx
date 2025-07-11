import { useNavigate } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const QuizPage = () => {
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
		Quiz
		</>
  );
}

export default QuizPage;