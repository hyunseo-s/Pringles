import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import MultipleChoice from '../components/quiz/MultipleChoice';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ShortAnswer from '../components/quiz/ShortAnswer';
import Explanation from '../components/quiz/Explanation';

const options = [
  { id: "first", label: "First" },
  { id: "second", label: "Second" },
  { id: "third", label: "Third" },
  { id: "fourth", label: "Fourth" }
];

const options2 = [
  { id: "fifth", label: "Fifth" },
  { id: "sixth", label: "Sixth" },
  { id: "seventh", label: "Seventh" },
  { id: "eighth", label: "Eighth" }
];

const QuizPage = () => {
	const navigate = useNavigate();
	const { user } = useUser();
  const [ answer, setAnswer ] = useState<string | null>(null);
  const [ correct, setCorrect ] = useState<boolean | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [option, setOption] = useState<boolean>(true); // TO REMOVE

  useEffect(() => {
    if (!user) {
      navigate("/login"); // or whatever your login path is
    }
  }, [user, navigate]);

  if (!user) return null; // optional: show a loading spinner here

  const handleSubmit = () => {
    const fetchCorrect = () => {
      return "first";
    }

    setCorrect(fetchCorrect() === answer);
  }

  const handleNext = () => {
    setAnswer(null);
    setCorrect(null);
    setOption(!option);
  }

  const handleFinish = () => {
    navigate("/dashboard");
  }

  return (
		<Flex mih="100vh" maw="100vw" direction={"column"} justify="center" align="center" gap={20}>

      {/* Question */}
		  <div>What is the longest river in the world, and through which countries does it flow?</div>

      {/* User Answer Input */}
      <MultipleChoice answer={setAnswer} correct={correct} options={option ? options : options2}/>
      <ShortAnswer answer={setAnswer} correct={correct} />

      {/* Explanation */}
      {correct !== null && <Explanation correct={correct} answer={"first"} explanation='It is supposed to be first'/>}

      {/* Control Buttons */}
      <Flex direction={'column'} gap={10}>
        {/* Submit / Next Buttons */}
        {correct === null
          ? 
          <Button 
            disabled={answer === null} 
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
      <Modal opened={opened} onClose={close} title="Are you sure you want to end the session?" centered>
        <Flex direction={'column'} gap={20}>
          <Text size="sm">Your progress will be saved.</Text>
          <Flex justify={'space-between'}>
            <Button color="gray" variant='light' onClick={close}>CLOSE</Button>
            <Button color="red" onClick={handleFinish}>FINISH</Button>
          </Flex>
        </Flex>
      </Modal>
		</Flex>
  );
}

export default QuizPage;