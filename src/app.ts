
import { EventAggregator } from 'aurelia-event-aggregator';
import { survey } from "./model/survey";
import { db } from "./db/db";
import { inject } from "aurelia-dependency-injection";

@inject(EventAggregator, survey, db)
export class app {
    constructor(private event: EventAggregator, private localSurvey: survey, private db: db, private currentPage: string = 'instructions/instructions', private sender: string) {
        this.setCurrentPage(currentPage, 'app');
        this.subscribe();
    }
    setCurrentPage(receiver: string, sender: string) {
        this.currentPage = receiver;
        this.sender = sender;

    }
    setLocalSurvey(localSurvey: survey) {
        this.localSurvey = localSurvey;
    }
    subscribe() {
        this.event.subscribe('onStateChangeRequest', payload => { this.setLocalSurvey(payload.localSurvey); this.setCurrentPage(payload.receiver, payload.sender) });
    }

}