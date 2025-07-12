import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCellSignal2,
  IconCellSignal3,
  IconCellSignal4,
} from '@tabler/icons-react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import classes from './TeacherStatsGrid.module.css';

const icons = {
  level1: IconCellSignal2,
  level2: IconCellSignal3,
  level3: IconCellSignal4,
};

const data = [
  { title: 'LEVEL 1-2', icon: 'level1', iconColor: 'red', value: '13,456', diff: 34 },
  { title: 'LEVEL 3-4', icon: 'level2', iconColor: 'orange', value: '4,145', diff: -13 },
  { title: 'LEVEL 5', icon: 'level3', iconColor: 'green', value: '745', diff: 18 },
] as const;

export function TeacherStatsGrid() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon color={stat.iconColor} className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
					{ stat.icon != 'level2' && 
						<Text c={(stat.diff > 0 && stat.icon != 'level1') || (stat.diff < 0 && stat.icon == 'level1') ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
							<span>{stat.diff}%</span>
							<DiffIcon size={16} stroke={1.5} />
						</Text>
					}
        </Group>
        <Text fz="xs" c="dimmed" mt={7}>
          Students in this level
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}