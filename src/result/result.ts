import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import './result.css'
import { question } from "../model/question";
import { survey } from "../model/survey";


@inject(EventAggregator)
export class result {

    constructor(private event: EventAggregator,
        private localSurvey: survey,
        private render = false,
        private numberOfuniqueAnswers = 0,
        private resultMessage: string,
        private shareMessage: string,
        private twitterUrl: string,
        private whatsAppUrl: string) {
    }
    activate(data: any) {
        this.localSurvey = data.localSurvey;
        if (data.sender === 'survey') {
            this.localSurvey.fetchThenUpdateCommunityAnswers();
        } else if (data.sender === 'instructions') {
            this.localSurvey.fetchCommunityAnswers();
        }
        window.scrollTo(0, 0);
        this.event.subscribe('onUniqueAnswersCalculationComplete', _ => this.setMessage());

    }
    setMessage() {
        this.localSurvey.calculateNumberOfuniqueAnswers();
        this.numberOfuniqueAnswers = this.localSurvey.getNumberOfuniqueAnswers();
        const numberOfpoeple = this.localSurvey.getQuestions()[0].getNumberOfCommunityNoAnswers() +
            this.localSurvey.getQuestions()[0].getNumberOfCommunityYesAnswers();
        if (numberOfpoeple < 5) {
            this.resultMessage = ` يبدو أن عددالمشاركين الذين يحملون نفس اسمك '${this.localSurvey.getUserInformation().getName()}'  قليل جداً! قم بمشاركة موقعنا مع أشخاص يحملون نفس الإسم ثم إرجع لنا لتحصل على معلومات أدق ✌.`
            this.shareMessage = '😎جرب موقع سميك واعرف هل أنت مميز مقارنة بالأشخاص الذين يحملون نفس اسمك';
        } else
            if (this.numberOfuniqueAnswers < 6) {
                this.resultMessage = `عدد الإجابات المميزة لديك هو  ${this.numberOfuniqueAnswers} من أصل 10 إجابات. لذا، نحن نعتقد أنك تشابه الكثير من الأشخاص الذين يحملون نفس الاسم. وهذا قد يكون أمراً جيداً😁. `
                this.shareMessage = 'موقع سميك يتوقع أني أشابه الكثير من الأشخاص الذين يحملون نفس اسمي، ماذا عنك؟';
            } else
                if (this.numberOfuniqueAnswers < 10) {
                    this.resultMessage = `عدد الإجابات المميزة لديك هو ${this.numberOfuniqueAnswers}  من أصل 10 إجابات، مما يجعلك شخص مميز جداً مقارنة بالأشخاص الذين يحملون نفس اسمك 😎`;
                    this.shareMessage = 'موقع سميك يتوقع أني شخص مميز بالمقارنة بالأشخاص الذين يحملون نفس اسمي، ماذا عنك؟';

                } else {
                    this.resultMessage = `عدد الإجابات المميزة لديك هو ${this.numberOfuniqueAnswers} من أصل 10 إجابات. هل أنت متأكد أن إسمك ${this.localSurvey.getUserInformation().getName()}? لأنك شخص فوق المتميز بالمقارنة بالأشخاص الذين يحملون نفس اسمك. أنت شخص مختلف تماماً⭐⭐⭐`
                    this.shareMessage = 'موقع سميك يتوقع أني شخص مختلف تماماً عن الأشخاص الذين يحملون نفس اسمي، ماذا عنك؟';
                }
        this.twitterUrl = `https://twitter.com/share?hashtags=سميك&text=${this.shareMessage}&url=https://sameik-c921a.firebaseapp.com/`;
        this.whatsAppUrl = `whatsapp://send?text=${this.shareMessage}. https://sameik-c921a.firebaseapp.com/`;
    }
    newName() {
        this.event.publish('onStateChangeRequest', { receiver: 'instructions/instructions', sender: 'result', localSurvey: this.localSurvey })
    }


}
