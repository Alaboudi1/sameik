export class question {
    constructor(private questionText: string = '', private userAnswer: string = '', private numberOfCommunityYesAnswers = 0, private numberOfCommunityNoAnswers = 0, private DoesUserHasUniqueAnswer = false) {

    }
    setUserAnswer(userAnswer: string) {
        this.userAnswer = userAnswer;
    }
    getUserAnswer(): string {
        return this.userAnswer;
    }
    setQuestionText(questionText: string) {
        this.questionText = questionText;
    }
    getQuestionText(): string {
        return this.questionText;
    }
    incrementCommunityYesAnswers() {
        this.numberOfCommunityYesAnswers++;
    }
    incrementCommunityNoAnswers() {
        this.numberOfCommunityNoAnswers++;
    }
    getNumberOfCommunityYesAnswers() {
        return this.numberOfCommunityYesAnswers;
    }
    getNumberOfCommunityNoAnswers() {
        return this.numberOfCommunityNoAnswers;
    }
    setNumberOfCommunityYesAnswers(numberOfCommunityYesAnswers) {
        this.numberOfCommunityYesAnswers = numberOfCommunityYesAnswers;
    }
    setNumberOfCommunityNoAnswers(numberOfCommunityNoAnswers) {
        this.numberOfCommunityNoAnswers = numberOfCommunityNoAnswers;
    }
    setDoesUserHasUniqueAnswer(DoesUserHasUniqueAnswer: boolean) {
        this.DoesUserHasUniqueAnswer = DoesUserHasUniqueAnswer;
    }
    getDoesUserHasUniqueAnswer() {
        return this.DoesUserHasUniqueAnswer;
    }

} 