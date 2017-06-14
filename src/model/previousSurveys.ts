import { local } from "../db/local";
import { inject } from "aurelia-dependency-injection";
import { userInformation } from "./user-information";
import { question } from "./question";

@inject(local)
export class previousSurveys {

    constructor(private local: local) {
    }

    getPrevioudSurvey(): any[] {
        const previousSurveys = this.local.read().map(survey => {
            return {
                questions: survey.questions.map(q => new question(q.questionText, q.userAnswer, q.numberOfCommunityYesAnswers, q.numberOfCommunityNoAnswers)),
                userInfo: new userInformation(survey.userInfo.name, survey.userInfo.gender, survey.userInfo.id)
            }
        });
        return previousSurveys;
    }
}