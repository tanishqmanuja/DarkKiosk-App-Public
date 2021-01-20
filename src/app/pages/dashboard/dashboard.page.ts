import { Component,OnInit,OnDestroy } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions} from 'chart.js';
import { Label } from 'ng2-charts';
import { WebkioskService } from '@dk/services/webkiosk.service';
import { AtatService } from '@dk/services/atat.service';
import { UtilService } from '@dk/services/util.service';
import { StorageService } from '@dk/services/storage.service';
import { Attendance,Marks, Subjects } from '@dk/interfaces/webkioskAPI.interface'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit,OnDestroy {
  radarChartOptions: RadialChartOptions = {
    responsive: true,
    // animation: {
    //   duration: 0
    // },
    // hover: {
    //   animationDuration: 0
    // },
    responsiveAnimationDuration: 0,
    legend: {
      display: false
    },
    scale: {
      angleLines: {
        display: false,
      },
      ticks: {
        showLabelBackdrop: false,
        suggestedMin: 20,
        suggestedMax: 100,
        stepSize: 25,
      },
      gridLines: {
        circular: true,
        color: 'rgba(255,255,255,25%)',
      }
    },
  };
  radarChartLabels: Label[] = [];

  radarChartData: ChartDataSets[] = [{
      data: [],
      label: 'Attendance',
      backgroundColor: '#38C79B60',
      pointBackgroundColor: '#38C79B',
      pointBorderColor: '#38C79B',
      borderColor: '#38C79B',
      order: 1
    },
    {
      data: [],
      label: 'Marks',
      backgroundColor: '#FA8E2360',
      pointBackgroundColor: '#FA8E23',
      pointBorderColor: '#FA8E23',
      borderColor: '#FA8E23',
    },
  ];
  radarChartType: ChartType = 'radar';

  subjects:Subjects
  attendance:Attendance;
  marks:Marks;
  findClasses$;
  classes = [];
  alias = '';
  titleShort = this.utils.titleShortener

  constructor(
    private webkiosk: WebkioskService,
    private atat: AtatService,
    private utils:UtilService,
    private storage: StorageService
    ) {}

  async ngOnInit() {
    this.alias = await this.getAlias();
    this.findClasses$ = this.atat.getCurrentClasses().subscribe((classes)=>{this.classes = classes});
    this.subjects = await this.webkiosk.getSubjects()
    this.webkiosk.getAttendance$().subscribe(a=>{
      this.attendance = a
      this.setGraph()
    })
    this.webkiosk.getMarks$().subscribe(m=>{
      this.marks = m
      this.setGraph()
    })
  }

  ngOnDestroy(){
    this.findClasses$.unsubscribe()
  }

  async getAlias(){
    let data = await this.storage.get('userinfo')
    return data.alias
  }

  formatTime(str){
    let time = parseInt(str)
    if(time<12) return [time,'am'];
    else return [time-12,'pm']
  }

  async setGraph() {
    if(!this.subjects) return;

    this.radarChartLabels = []
    this.radarChartData[0].data = []
    this.radarChartData[1].data = []

    let cm:Array<any> = [];
    if(this.marks){
      let matches = this.marks.data.filter(val=>val.semCode==this.subjects.data[0].semCode)
      if(matches && matches[0]){
        cm = matches[0].marksheet;
      }
    }
    

    for (let i = 0; i < this.subjects.data[0].subjectList.length; i++) {
      this.radarChartLabels.push(this.titleShort(this.subjects.data[0].subjectList[i].name,15));

      let foundM: any = cm.filter(rec => rec.course.code == this.subjects.data[0].subjectList[i].code);
      if (foundM[0] && foundM[0].marks) {
        let m = foundM[0].marks;
        let perc = 0;
        if (m.labmid && m.labend) {
          perc = ((100 / 20) * (m.labmid) + (100 / 20) * (m.labend)) / 2
        } else if (m.labmid) {
          perc = (100 / 20) * (m.labmid)
        } else if (m.t1 && m.t2 && m.t3) {
          perc = ((100 / 20) * (m.t1) + (100 / 20) * (m.t2) + (100 / 35) * (m.t3)) / 3
        } else if (m.t1 && m.t2) {
          perc = ((100 / 20) * (m.t1) + (100 / 20) * (m.t2)) / 2
        } else if (m.t1) {
          perc = (100 / 20) * (m.t1)
        } else if(m.midva){
          perc = (100 / 30) * (m.midva)
        }
        this.radarChartData[1].data.push(perc);
      } else {
        this.radarChartData[1].data.push(0);
      }

      if(!this.attendance.data.length) return
      let foundA: any = this.attendance.data.filter(rec => rec.course.code == this.subjects.data[0].subjectList[i].code);
      if(foundA[0] && (foundA[0].attendance.total || foundA[0].attendance.prac)){
        this.radarChartData[0].data.push(parseInt(foundA[0].attendance.total || foundA[0].attendance.prac))
      } else {
        this.radarChartData[0].data.push(0)
      }
    }
  }
}