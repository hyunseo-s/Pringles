import { useNavigate, useParams } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import MultipleChoice from '../components/quiz/MultipleChoice';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ShortAnswer from '../components/quiz/ShortAnswer';
import Explanation from '../components/quiz/Explanation';
import Question from '../components/quiz/Question';
import { ScoreCard } from '../components/quiz/ScoreCard';
import { post } from '../utils/apiClient';

const questions: Prompt[] = [
  {
    question: `Let $x = 5$. Then \\( x^2 = 25 \\).`,
    type: "multiple",
    answer: [{
      answerOption: "1",
      correct: false,
      rationale: "this is just wrong 1"
    },{
      answerOption: "2",
      correct: true,
      rationale: ""
    },{
      answerOption: "3",
      correct: false,
      rationale: "this is just wrong 3"
    },{
      answerOption: "4",
      correct: false,
      rationale: "this is just wrong 4"
    },
    ]
  }, {
    question: "What is the longest river in the world, and through which countries does it flow?",
    type: "written answer"
  }
]

type Prompt = {
  question: string;
  type: "multiple" | "written answer";
  answer?: Options[]
}

export type Options = {
  answerOption: string;
  correct: boolean;
  rationale: string;
}

export type WrittenSolution = {
  correct: boolean;
  rationale: string;
}

const QuizPage = () => {
	const navigate = useNavigate();
  const { topicId, sessionId } = useParams();
	const { user } = useUser();

  // Fetched Data
  const [ prompt, setPrompt] = useState<Prompt>(questions[0]);
  const [ correct, setCorrect ] = useState<boolean | null>(null);
  const [ explanation, setExplanation] = useState<string>();
  
  // User Input
  const [ input, setInput ] = useState<string | null>(null);

  // Modal
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

  if (!user) return null; // optional: show a loading spinner here

  const fetchQuestion = async () => {
		const res = await post('/session/question', { topicId });
		console.log(res);
    setPrompt(questions[1]);
  }

  const handleSubmit = () => {
    // Check if user input is correct for multiple choice answer
    if (prompt.type === "multiple") {
      setCorrect(input === prompt.answer?.find((o) => o.correct)?.answerOption);
      setExplanation(prompt.answer?.find((o) => o.answerOption === input)?.rationale);
      return;
    }
    
    // Check if user input is correct for written answer
    const fetchCorrect = () => {
      // calls /session/{classId}/{topicId}/{sessionId}/{questionId}/answer
      const res : WrittenSolution = {correct: true, rationale: "This is the reason"};
      setCorrect(res.correct);
      setExplanation(res.rationale);
    }

    fetchCorrect();
  }

  const handleNext = () => {
    setInput(null);
    setCorrect(null);
    fetchQuestion();
  }

  const handleFinish = () => {
    // navigate(`/topic/${topicId}`)
    navigate("/topic/0");
  }

  return (
		<Flex direction={"column"} justify="center" align="center" gap={20}>

      {/* Question */}
		  <div><Question question={prompt?.question}/></div>

      {/* User Answer Input */}
      {prompt?.type === "multiple" 
        ? <MultipleChoice input={setInput} correct={correct} options={prompt.answer}/>
        : <ShortAnswer input={setInput} correct={correct} />}

      {/* Explanation */}
      {correct !== null && <Explanation correct={correct} explanation={explanation}/>}

      {/* Control Buttons */}
      <Flex direction={'column'} gap={10}>
        {/* Submit / Next Buttons */}
        {correct === null
          ? 
          <Button 
            disabled={input === null} 
            onClick={() => handleSubmit()}
          >
            SUBMIT
          </Button>
          :
          <Button 
            color={correct ? "green" : "red"} 
            onClick={() => handleNext()}
          >
            NEXT
          </Button>
        }

        {/* Finish Button */}
        <Button variant="light" color="gray" onClick={open}>FINISH</Button>
      </Flex>

      {/* Confirmation Modal */}
      {/* <Modal opened={opened} onClose={close} title="Are you sure you want to end the session?" centered>
        <Flex direction={'column'} gap={20}>
          <Text size="sm">Your progress will be saved.</Text>
          <Flex justify={'space-between'}>
            <Button color="gray" variant='light' onClick={close}>CLOSE</Button>
            <Button color="red" onClick={handleFinish}>FINISH</Button>
          </Flex>
        </Flex>
      </Modal> */}

      {/* Session Score Modal */}
      <Modal opened={opened} onClose={close} centered>
        <Flex direction={'column'} gap={20} w={"100%"}>
          <ScoreCard data={[62, 32, 2, 5]}/>
          <Flex justify={'center'}>
            <Button color="blue" variant='light' onClick={handleFinish}>RETURN</Button>
          </Flex>
        </Flex>
      </Modal>

		</Flex>
  );
}

export default QuizPage;