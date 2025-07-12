import {
    IconArrowDownRight,
    IconArrowUpRight,
    IconCarambola,
    IconTarget,
    IconMessageReply,
    IconCellSignal2,
    IconCellSignal3,
    IconCellSignal4,

} from '@tabler/icons-react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
  
const icons = {
    star: IconCarambola,
    target: IconTarget,
    answer: IconMessageReply,
    level1: IconCellSignal2,
    level2: IconCellSignal3,
    level3: IconCellSignal4,
};

export type StudentStatsType = {
    title: string;
    icon: "star" | "target" | "answer" | "level1" | "level2" | "level3";
    value: string;
    diff?: number;
}
  
const StudentStats = ({ data } : { data: StudentStatsType[] }) => {
    const setColour = (icon: string) => {
        if (icon === "level1") {
            return "red";
        } else if (icon === "level2") {
            return "orange";
        } else if (icon === "level3") {
            return "green";
        }

        return "gray";
    } 

    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];
        const DiffIcon = stat.diff && stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        {stat.title}
                    </Text>
                    <Icon size={22} stroke={1.5} color={setColour(stat.icon)}/>
                </Group>
                
                <Group align="flex-end" gap="xs" mt={25}>
                    <Text fw={700} fz={"1.5rem"} lh={1}>{stat.value}</Text>
                    {stat.diff && <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className="flex items-center" lh={1}>
                        <span>{stat.diff}</span>
                        <DiffIcon size={16} stroke={1.5} />
                    </Text>}
                </Group>
            </Paper>
        );
    });

    return (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>{stats}</SimpleGrid>
    );
};

export default StudentStats;