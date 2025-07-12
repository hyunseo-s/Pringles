export interface Topic {
	topic: number,
	topicName: string,
	classId: number,
	studentData?: {
		easyCorrect: number
		easyQsTotal: number
		hardCorrect: number
		hardQsTotal: number
		level: number
		medCorrect: number
		medQsTotal: number
	}
	teacherData: {
		questionData?: {
			answerid: number
			questionid: number
			sessionid: number
			studentid: number 
			answer: string 
			question: string
			correct: boolean
			level: number
		}[]
	}

}