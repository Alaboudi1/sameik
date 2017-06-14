import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import './charts.css'
import { question } from "../model/question";

@inject(EventAggregator)
export class charts {
    userAnswer: string;
    communityAnswer: string;
    majority: string;
    timeout: any;
    data: any;
    myChart: any;
    chart: any;


    constructor(private event: EventAggregator,private resultChart: any, private questionResult: question) {

    }
    activate(data: any) {
        this.questionResult = data.question;
        this.timeout = data.$index * 1000;
        const yes = this.questionResult.getNumberOfCommunityYesAnswers();
        const no = this.questionResult.getNumberOfCommunityNoAnswers();
        this.userAnswer = this.questionResult.getUserAnswer() === 'لا' ? 'no' : 'yes';
        if (yes === no) {
            this.majority = 'متساوية';
            this.communityAnswer = 'equal';
        } else {
            const majorityAnswer = Math.max(yes, no);
            if (majorityAnswer === yes) {
                this.majority = 'نعم'
                this.communityAnswer = 'yes'
            } else {
                this.majority = 'لا'
                this.communityAnswer = 'no';
            }
        }
        if(this.majority !== 'متساوية' && this.majority !== this.questionResult.getUserAnswer()){
            this.questionResult.setDoesUserHasUniqueAnswer(true);
        }
        console.log(data.$index);
        if(data.$index === 0){
            this.event.publish('onUniqueAnswersCalculationComplete');
        } 

    }
    async bind() {
        this.chart = await System.import("chart.js");
        setTimeout(_ => this.constructChart(), this.timeout);
    }
    constructChart() {
        const borderColor = this.questionResult.getUserAnswer() === 'نعم' ?
            [
                'rgba(75, 192, 192, 1)',
                'rgba(255,99,132,1)'
            ] :
            [
                'rgba(75, 192, 192, 1)',
                'rgba(255,99,132,1)'
            ];
        const myChart = new this.chart(this.resultChart.getContext("2d"), {
            type: 'pie',
            data: {
                labels: ["نعم", "لا"],
                datasets: [{
                    data: [this.questionResult.getNumberOfCommunityYesAnswers(), this.questionResult.getNumberOfCommunityNoAnswers()],
                    backgroundColor: [

                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'

                    ],
                    borderColor,
                    borderWidth: 10
                }]
            },
            responsive: true,
            maintainAspectRatio: false,
            options: this.getOptionsForPie()
        });
        this.resultChart.classList.add("resultChart");

    }

    getOptionsForPie() {
        return {
            events: false,
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: this.drow
            },
            legend: {
                display: false
            }
        };
    }
    drow() {
        const linebreak = window.innerWidth > 700 ? 160 : 50;
        const ctx = this.chart.ctx;
        ctx.font = "10vw sans-serif"
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const dataset = this.data.datasets[0];
        let answers = 0
        for (const data of dataset.data) {
            const model = dataset._meta[Object.keys(dataset._meta)[0]].data[answers]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

            const x = mid_radius * Math.cos(mid_angle);
            const y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = '#fff';

            const percent = String(Math.round(data / total * 100)) + "%";
            ctx.fillText(model.label, model.x + x, model.y + y);
            ctx.fillText(percent, model.x + x, model.y + y + linebreak);
            answers++;
        }

    }
}


interface System {
    import<T>(module: string): Promise<T>
}

declare var System: System