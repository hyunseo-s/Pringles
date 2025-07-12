import { ActionIcon, Text } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import type { Topic } from "../../types/Topic"

interface TopicProps {
	topic: Topic
}

export const TeacherTopicView = ({ topic }: TopicProps) => {
	return (
		<div>
			<ActionIcon
				variant="filled"
				size="lg"
				aria-label="Gradient action icon"
				// variant="gradient"
				// gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
			>
				<IconArrowLeft />
			</ActionIcon>
			<div className="h-64 w-full bg-black mt-2">
				Banner
			</div>
			<Text size="xl">
				{topic.name}
			</Text>
		</div>
	)
}