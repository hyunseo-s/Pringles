import { Button, Stack, type DefaultMantineColor } from "@mantine/core";
import { useState } from "react";
import type { Options } from "../../pages/QuizPage";

const MultipleChoice = ({ 
	input,
	options,
	correct
} : { 
	input: React.Dispatch<React.SetStateAction<string | null>>, 
	correct: boolean | null, 
	options?: Options[]
}) => {
	const [selected, setSelected] = useState<string | null>(null);

	const handleClick = (id: string) => {
		// Disables clicks after submitting answer
		if (correct !== null) {
			return;
		}

		if (selected === id) {
			setSelected(null);
			input(null)
		} else {
			setSelected(id);
			input(id);
		}
	};

	const setColours = (id: string) : DefaultMantineColor => {
		if (correct === null && selected === id) {
			return "blue";
		} else if (correct !== null && selected === id && correct) {
			return "green";
		} else if (correct !== null && selected === id && !correct) {
			return "red";
		}

		return "gray"
	}

	return (
		<div>
			<Stack style={{ width: 500 }} gap={"xs"}>
				{options && options.map((o, i) => (
					<Button key={i} variant="light" w={500} color={setColours(o.answerOption)} justify='flex-start' styles={{ 
						root: { 
							'--button-height': 'auto',
							paddingTop: 'var(--button-padding-x-xs)',
							paddingBottom: 'var(--button-padding-x-xs)'
						},
						label: {
							whiteSpace: 'normal',
							fontWeight: selected === o.answerOption ? 'bold' : 'normal',
							color: selected === o.answerOption ? 'var(--button-color)' : '#2e2e2e',
						}
					}}
					onClick={() => handleClick(o.answerOption)}
					>
						{o.answerOption}
					</Button>
				))}
    		</Stack>
		</div>
	)
}

export default MultipleChoice