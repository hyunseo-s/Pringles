import { Carousel } from '@mantine/carousel';
import { Badge } from '@mantine/core';
import { useNavigate } from 'react-router';
import type { Topic } from '../../types/Topic';

interface LevelBadgeProps {
	level: number
}

interface TopicsCarouselProps {
	topics: Topic[]
}

export const TopicsCarousel = ({ topics }: TopicsCarouselProps) => {

	const navigate = useNavigate();

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
    >
      {topics && topics.map((t, i) => {
				return (
					<Carousel.Slide key={i}>
						<div className='hover:cursor-pointer' onClick={() => navigate(`/topic/${t.topic}`)}>
							<div className= 'h-50 bg-white rounded-xl border-gray-200' style={{ borderWidth: '1px'}}>
							</div>
							<div style={{background: 'rgba(0, 0, 0, .1)'}}
								className='h-15 p-3 flex justify-between absolute bottom-0 w-[calc(100%-1rem)] rounded-b-xl'>
								<p className='font-[400] text-xl'>{t.topicName}</p>
								{ t.data && t.data.level && <LevelBadge level={t.data.level} />}
							</div>
						</div>
					</Carousel.Slide>
				)
			})}
    </Carousel>
  );
}