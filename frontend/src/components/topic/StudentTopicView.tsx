import { ActionIcon, Button, Flex } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import type { TopicProps } from "./TeacherTopicView";
import { useParams } from 'react-router-dom';
import StudentStats from "./StudentStats.tsx";

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
			<Flex align="center" justify='space-between' className="mt-18">
				<Flex direction="column" gap={"3.5rem"}>
					<p className="text-6xl">
						{topic.name}
					</p>
					<Button radius="xl" w="200" onClick={() => handleStart()}>START PRACTICE</Button>
				</Flex>
				<Flex>
					<StudentStats />
				</Flex>
			</Flex>


		</Flex>
	)
}