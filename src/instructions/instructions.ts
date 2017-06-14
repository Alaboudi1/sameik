import { EventAggregator } from 'aurelia-event-aggregator';
import './instructions.css'
import { survey } from '../model/survey';
import { previousSurveys } from "../model/previousSurveys";
import { inject } from "aurelia-dependency-injection";

@inject(EventAggregator, previousSurveys)
export class instructions {
    message: string;
    foundInPreviousSurveys: boolean;
    constructor(private event: EventAggregator, private localStorage: previousSurveys, private previousSurveys: any[], private localSurvey: survey) {
    }
    activate(data: any) {
        this.localSurvey = new survey(this.event,[]);
        this.previousSurveys = this.localStorage.getPrevioudSurvey();
        this.message = 'الرجاء إدخال جميع المعلومات المطلوبة أولا';
        window.scrollTo(0, 0);

    }
    start() {
        this.localSurvey.generateQuestions();
        this.event.publish('onStateChangeRequest', { receiver: 'survey/survey', sender: 'instructions', localSurvey: this.localSurvey })
    }
    setGender(gender) {

        this.localSurvey.getUserInformation().setGender(gender);
    }
    isInPreviousSurveys() {
        this.foundInPreviousSurveys = this.previousSurveys.find(survey => survey.userInfo.name === this.localSurvey.getUserInformation().getName());
        if (this.foundInPreviousSurveys) {
            this.message = 'تم إدخال هذا الأسم من قبل';
        }
        else {
            this.message = 'الرجاء إدخال جميع المعلومات المطلوبة أولا';

        }
    }
    displayResult(index) {
        this.localSurvey.setQuestions(this.previousSurveys[index].questions);
        this.localSurvey.setUserInformation(this.previousSurveys[index].userInfo);
        this.event.publish('onStateChangeRequest', { receiver: 'result/result', sender: 'instructions', localSurvey: this.localSurvey })

    }
}