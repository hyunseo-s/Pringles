import { Carousel } from '@mantine/carousel';
import { Badge, Pill } from '@mantine/core';

interface LevelPillProps {
	level: number
}

export const TopicsCarousel = () => {
	const topics = [
		{name: 'Linear independence', level: 1},
		{name: 'Change of Basis', level: 4},
		{name: 'Eigenvectors', level: 10},
		{name: 'Determinants', level: 2},
		{name: 'Inverse Matrices', level: 7}
	]

	const LevelBadge = ({ level }: LevelBadgeProps) => {
		if (level > 7) return <Badge color='green'>Strong</Badge>
		if (level > 3) return <Badge color='yellow'>Medium</Badge>
		return <Badge color='red'>Weak</Badge>
	}

  return (
    <Carousel
      withIndicators
      height={200}
      slideSize="33.333333%"
      slideGap="md"
      align="start"
    >
      { topics.map((t, i) => {
				return (
					<Carousel.Slide key={i}>
						<div className= 'h-50 bg-white rounded-xl border-gray-200' style={{ borderWidth: '1px'}}>
						</div>
						<div style={{background: 'rgba(0, 0, 0, .1)'}}
						  className='h-15 p-3 flex justify-between absolute bottom-0 w-[calc(100%-1rem)] rounded-b-xl'>
							<p className='font-[400] text-xl'>{t.name}</p>
							<LevelBadge level={t.level} />
						</div>
					</Carousel.Slide>
				)
			})}
    </Carousel>
  );
}