import { question } from "./question";
import { userInformation } from "./user-information";
import { femaleQuestions, maleQuestions } from './questions-bank';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from "aurelia-dependency-injection";

@inject(EventAggregator)
export class survey {

    constructor(private event: EventAggregator, private questions: question[], private userInfo = new userInformation(), private CommunityAnsweersSynced = false, private numberOfuniqueAnswers = -1) {
        this.subscribe();
        this.questions = [];
    }
    generateQuestions() {
        if (this.userInfo.getGender() === "ذكر") {
            maleQuestions.forEach(que => this.questions.push(new question(que)))
        } else if (this.userInfo.getGender() === "أنثى") {
            femaleQuestions.forEach(que => this.questions.push(new question(que)))
        }
    }
    getUserInformation(): userInformation {
        return this.userInfo;
    }
    getNumberOfuniqueAnswers() {
        return this.numberOfuniqueAnswers;
    }
    setUserInformation(userInfo: userInformation) {
        this.userInfo = userInfo;
    }
    getQuestions(): question[] {
        return this.questions;
    }
    setQuestions(questions: question[]) {
        this.questions = questions;
    }
    fetchThenUpdateCommunityAnswers() {
        this.publish("onFetchThenUpdateCommunityAnswersRequest", this);

    }
    fetchCommunityAnswers() {
        this.publish("onFetchCommunityAnswersRequest", this);
    }

    updateCommunityAnswers() {
        this.publish("onUpdateCommunityAnswersRequest", this);

    }
    calculateNumberOfuniqueAnswers() {
        this.numberOfuniqueAnswers = this.questions.filter(question => question.getDoesUserHasUniqueAnswer()).length;
    }
    fetchUserId() {
        this.publish('onFetchUserIdRequest', this);
    }
    private setUserId(id) {
        this.userInfo.setId(id);
    }
    private addUserAnswersToCommunityAnswers() {
        this.questions.forEach(question => question.getUserAnswer() === 'نعم' ?
            question.incrementCommunityYesAnswers()
            : question.incrementCommunityNoAnswers());
    }
    private setCommunityAnswers(communityAnswers: question[]) {

        communityAnswers.forEach((data, index) => {
            this.questions[index].setNumberOfCommunityYesAnswers(data.getNumberOfCommunityYesAnswers());
            this.questions[index].setNumberOfCommunityNoAnswers(data.getNumberOfCommunityNoAnswers());
        });
        this.CommunityAnsweersSynced = true;
    }
    private setThenupdateCommunityAnswer(communityAnswers: question[]) {
        this.setCommunityAnswers(communityAnswers);
        this.addUserAnswersToCommunityAnswers();
        this.updateCommunityAnswers();
    }
    isAllQuestionsAnsered() {
        return this.questions.find((q: question) => q.getUserAnswer() === '') === undefined ? true : false;
    }
    getCommunityAnsweersFetched() {
        return this.CommunityAnsweersSynced;
    }
    subscribe() {
        this.event.subscribe('onFetchCommunityAnswersResponse', CommunityAnswers => this.setCommunityAnswers(CommunityAnswers));
        this.event.subscribe('onFetchThenUpdateCommunityAnswersResponse', CommunityAnswers => this.setThenupdateCommunityAnswer(CommunityAnswers));
        this.event.subscribe('onFetchUserIdResponse', id => this.setUserId(id));

    }
    publish(event: string, payload: object) {
        switch (event) {
            case "onFetchCommunityAnswersRequest":
                this.event.publish('onFetchCommunityAnswersRequest', payload);
                break;
            case "onFetchThenUpdateCommunityAnswersRequest":
                this.event.publish('onFetchThenUpdateCommunityAnswersRequest', payload);
                break;
            case "onFetchUserIdRequest":
                this.event.publish('onFetchUserIdRequest', payload);
                break;
            case "onUpdateCommunityAnswersRequest":
                this.event.publish('onUpdateCommunityAnswersRequest', payload);
                break;
            default:
                break;
        }
    }

}