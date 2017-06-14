import { EventAggregator } from 'aurelia-event-aggregator';
import { survey } from "../model/survey";
import { inject } from "aurelia-dependency-injection";

@inject(EventAggregator)
export class local {
    constructor(private event: EventAggregator) {
    this.subscribe();
    }
   private save(localSurvey: survey) {
        const surveys: any[] = JSON.parse(localStorage.getItem("surveys")) || [];
        const tempSurvey = {
                 userInfo:localSurvey.getUserInformation(),
                 questions: localSurvey.getQuestions(),
        }
        surveys.push(tempSurvey);
        localStorage.setItem("surveys", JSON.stringify(surveys));
    }
    read(): any[] {
        const surveys: any[] = JSON.parse(localStorage.getItem("surveys")) || [];
        return surveys;
    }
    subscribe() {
        this.event.subscribe('onFetchThenUpdateCommunityAnswersRequest', (localSurvey: survey) => {
            this.save(localSurvey);
        });
    }

}
