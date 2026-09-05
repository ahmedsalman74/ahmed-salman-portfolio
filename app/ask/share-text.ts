export function questionAnswerText(question: string, answer: string) {
  return `Question:\n${question}\n\nAnswer:\n${answer}`;
}

export function tweetQuestionAnswer(question: string, answer: string) {
  return `Question: ${shorten(question, 108)}\n\nAnswer: ${shorten(answer, 108)}`;
}

function shorten(text: string, limit: number) {
  const characters = Array.from(text.trim());
  return characters.length > limit ? `${characters.slice(0, limit - 3).join("")}...` : characters.join("");
}
