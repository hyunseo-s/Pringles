import { Button, Stack, type DefaultMantineColor } from "@mantine/core";
import { useState } from "react";

const MultipleChoice = ({ 
	options, 
	answer, 
	correct
} : { 
	answer: React.Dispatch<React.SetStateAction<string | null>>, 
	correct: boolean | null, 
	options: {id: string, label: string}[]
}) => {
	const [selected, setSelected] = useState<string | null>(null);

	const handleClick = (id: string) => {
		// Disables clicks after submitting answer
		if (correct !== null) {
			return;
		}

		if (selected === id) {
			setSelected(null);
			answer(null)
		} else {
			setSelected(id);
			answer(id);
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
				{options.map(({ id, label }) => (
					<Button variant="light" w={500} color={setColours(id)} justify='flex-start' styles={{ 
						root: { 
							'--button-height': 'auto',
							paddingTop: 'var(--button-padding-x-xs)',
							paddingBottom: 'var(--button-padding-x-xs)'
						},
						label: {
							whiteSpace: 'normal',
							fontWeight: selected === id ? 'bold' : 'normal',
							color: selected === id ? 'var(--button-color)' : '#2e2e2e',
						}
					}}
					onClick={() => handleClick(id)}
					>
						{label}
					</Button>
				))}
    		</Stack>
		</div>
	)
}

export default MultipleChoice