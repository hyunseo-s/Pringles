import { Flex, Group, RingProgress, Text, useMantineTheme } from '@mantine/core';
import classes from './StudentStats.module.css';

const stats = [
  { value: 447, label: 'Best Score' },
  { value: 447, label: 'Average Score' },
];

const StudentStats = () => {
  const theme = useMantineTheme();
  const completed = 1887;
  const total = 2334;
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Flex gap={50}>
        <div className={classes.ring}>
            <RingProgress
            roundCaps
            thickness={6}
            size={170}
            sections={[{ value: (completed / total) * 100, color: theme.primaryColor }]}
            label={
                <div>
                <Text ta="center" fz="1.5rem" className={classes.label}>
                    {((completed / total) * 100).toFixed(0)}%
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                    Last Attempt
                </Text>
                </div>
            }
        />
        </div>
        
        <div>
            <div>
            <Text className={classes.lead} mt={30}>
                1887
            </Text>
            <Text fz="xs" c="dimmed">
                Questions Completed
            </Text>
            </div>
            <Group mt="lg">{items}</Group>
        </div>
    </Flex>
  );
}

export default StudentStats;