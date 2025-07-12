import { Carousel } from '@mantine/carousel';
import { Badge } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { get } from '../../utils/apiClient';

interface LevelBadgeProps {
	level: number
}

interface TopicsCarouselProps {
	classId: number
}

export const TopicsCarousel = ({ classId }: TopicsCarouselProps) => {

	useEffect(() => {
		const getTopics = async () => {
			const res = await get("/topics", undefined);
			// if (res.error) {
			// 	handleError(res.error);
			// 	return;
			// }
			// setClasses(res.classes);
		}
		getTopics();
	}, [])
	const topics = [
		{name: 'Linear independence', level: 1, id: 1},
		{name: 'Change of Basis', level: 4, id: 2},
		{name: 'Eigenvectors', level: 10, id: 3},
		{name: 'Determinants', level: 2, id: 4},
		{name: 'Inverse Matrices', level: 7, id: 5},
	]

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
      align="start"
    >
      { topics.map((t, i) => {
				return (
					<Carousel.Slide key={i}>
						<div className='hover:cursor-pointer' onClick={() => navigate(`/topic/${t.id}`)}>
							<div className= 'h-50 bg-white rounded-xl border-gray-200' style={{ borderWidth: '1px'}}>
							</div>
							<div style={{background: 'rgba(0, 0, 0, .1)'}}
								className='h-15 p-3 flex justify-between absolute bottom-0 w-[calc(100%-1rem)] rounded-b-xl'>
								<p className='font-[400] text-xl'>{t.name}</p>
								<LevelBadge level={t.level} />
							</div>
						</div>
					</Carousel.Slide>
				)
			})}
    </Carousel>
  );
}