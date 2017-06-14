import { EventAggregator } from 'aurelia-event-aggregator';
import { question } from "../model/question";
import { userInformation } from "../model/user-information";
import { survey } from "../model/survey";
import { config } from "./dbConfig";
import { inject } from "aurelia-dependency-injection";

@inject(EventAggregator)
export class db {


    constructor(private event: EventAggregator, private firebase: any) {
        this.subscribe();
    }
    async connect() {
        try {
            this.firebase = await System.import('firebase');
            this.firebase.initializeApp(config);
            this.firebase.auth().signInAnonymously();
        } catch (e) {
        }
    }
    async getUserId(userInformation: userInformation) {
        try {
            if (!this.firebase) {
                await this.connect();
            }
            this.firebase.database().goOnline();

            const snapshot1 = await this.firebase.database().ref(`${userInformation.getGender()}/${userInformation.getName()}`).once('value');
            let id;
            if (snapshot1.val()) {
                id = snapshot1.val().id;
            } else {
                id = this.firebase.database().ref().child(`${userInformation.getGender()}`).push().key;
                const newName = {};
                newName[userInformation.getName()] = { id };
                await this.firebase.database().ref(`/${userInformation.getGender()}`).update(newName);
            }
            this.firebase.database().goOffline();
            return id;
        } catch (e) {
            console.log(e);
        }
    }
    async getCommunityAnswers(userinfo: userInformation) {
        try {
            if (!this.firebase) {
                await this.connect();
            }
            let id = userinfo.getId();
            if (id === undefined) {
                id = await this.getUserId(userinfo);
                userinfo.setId(id);
            }
            const response: question[] = [];
            this.firebase.database().goOnline();

            const snapshot2 = await this.firebase.database().ref(`communityAnswers/${userinfo.getId()}`).once('value');
            if (snapshot2.val()) {
                const communityAnswers = Object.keys(snapshot2.val()).map(key => snapshot2.val()[key]);
                console.log(communityAnswers);
                communityAnswers.forEach(answer => {
                    response.push(new question('', '', answer.yes, answer.no));
                });
            }
            this.firebase.database().goOffline();

            return response;
        } catch (e) {
            console.log(e);
        }
    }
    async updateCommunityAnswers(localSurvey: survey) {
        try {
            if (!this.firebase) {
                await this.connect();
            }
            this.firebase.database().goOnline();

            const answers = {};
            localSurvey.getQuestions().forEach((question, index) => {
                answers[`${index + 1}`] = {
                    'yes': question.getNumberOfCommunityYesAnswers(),
                    'no': question.getNumberOfCommunityNoAnswers()
                }
            });
            await this.firebase.database().ref(`communityAnswers/${localSurvey.getUserInformation().getId()}`).update(answers);
            setTimeout(_ => this.firebase.database().goOffline(), 1500);

        } catch (e) {
            console.log(e);
        }
    }
    subscribe() {
        this.event.subscribe('onFetchCommunityAnswersRequest', async (localSurvey: survey) => {
            const response = await this.getCommunityAnswers(localSurvey.getUserInformation());
            this.publish('onFetchCommunityAnswersResponse', response);
        });
        this.event.subscribe('onFetchThenUpdateCommunityAnswersRequest', async (localSurvey: survey) => {
            const response = await this.getCommunityAnswers(localSurvey.getUserInformation());
            this.publish('onFetchThenUpdateCommunityAnswersResponse', response);

        });
        this.event.subscribe('onFetchUserIdRequest', async (loocalSurvey: survey) => {
            const response = await this.getUserId(loocalSurvey.getUserInformation());
            this.publish('onFetchUserIdResponse', response);
        });
        this.event.subscribe('onUpdateCommunityAnswersRequest', (loocalSurvey: survey) => {
            this.updateCommunityAnswers(loocalSurvey);
        });
    }
    publish(event: string, payload: object) {
        switch (event) {
            case "onFetchCommunityAnswersResponse":
                this.event.publish('onFetchCommunityAnswersResponse', payload);
                break;
            case "onFetchThenUpdateCommunityAnswersResponse":
                this.event.publish('onFetchThenUpdateCommunityAnswersResponse', payload);
                break;
            case "onFetchUserIdResponse":
                this.event.publish('onFetchUserIdResponse', payload);
                break;
        }
    }
}
interface System {
    import<T>(module: string): Promise<T>
}

declare var System: System