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

const DashboardPage = () => {
	const [openedTopicModal, { open: openTopicModal, close: closeTopicModal }] = useDisclosure(false);
	const [openedClassModal, { open: openClassModal, close: closeClassModal }] = useDisclosure(false);

	const [classes, setClasses] = useState<Class[]>([]);

	const navigate = useNavigate();
	const { user } = useUser();

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

	const [classIndex, setClassIndex] = useState(0);

  if (!user) return null; // optional: show a loading spinner here
  return (
		<Paper>
			<div className='mb-4'>
				<Flex justify='space-between' mb='lg'>
					<Text size='2rem'>My Classes</Text>
					<Button variant="light" onClick={openClassModal}>
						Create
					</Button>
					<CreateClassModal opened={openedClassModal} close={closeClassModal} />
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
				<StatsRing />
			</Flex>
			<Flex justify='space-between' mb='2rem'>
				<Text size='1.5rem'>Class Topics</Text>
				<Button variant="light" onClick={openTopicModal}>
					Add New
				</Button>
				<AddTopicModal opened={openedTopicModal} close={closeTopicModal} />
			</Flex>
			<TopicsCarousel />
		</Paper>
  );
}

export default DashboardPage;