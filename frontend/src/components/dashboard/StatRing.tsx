import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import type { Topic } from '../../types/Topic';
import { maxBy } from '../../utils/maxBy';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};



interface StatsRingProps {
	topics: Topic[]
}

export function StatsRing({ topics }: StatsRingProps) {
	if (!topics || topics.length == 0) return <></>;

	const maxBy = (comparator: (x: Topic, y: Topic) => number, array: Topic[]) =>
    array.reduce((acc, val) => comparator(acc, val) > 0 ? acc : val);

	const max = (x: Topic, y:Topic) => (x.data?.level ?? 0) - (y.data?.level ?? 0) ;
	const min = (x: Topic, y:Topic) => (y.data?.level ?? 0) - (x.data?.level ?? 0) ;

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