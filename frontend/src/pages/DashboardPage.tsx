import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { Button, Flex, Paper, Text } from '@mantine/core';
import { ClassButton } from '../components/dashboard/ClassButton';
import { StatsRing } from '../components/dashboard/StatRing';
import { TopicsCarousel } from '../components/dashboard/TopicsCarousel';

const DashboardPage = () => {
	const navigate = useNavigate();
	const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

	const [classIndex, setClassIndex] = useState(0);

	const classes = [
		"YEAR 10 MATHS",
		"YEAR 11 MATHS",
		"YEAR 12 MATHS",
	]

  if (!user) return null; // optional: show a loading spinner here


  return (
		<Paper>
			<div className='mb-4'>
				<Flex justify='space-between' mb='lg'>
					<Text size='2rem'>My Classes</Text>
					<Button>Create</Button>
				</Flex>
				<Flex gap={24}>
					{
						classes.map((c, i) => 
						<ClassButton 
							active={classIndex == i} 
							onClick={() =>setClassIndex(i)}>
								{c}
						</ClassButton>)
					}
				</Flex>
			</div>
			<hr style={{color: 'lightgray', marginBottom:'1.5rem'}}/>
			<Flex mb='2rem'>
				<StatsRing />
			</Flex>
			<Flex justify='space-between' mb='2rem'>
				<Text size='1.5rem'>Class Topics</Text>
				<Button>Add New</Button>
			</Flex>
			<TopicsCarousel />
		</Paper>
  );
}

export default DashboardPage;