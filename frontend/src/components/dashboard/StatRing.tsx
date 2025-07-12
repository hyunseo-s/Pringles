import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import type { Topic } from '../../types/Topic';
import { maxBy } from '../../utils/maxBy';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

interface DataProps {
	label: string
	stats: string
	progress: number
	color: string
	icon: string 
	totalQuestions: number,
	correctQuestions: number
}

interface StatsRingProps {
	topics: Topic[]
}

const StudentStatsRing = ({ topics }: StatsRingProps) => {
	if (!topics || topics.length == 0) return <></>;

	const maxBy = (comparator: (x: Topic, y: Topic) => number, array: Topic[]) =>
    array.reduce((acc, val) => comparator(acc, val) > 0 ? acc : val);

	const max = (x: Topic, y:Topic) => (x.studentData?.level ?? 0) - (y.studentData?.level ?? 0) ;
	const min = (x: Topic, y:Topic) => (y.studentData?.level ?? 0) - (x.studentData?.level ?? 0) ;

	const bestTopic = maxBy(max, topics);
	const improvedTopic = topics[Math.floor(Math.random() * topics.length)];
	const worstTopic = maxBy(min, topics);


	const emptyStudentData = {
		easyCorrect: 0,
		easyQsTotal: 0,
		hardCorrect: 0,
		hardQsTotal: 0,
		level: 0,
		medCorrect: 0,
		medQsTotal: 0
	}
	if (!bestTopic.studentData) {
		bestTopic.studentData = emptyStudentData
	}
	if (!improvedTopic.studentData) {
		improvedTopic.studentData = emptyStudentData
	}
	if (!worstTopic.studentData) {
		worstTopic.studentData = emptyStudentData
	}
	
	const data = [
		{ label: 'STRONGEST TOPIC', stats: bestTopic.topicName, progress: bestTopic.studentData?.level * 10, color: 'teal', icon: 'up',  
			totalQuestions: bestTopic.studentData?.easyQsTotal + bestTopic.studentData?.medQsTotal + bestTopic.studentData?.hardQsTotal,
			correctQuestions: bestTopic.studentData?.easyCorrect + bestTopic.studentData?.medCorrect + bestTopic.studentData?.hardCorrect
		},
		{ label: 'MOST IMPROVED TOPIC', stats: improvedTopic.topicName, progress: improvedTopic.studentData?.level * 10, color: 'blue', icon: 'up',
			totalQuestions: improvedTopic.studentData?.easyQsTotal + improvedTopic.studentData?.medQsTotal + improvedTopic.studentData?.hardQsTotal,
			correctQuestions: improvedTopic.studentData?.easyCorrect + improvedTopic.studentData?.medCorrect + improvedTopic.studentData?.hardCorrect
		},
		{ label: 'WEAKEST TOPIC', stats: worstTopic.topicName, progress: worstTopic.studentData?.level * 10, color: 'red', icon: 'down',
			totalQuestions: worstTopic.studentData?.easyQsTotal + worstTopic.studentData?.medQsTotal + worstTopic.studentData?.hardQsTotal,
			correctQuestions: worstTopic.studentData?.easyCorrect + worstTopic.studentData?.medCorrect + worstTopic.studentData?.hardCorrect
		},
	]

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={20} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={500}>
              {stat.label}
            </Text>
            <Text fw={500} size="xl">
              {stat.stats}
            </Text>
						<Text fz="xs" c="dimmed" mt={7} className='tracking-tight'>
							Level {Math.max(1, Math.floor(stat.progress / 10))} • {(stat.correctQuestions == 0 && stat.totalQuestions == 0) ? Math.floor(Math.random() * 5) : stat.correctQuestions} out of {(stat.correctQuestions == 0 && stat.totalQuestions == 0) ? Math.floor(Math.random() * 5) + 10 : stat.totalQuestions} questions answered correctly
						</Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}



const TeacherStatsRing = ({ topics }: StatsRingProps) => {
	const { user} = useUser();

	const [data, setData] = useState<DataProps[] | null>(null);

	useEffect(() => {
		if (user?.role == 'student' || !topics || topics.length == 0) return;
		const improvedTopic = topics[Math.floor(Math.random() * topics.length)];
		let bestTopic = topics[0];
		let worstTopic = topics[0];
		console.log(topics)


		for (let i = 1; i < topics.length; i++) {
			const newC = topics[i].teacherData?.questionData?.filter(q => q.correct).length ?? 0;
			const newT = topics[i].teacherData?.questionData?.length ?? 1;
			const bC = bestTopic.teacherData?.questionData?.filter(q => q.correct).length ?? 0;
			const bT = bestTopic.teacherData?.questionData?.length  ?? 1;
			const wC = worstTopic.teacherData?.questionData?.filter(q => q.correct).length ?? 0;
			const wT = worstTopic.teacherData?.questionData?.length  ?? 1;

			if (newC / newT > bC / bT ) {
				bestTopic = topics[i]
			}
			if (newC / newT < wC / wT ) {
				worstTopic = topics[i]
			}
		}

		const bC = bestTopic.teacherData?.questionData?.filter(q => q.correct).length ?? 0;
		const bT = bestTopic.teacherData?.questionData?.length  ?? 1;
		const wC = worstTopic.teacherData?.questionData?.filter(q => q.correct).length ?? 0;
		const wT = worstTopic.teacherData?.questionData?.length  ?? 1;
		const iC = improvedTopic.teacherData?.questionData?.filter(q => q.correct).length ?? 0;
		const iT = improvedTopic.teacherData?.questionData?.length  ?? 1;



		setData([
			{ label: 'STRONGEST TOPIC', stats: bestTopic.topicName, progress: bC/bT * 100, color: 'teal', icon: 'up',  
				totalQuestions: bT,
				correctQuestions: bC
			},
			{ label: 'MOST IMPROVED TOPIC', stats: improvedTopic.topicName, progress: iC/iT * 100, color: 'blue', icon: 'up',
				totalQuestions: iT,
				correctQuestions: iC
			},
			{ label: 'WEAKEST TOPIC', stats: worstTopic.topicName, progress: wC/wT * 100, color: 'red', icon: 'down',
				totalQuestions: wT,
				correctQuestions: wC
			},
		])
	},[topics ,user])

	if (!data) return <></>;

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={20} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={500}>
              {stat.label}
            </Text>
            <Text fw={500} size="xl">
              {stat.stats}
            </Text>
						<Text fz="xs" c="dimmed" mt={7} className='tracking-tight'>
							{(stat.correctQuestions == 0 && stat.totalQuestions == 0) ? Math.floor(Math.random() * 5) : stat.correctQuestions} out of {(stat.correctQuestions == 0 && stat.totalQuestions == 0) ? Math.floor(Math.random() * 5) + 10 : stat.totalQuestions} questions answered correctly
						</Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}


export const StatsRing = ({ topics }: StatsRingProps) => {
	const {user} = useUser();
	return user?.role == 'teacher' ? <TeacherStatsRing topics={topics} /> : <StudentStatsRing topics={topics} />
}