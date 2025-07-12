import { ActionIcon, Button, Divider, Flex, Paper, Text } from "@mantine/core"
import { IconArrowDown, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import type { TopicProps } from "./TeacherTopicView";
import StudentStats, { type StudentStatsType } from "./StudentStats.tsx";
import { useRef } from "react";
import { post } from "../../utils/apiClient.ts";
import { Scene } from "../lusion/Lusion.tsx";

const studentSnapshot : StudentStatsType[] = [
	{ title: 'Best Session Score', icon: 'star', value: '90', diff: 18 },
    { title: 'Current Level', icon: 'target', value: '80' },
    { title: 'Questions Completed', icon: 'answer', value: '745', diff: 18 }
]

const studentLevels : StudentStatsType[] = [
	{ title: 'Level 1-2 Questions', icon: 'level1', value: '90 / 100'},
    { title: 'Level 3-4 Questions', icon: 'level2', value: '80 / 100'},
    { title: 'Level 5 Questions', icon: 'level3', value: '7 / 100' }
]

const previousQs = [{ type: "written answer", level: 1, question: "Explain the process of photosynthesis in plants."}, { type: "multiple", level: 2, question: "Which planet is known as the 'Red Planet'?"}];

export const StudentTopicView = ({ topic }: TopicProps) => {
	const navigate = useNavigate();
	const targetRef = useRef<HTMLDivElement>(null);

	const handleStart = async () => {
		const res = await post(`/session/${topic.classId}/${topic.topic}/start`, undefined);
		if (res.error) return;
		navigate(`/quiz/${topic.topic}/${res.sessionId}`)
	}

	const scrollToTarget = () => {
		targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
				<Scene topicId={topic.topic} topicName={topic.topicName} />
			</div>
			{/* Progress Report */}
			<Flex align="center" justify='space-between' className="my-18">
				<Flex direction="column" gap={"3.5rem"}>
					<p className="text-6xl">
						{topic.topicName}
					</p>

					<Button radius="xl" w="200" onClick={() => handleStart()}>START PRACTICE</Button>
				</Flex>
				<Flex direction="column" gap="md">
					<StudentStats data={studentSnapshot} />
				</Flex>
			</Flex>

			<Divider	
				my="xs"
				label={
					<Button 
						variant="subtle" 
						radius={"xl"} 
						leftSection={<IconArrowDown size={14}/>}
						onClick={scrollToTarget}
					>
						View Previous Peformance
					</Button>
				}
			/>

			{/* Student Level Report */}
			<div className="mt-18" ref={targetRef}>
				<Text fz={"1.5rem"} mb="xl">Level Performance</Text>
				<StudentStats data={studentLevels}/>
			</div>
			
			{/* Previous Questions */}
			<div className="mt-18">
				<Text fz={"1.5rem"} mb="xl">Review Completed Questions</Text>
				<Flex align={"center"} direction={"column"} gap={"lg"}>
					{/* Written Answer */}
					{previousQs.map((q, i) =>  
						<Paper withBorder p="md" radius="md" w={700}>
							<Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={10}>
								Level {q.level}
							</Text>
							<Text fw={500}>{q.question}</Text>

							{q.type === "multiple" && (
								<>
									<Paper p="xs" radius="md" m={"md"} bg={"gray.1"}>Earth</Paper>
									<Paper p="xs" radius="md" m={"md"} bg={"gray.1"}>Venus</Paper>
									<Paper p="xs" radius="md" m={"md"} bg={"gray.1"}>Mars</Paper>
									<Paper p="xs" radius="md" m={"md"} bg={"gray.1"}>Jupiter</Paper>
								</>
							)}	
						</Paper>
					)}
					
				</Flex>
			</div>

		</Flex>
	)
}