interface DialogRequest {
  user_feedback: string,
  index: number,
  app: string,
}

interface Suggestion {
  index: number,
  category: string,
  problem_sentence: string,
  incorrect: string,
  fixed: string,
  reason: string,
}