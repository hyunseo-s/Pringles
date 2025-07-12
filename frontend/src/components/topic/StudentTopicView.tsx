import { ActionIcon, Button, Flex, Text } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import type { TopicProps } from "./TeacherTopicView";
import { useParams } from 'react-router-dom';
import StudentStats, { type StudentStatsType } from "./StudentStats.tsx";

const studentSnapshot : StudentStatsType[] = [
	{ title: 'Best Score', icon: 'star', value: '90', diff: 18 },
    { title: 'Average Score', icon: 'target', value: '80', diff: -18 },
    { title: 'Questions Completed', icon: 'answer', value: '745', diff: 18 }
]

const studentLevels : StudentStatsType[] = [
	{ title: 'Level 1-2', icon: 'level1', value: '90/100'},
    { title: 'Level 3-4', icon: 'level2', value: '80/100'},
    { title: 'Level 5', icon: 'level3', value: '7/100' }
]

export const StudentTopicView = ({ topic }: TopicProps) => {
	const navigate = useNavigate();
	// const { topicId } = useParams();

	const handleStart = async () => {
		// calls /session/{classId}/{topicId}/start
		// const res = await post("/session/{classId}/{topicId}/start", values);

		// navigate(`/quiz/${res.sessionId}`)
		navigate(`/quiz/0/0`)
	}

	return (
		<Flex direction="column">
			<ActionIcon
				variant="light"
				size="lg"
				aria-label="Back button"
				onClick={() => navigate('/dashboard')}
			>
				<IconArrowLeft />
			</ActionIcon>
			<div className="h-64 w-full bg-black mt-4">
				Banner
			</div>

			{/* Progress Report */}
			<Flex align="center" justify='space-between' className="mt-18">
				<Flex direction="column" gap={"3.5rem"}>
					<p className="text-6xl">
						{topic.name}
					</p>
					<Button radius="xl" w="200" onClick={() => handleStart()}>START PRACTICE</Button>
				</Flex>
				<Flex direction="column" gap="md">
					<StudentStats data={studentSnapshot} />
				</Flex>
			</Flex>

			{/* Student Level Report */}
			<div className="mt-42">
				<Text fz={"1.5rem"} mb="xl">Level Performance</Text>
				<StudentStats data={studentLevels}/>
			</div>
			
			{/* Previous Questions */}
			<div className="mt-30">
				<Text fz={"1.5rem"} mb="xl">Review Completed Questions</Text>
			</div>


		</Flex>
	)
}