import { useNavigate, useParams } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import MultipleChoice from '../components/quiz/MultipleChoice';
import { Button, Flex, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ShortAnswer from '../components/quiz/ShortAnswer';
import Explanation from '../components/quiz/Explanation';
import Question from '../components/quiz/Question';
import { ScoreCard } from '../components/quiz/ScoreCard';
import { get, post, put } from '../utils/apiClient';
import { handleError } from '../utils/handlers';

const questions: Prompt[] = [
  {
    question: `Let $x = 5$. Then \\( x^2 = 25 \\).`,
    type: "multiple",
		questionId: 100,
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
	questionId: number;
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
  const [loading, setLoading] = useState(false);

  // Fetched Data
  const [ prompt, setPrompt] = useState<Prompt>(questions[0]);
  const [ correct, setCorrect ] = useState<boolean | null>(null);
  const [ explanation, setExplanation] = useState<string>();
  
  // User Input
  const [ input, setInput ] = useState<string | null>(null);

  // Modal
  const [opened, { open, close }] = useDisclosure(false);

	const [scoreData, setScoreData] = useState<[number, number, number, number]>([0,0,0,0])

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

	useEffect(() => {
		if (!topicId) return;
		const fetchQuestion = async () => {
      setLoading(true);
			const res = await get(`/session/${topicId}/${sessionId}/question`, undefined);
      setLoading(false);

			if (res.error) return;

			if (res.mode == 'multiple-choice') {
				const cleaned = res.question.replace(/```json\n|```/g, '');
				const parsed = JSON.parse(cleaned);
				console.log(cleaned, parsed)
				setPrompt({
					question: parsed.question,
					questionId: res.questionId,
					type: 'multiple',
					answer: parsed.options.map(option => ({
						correct: option.is_correct,
						rationale: option.rationale,
						answerOption: option.text
					}))
				});
			} else {
				setPrompt({
					questionId: res.questionId,
					question: res.question,
					type: 'written answer',
				})
			}
		}
		fetchQuestion()
	}, [topicId, sessionId])

  if (!user) return null; // optional: show a loading spinner here
	

  const handleSubmit = async () => {
    // Check if user input is correct for multiple choice answer
    if (prompt.type === "multiple") {
      setCorrect(input === prompt.answer?.find((o) => o.correct)?.answerOption);
      setExplanation(prompt.answer?.find((o) => o.answerOption === input)?.rationale);
			await put(`/session/${topicId}/${sessionId}/${prompt?.questionId}/multi/answer`, {
        answer: input,
        correct: input === prompt.answer?.find((o) => o.correct)?.answerOption
      });
      return;
    }
    
    // Check if user input is correct for written answer
    const fetchCorrect = async () => {
			const res = await put(`/session/${topicId}/${sessionId}/${prompt?.questionId}/answer`, {
				answer: input, topicId: topicId, sessionId: sessionId, questionId: prompt?.questionId
			})
			const cleaned = res.replace(/```json\n|```/g, '');
			const parsed = JSON.parse(cleaned);
      setCorrect(parsed.correct);
      setExplanation(parsed.rationale);
    }

    fetchCorrect();
  }

  const handleNext = () => {
    setInput(null);
    setCorrect(null);
    fetchNextQuestion();
  }

		const fetchNextQuestion = async () => {
      setLoading(true);
			const res = await get(`/session/${topicId}/${sessionId}/question`, undefined);
      setLoading(false);

			if (res.error) return;

			if (res.mode == 'multiple-choice') {
				const cleaned = res.question.replace(/```json\n|```/g, '');
				const parsed = JSON.parse(cleaned);
				setPrompt({
					question: parsed.question,
					questionId: res.questionId,
					type: 'multiple',
					answer: parsed.options.map(option => ({
						correct: option.is_correct,
						rationale: option.rationale,
						answerOption: option.text
					}))
				});
			} else {
				setPrompt({
					questionId: res.questionId,
					question: res.question,
					type: 'written answer',
				})
			}
		}


  const handleFinish = async() => {
		console.log('HELO')
		const res = await post(`/session/${topicId}/${sessionId}/end`, undefined);
		if (res.error) {
			handleError(res.error);
			return;
		}
    
		setScoreData([
			res.easyQsTotal + res.medQsTotal + res.hardQsTotal,
			Math.floor(res.easyCorrect / Math.max(res.easyQsTotal, 1) * 100),
			Math.floor(res.medCorrect / Math.max(res.medQsTotal, 1) * 100),
			Math.floor(res.hardCorrect / Math.max(res.hardQsTotal, 1) * 100),
		])
		open()
  }

  if (loading) {
    return (
      <Flex justify="center" align="center">
        <Loader size="lg" />
      </Flex>
    );
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
        <Button variant="light" color="gray" onClick={handleFinish}>FINISH</Button>
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
          <ScoreCard data={scoreData}/>
          <Flex justify={'center'}>
            <Button color="blue" variant='light' onClick={() => navigate(`/topic/${topicId}`)}>RETURN</Button>
          </Flex>
        </Flex>
      </Modal>

		</Flex>
  );
}

export default QuizPage;