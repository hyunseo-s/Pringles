import { Carousel } from "@mantine/carousel"
import { TopicsCarousel } from "../dashboard/TopicsCarousel"

export const TeacherTopicView = () => {
	return <>
		<Carousel maw={320} mx="auto" withIndicators height={200}>
      <Carousel.Slide size={200}>1</Carousel.Slide>
      <Carousel.Slide size={200}>2</Carousel.Slide>
      <Carousel.Slide size={200}>3</Carousel.Slide>
      {/* ...other slides */}
    </Carousel>
	</>
}