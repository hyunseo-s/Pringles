import University from "./University"

export const RightSection = () => {

		const ProjectTitle = () => {
			return (
				<div className='flex justify-around'>
					<div className='flex gap-4'>
						<p className='text-5xl my-auto'> Welcome to </p>
						<p className='text-8xl my-auto' style={{fontFamily: 'NeueBit'}}> Pringles </p>
					</div>
				</div>
			)
		}
	return (
		<div className='w-3/5 h-[32rem] flex flex-col justify-between'>
			<ProjectTitle />
			<University className='h-4/5'/>
		</div>
	)
}