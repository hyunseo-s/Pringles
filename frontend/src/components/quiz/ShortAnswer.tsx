import { Textarea } from "@mantine/core";

const ShortAnswer = ({
  input,
  correct
}: {
  input: React.Dispatch<React.SetStateAction<string | null>>, 
  correct: boolean | null
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value === '') {
      input(null);
    } else {
      input(e.currentTarget.value);
    }
  }

  return (
    <div>
      <Textarea w={500}
        autosize
        variant="filled"
        placeholder="Type your answer here (max 150 characters)"
        onChange={(e) => handleChange(e)}
        maxLength={150}
        minRows={4}
        styles={(theme) => ({
          input : {
            background: correct === null ? theme.colors.gray[1] : correct ? theme.colors.green[1] : theme.colors.red[1],
            color: 'black',
            opacity: 1
          }
        })}
        disabled={correct !== null}
      />
    </div>
  )
}

export default ShortAnswer;