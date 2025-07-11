import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

export const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null; // optional: show loading spinner
}

export default HomePage;