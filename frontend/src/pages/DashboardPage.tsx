import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { Button, Flex, Paper, Text } from '@mantine/core';
import { ClassButton } from '../components/dashboard/ClassButton';
import { StatsRing } from '../components/dashboard/StatRing';
import { TopicsCarousel } from '../components/dashboard/TopicsCarousel';
import { useDisclosure } from '@mantine/hooks';
import { AddTopicModal } from '../components/dashboard/AddTopicModal';
import { CreateClassModal } from '../components/dashboard/CreateClassModal';
import { handleError, handleSuccess } from '../utils/handlers';
import { get, post } from '../utils/apiClient';
import type { Class } from '../types/Class';
import type { Topic } from '../types/Topic';

const DashboardPage = () => {
	const [openedTopicModal, { open: openTopicModal, close: closeTopicModal }] = useDisclosure(false);
	const [openedClassModal, { open: openClassModal, close: closeClassModal }] = useDisclosure(false);

	const [classes, setClasses] = useState<Class[]>([]);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [classIndex, setClassIndex] = useState(0);
	const { user } = useUser();

	useEffect(() => {
			const getTopics = async () => {
				const res = await get(`/topics/${classes[classIndex].classid}`, undefined);
	
				if (res.error) {
					handleError(res.error);
					return;
				}
	
				const newTopics = [];
	
				for (let i = 0; i < res.length; i++) {
					const topicData = await get(`/topic/${res[i].topic}/${user?.role}/data`, undefined);
					if (user?.role == 'teacher') {
						newTopics.push({...res[i], teacherData: topicData})
					} else {
						newTopics.push({...res[i], studentData: topicData})
					}
				}
	
				setTopics(newTopics);
			}
			if (classes.length == 0) return;
			getTopics();
		}, [classIndex, user, classes, openedTopicModal]);

	const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

	useEffect(() => {
		
		const getClasses = async () => {
			const res = await get("/classes", undefined);
			if (res.error) {
				handleError(res.error);
				return;
			}
			setClasses(res.classes);
		}
		getClasses();

  }, []);

	

  if (!user) return null; // optional: show a loading spinner here
  return (
		<Paper>
			<div className='mb-4'>
				<Flex justify='space-between' mb='lg'>
					<Text size='2rem'>My Classes</Text>
					{
					user.role == 'teacher' && (
						<>
							<Button variant="light" onClick={openClassModal}>
								Create
							</Button>
							<CreateClassModal opened={openedClassModal} close={closeClassModal} />
						</>
					)
				}
				</Flex>
				<Flex columnGap={24} rowGap={12} wrap='wrap'>
					{
						classes && classes.map((c, i) => 
						<ClassButton 
							active={classIndex == i} 
							onClick={() =>setClassIndex(i)}
						>
								{c.classname}
						</ClassButton>)
					}
				</Flex>
			</div>
			<hr style={{color: 'lightgray', marginBottom:'1.5rem'}}/>
			<Flex mb='2rem'>
				<StatsRing topics={topics} />
			</Flex>
			<Flex justify='space-between' mb='2rem'>
				<Text size='1.5rem'>Class Topics</Text>
				{
					user.role == 'teacher' && (
						<>
							<Button variant="light" onClick={openTopicModal}>
								Add New
							</Button>
							<AddTopicModal opened={openedTopicModal} close={closeTopicModal} />
						</>
					)
				}
			</Flex>
			{ classes.length != 0 && topics.length != 0  && <TopicsCarousel topics={topics} />}
			
		</Paper>
  );
}

export default DashboardPage;