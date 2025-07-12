import { Paper, Text } from "@mantine/core";

const Explanation = ({ 
	correct,
  answer,
  explanation
} : { 
	correct: boolean | null, 
  answer?: string,
	explanation?: string
}) => {
  return (
    <Paper w={500} px={20} py={10} bg={correct ? "green.1" : "red.1" }>
      <Text c={correct ? "green" : "red"} fw={600}>{correct ? "That's correct!" : "That's incorrect. The answer is: "}{answer}</Text>
      <Text c={correct ? "green" : "red"} fz="sm">{explanation}</Text>
    </Paper>
  )
}

export default Explanation;