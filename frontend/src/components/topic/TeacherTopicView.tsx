import { ActionIcon, Progress } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import type { Topic } from "../../types/Topic"
import { TeacherStatsGrid } from "./TeacherStatsGrid"
import { useNavigate } from "react-router"
import { QuestionList } from "./QuestionList"
import { useEffect, useState } from "react"
import { get } from "../../utils/apiClient"
import { handleError } from "../../utils/handlers"
import type { QuestionData } from "../../types/QuestionData"
import { Scene } from "../lusion/Lusion"

export interface TopicProps {
	topic: Topic,
}

export const TeacherTopicView = ({ topic }: TopicProps) => {
	const navigate = useNavigate();
	const [avgLevel, setAvgLevel] = useState<number>(0);
	const [levels, setLevels] = useState<{easy: number, med: number, hard: number}>({easy: 0, med: 0, hard: 0});
	const [questions, setQuestions] = useState<{id: number, answered: number, question: string, difficulty: number}[]>([]);

	useEffect(() => {
		if (!topic.teacherData.questionData) {
			return;
		}
		
		const groupedByQuestionId = topic.teacherData.questionData.reduce((acc, curr) => {
			if (!acc[curr.questionid]) {
				acc[curr.questionid] = [];
			}
			acc[curr.questionid].push(curr);
			return acc;
		}, {} as Record<number, QuestionData[]>);

		const qs = Object.entries(groupedByQuestionId).map(
			([id, data]) => ({
				id: Number(id),
				answered: data.length,
				question: data[0].question,
				difficulty: data[0].level,
			})
		);
		setQuestions(qs);


		const fetchLevels = async () => {
			const res = await get(`/topic/${topic.classId}/students/level`, undefined);
			
			if (res.error) {
				handleError(res.error);
				return;
			}

			const t = res.find((t) => t.topicId === topic.topic);
			setLevels({ easy: t.easy, med: t.med, hard: t.hard });
			setAvgLevel( Math.floor((t.easy * 2.5 + t.med * 3.5 + t.hard * 5) / (t.easy + t.med + t.hard)) )
		}
		
		fetchLevels();
	}, [topic]);

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
				<Scene topicId={topic.topic} topicName={topic.topicName} />
			</div>
			<p className="text-3xl my-6">
				{topic.topicName}
			</p>
			<div className="flex gap-20 mb-10">
				<div className="flex flex-col">
					<div className="text-sm">
						Class Average Score
					</div>
					<div className="text-xl text-center my-3">
						{80}
					</div>
					<Progress value={80} />
				</div>
				<div className="flex flex-col">
					<div className="text-sm ">
						Class Average Level
					</div>
					<div className="text-xl text-center my-3">
						{avgLevel}
					</div>
					<Progress value={2 * avgLevel * 10} />
				</div>
			</div>
			<p className="text-2xl mb-4">
				Class Breakdown
			</p>
			<p className="text-lg mb-3">
				Students by Level
			</p>
			<TeacherStatsGrid levels={levels}/>
			<p className="text-lg mt-8 mb-6">
				Students by Question
			</p>
			<QuestionList questions={questions}/>
		</div>
	)
}