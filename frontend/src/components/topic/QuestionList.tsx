import cx from 'clsx';
import { ActionIcon, Anchor, InputLabel, NumberInput, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from './QuestionList.module.css';
import { useEffect, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import type { Topic } from '../../types/Topic';

export interface TopicProps {
  topic: Topic;
}

export interface QuestionInfo {
  questionid: number;
  question: string;
  answers: string[];
  correct: number;
	level: number;
	total: number
}

export function QuestionList({ topic }: TopicProps) {
  const [questions, setQuestions] = useState<QuestionInfo[]>([]);

  useEffect(() => {
    if (!topic?.teacherData?.questionData) return;

    const aggregated = topic.teacherData.questionData.reduce((acc, curr) => {
      const { questionid, question, answer, correct,level } = curr;
			console.log(curr)
      if (!acc[questionid]) {
        acc[questionid] = {
          questionid,
          question,
					level,
          answers: [],
          correct: 0,
					total: 0
        };
      }

      acc[questionid].answers.push(answer);
			acc[questionid].total += 1;
      if (correct) acc[questionid].correct += 1;

      return acc;
    }, {} as Record<number, QuestionInfo>);
    setQuestions(Object.values(aggregated));
  }, [topic]);

  return (
    <div>
      {questions && questions.length > 0 && questions.map((item, index) => (
        <QuestionItem key={item.questionid} item={item} index={index} questions={questions} setQuestions={setQuestions} />
      ))}
    </div>
  );
}

const QuestionItem = ({ item, index, questions, setQuestions }) => {
  const [difficulty, setDifficulty] = useState(item.level);

  return (
    <div className={classes.item}>
      <Text className={classes.symbol}>{item.questionid}</Text>
      <div className="flex justify-between w-full">
        <div>
          <Text size="sm">{item.question}</Text>
          <div className="flex gap-2">
            <Anchor c="dimmed" size="sm" my="auto" className="hover:underline cursor-pointer">
              Answered {item.total} times*
            </Anchor>
            <Text c="dimmed" size="sm" my="auto"> • </Text>
            <div className="my-auto flex">
              <Text c="dimmed" size="sm" my="auto" mr="0.25rem">Difficulty</Text>
              <div className="w-10">
                <NumberInput
                  className={classes.input}
                  c="dimmed"
                  variant="unstyled"
                  value={difficulty}
                  onChange={setDifficulty}
                  min={1}
                  max={10}
                />
              </div>
            </div>
          </div>

        </div>
        <div className="flex gap-2 ml-8">
          <ActionIcon
            variant="outline"
            color="gray"
            size="sm"
            onClick={() => {
							const newQs = [...questions.slice(0, index), ...questions.slice(index + 1)];
 							 setQuestions(newQs);
						}}
          >
            <IconX />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};
