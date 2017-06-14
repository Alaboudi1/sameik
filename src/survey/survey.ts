import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import './survey.css'
import { survey } from "../model/survey";

@inject(EventAggregator)
export class form {
    constructor(private event: EventAggregator, private localSurvey: survey, private done = false)  {

    }
    activate(data: any) {
        this.localSurvey = data.localSurvey;
        this.localSurvey.fetchUserId();
        window.scrollTo(0, 0);

    }
    choose(answer, index) {
        this.localSurvey.getQuestions()[index].setUserAnswer(answer);
        this.done = this.localSurvey.isAllQuestionsAnsered();
    }
    send() {
        this.event.publish('onStateChangeRequest', { receiver: 'result/result', sender: 'survey', localSurvey: this.localSurvey })
    }
   

}