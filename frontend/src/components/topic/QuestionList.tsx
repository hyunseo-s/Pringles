import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import cx from 'clsx';
import { ActionIcon, Anchor, InputLabel, NumberInput, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from './QuestionList.module.css';
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';

const data = [
  { position: 6, difficulty: 10, dateCreated: new Date(), symbol: '1', question: 'What is the powerhouse of the cell?' },
  { position: 7, difficulty: 8, dateCreated: new Date(), symbol: '2', question: 'What are the key differences between prokaryotic and eukaryotic cells?' },
  { position: 39, difficulty: 3, dateCreated: new Date(), symbol: '3', question: 'Describe the process of protein synthesis, starting from transcription to translation.' },
];

export function QuestionList() {
  const [state, handlers] = useListState(data);
  const items = state.map((item, index) => (
    <QuestionItem item={item} index={index} state={state} handlers={handlers}/>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const QuestionItem = ({ item, index, state, handlers }) => {
	const [difficulty, setDifficulty] = useState(item.difficulty);

	return (
		<Draggable key={item.symbol} index={index} draggableId={item.symbol}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text className={classes.symbol}>{item.symbol}</Text>
					<div className='flex justify-between w-full'>
						<div>
							<Text size='sm'>{item.question}</Text>
							<div className='flex gap-2'>
								<Anchor c="dimmed" size="sm" my='auto' className="hover:underline cursor-pointer">
									Answered {1 + Math.floor(Math.random() * 99)} times*
								</Anchor>
								<Text c="dimmed" size="sm" my='auto'> • </Text>
								<div className='my-auto flex'>
									<Text c="dimmed" size="sm" my='auto' mr={'0.25rem'}>Difficulty</Text>
									<div className='w-10'>
										<NumberInput
											className={classes.input}
											c={"dimmed"}
											variant="unstyled"
											value={difficulty}
											onChange={(e) => setDifficulty(e)}
											min={1}
											max={10}
										/>
									</div>
								</div>
							</div>
							<Text c="dimmed" size="sm">
								Created {item.dateCreated.toDateString()}
							</Text>
						</div>
						<div className='flex gap-2'>
							<div className='ml-8'>
								<ActionIcon
									variant="outline"
									color='gray'
									size='sm'
									aria-label="Gradient action icon"
									onClick={() => {handlers.remove(index)}}
									// variant="gradient"
									// gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
								>
									<IconX />
								</ActionIcon>
							</div>
						</div>
          </div>
        </div>
      )}
    </Draggable>
	)
}