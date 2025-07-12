import { IconMedal } from '@tabler/icons-react';
import { Flex, Progress, Text, ThemeIcon } from '@mantine/core';

const categories = ["Overall", "Level 1 - 2 ", "Level 3 - 4", "Level 5"]

export function ScoreCard({ data } : { data: number[] }) {
  return (
    <Flex direction={'column'} align={'center'} p="md" gap={'xs'} w={"100%"}>
      <ThemeIcon size={50} radius={60}>
        <IconMedal size={32} stroke={1.5} />
      </ThemeIcon>

      <Text ta="center" fw={700}>
        Well Done!
      </Text>
      <Text c="dimmed" ta="center" fz="sm">
        {42} Questions Completed
      </Text>

      <Flex direction={'column'} justify={"flex-start"} w="100%">
        {categories.map((c, i) => 
          <div className='mt-2'>
            <Flex gap={8} mt="xs" justify={"space-between"}>
              <Text size="sm" c="dimmed" tt="uppercase" fw={c === "Overall" ? 700 : 400}>
                {c}
              </Text>
              <Text size="sm" c="dimmed" tt="uppercase" fw={c === "Overall" ? 700 : 400}>
                {data[i]}%
              </Text>
            </Flex>
            <Progress value={data[i]} mt={5} />
          </div>
        )}
        
      </Flex>
    </Flex>
  );
}