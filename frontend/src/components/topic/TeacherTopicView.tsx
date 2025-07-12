import { ActionIcon, Progress, Text } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import type { Topic } from "../../types/Topic"
import { TeacherStatsGrid } from "./TeacherStatsGrid"
import { useNavigate } from "react-router"
import { QuestionList } from "./QuestionList"

export interface TopicProps {
	topic: Topic,
	classId: string
}

export const TeacherTopicView = ({ topic }: TopicProps) => {
	const navigate = useNavigate();
	return (
		<div>
			<ActionIcon
				variant="filled"
				size="lg"
				aria-label="Gradient action icon"
				onClick={() => navigate('/dashboard')}
				// variant="gradient"
				// gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
			>
				<IconArrowLeft />
			</ActionIcon>
			<div className="h-64 w-full bg-black mt-4">
				Banner
			</div>
			<p className="text-3xl my-6">
				{topic.name}
			</p>
			<div className="flex gap-20 mb-10">
				<div className="flex flex-col">
					<div className="text-sm">
						Class Average Score
					</div>
					<div className="text-xl text-center my-3">
						80
					</div>
					<Progress value={80} />
				</div>
				<div className="flex flex-col">
					<div className="text-sm ">
						Class Average Level
					</div>
					<div className="text-xl text-center my-3">
						6
					</div>
					<Progress value={6 * 10} />
				</div>
			</div>
			<p className="text-2xl mb-4">
				Topic Breakdown
			</p>
			<p className="text-lg mb-3">
				Students by Level
			</p>
			<TeacherStatsGrid />
			<p className="text-lg mt-8 mb-6">
				Students by Question
			</p>
			<QuestionList />
		</div>
	)
}