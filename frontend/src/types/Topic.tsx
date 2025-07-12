export interface Topic {
	topic: number,
	topicName: string,
	data: {
		easyCorrect: number
		easyQsTotal: number
		hardCorrect: number
		hardQsTotal: number
		level: number
		medCorrect: number
		medQsTotal: number
	}

}