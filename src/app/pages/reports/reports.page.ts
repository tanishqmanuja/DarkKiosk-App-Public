import { Component, OnInit } from '@angular/core';
import { WebkioskService } from '../../services/webkiosk.service';
import { UtilService } from '../../services/util.service';
import { Marks, Points, Grades } from '@dk/interfaces/webkioskAPI.interface';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  marks:Marks;
  grades:Grades;
  points:Points;
  mgp:Array<any>;
  selectedSem = 1;
  arrayFn = Array;
  titleShort = this.utils.titleShortener

  constructor(private webkiosk:WebkioskService,private utils:UtilService) { }

  async ngOnInit() {
    this.points = await this.webkiosk.getPoints()
    this.grades = await this.webkiosk.getGrades()
    this.webkiosk.getMarks$().subscribe(m=>{
      this.marks = m;
      this.generateMGP()
    })
    this.selectedSem = this.mgp && this.mgp.length
    if(this.marks.data[this.selectedSem-1] && !this.marks.data[this.selectedSem-1].marksheet.length) this.changeSem('prev')
  }

  get selectedSemData(){
    if(!this.mgp) return;
    let match = this.mgp.filter(mgp=>mgp.sem==this.selectedSem)
    if(match && match[0]) return match[0];
    return;
  }

  generateMGP(){
    if(!(this.marks && this.points && this.grades)) return;
    let mgp:any = JSON.parse(JSON.stringify(this.marks.data))
    mgp = mgp.map((m:any)=>{
      let gradesheet;
      let gradeMatch = this.grades.data.filter(g=>g.sem==m.sem)
      if(gradeMatch && gradeMatch[0]){
        gradesheet = gradeMatch[0].gradesheet;
      }
      let pointMatch = this.points.data.filter(p=>p.sem==m.sem)
      if(pointMatch && pointMatch[0]){
        m.points = pointMatch[0]
      }
      let reportsheet = m.marksheet;
      if(gradesheet){
        m.marksheet.forEach((mi,index) => {
          gradesheet.forEach(gi => {
            if(mi.course.code == gi.course.code){
              reportsheet[index].grade = gi.grade 
            }
          });
        });
      }
      m.reportsheet = reportsheet
      delete m.marksheet
      return m
    })
    this.mgp = mgp
    return;
  }

  changeSem(type){
    if(type == 'next'){
      this.selectedSem = this.selectedSem!=this.mgp.length ? this.selectedSem + 1 : this.selectedSem ;
    } else if(type == 'prev'){
      this.selectedSem = this.selectedSem!=1 ? this.selectedSem - 1 : this.selectedSem;
    }
  }

  gradeColor(grade){
    if(grade=='A+'||grade=='A'){
      return 'var(--ion-green)'
    } else if(grade=='B+'||grade=='B'){
      return 'var(--ion-yellow)'
    } else {
      return 'var(--ion-red)'
    }
  }

  async doRefresh(event) {
    let updateAll = async () => {
      await this.webkiosk.updateMarks()
      await this.webkiosk.updatePoints()
      await this.webkiosk.updateGrades()
      this.points = await this.webkiosk.getPoints()
      this.grades = await this.webkiosk.getGrades()
    }

    if(!this.mgp){
      await updateAll()
      this.generateMGP()
      event.target.complete()
      return;
    };
    
    //await this.webkiosk.updateMarks()
    await this.webkiosk.updateMarks(this.marks.data[this.selectedSem-1].semCode)
    
    this.generateMGP()
    event.target.complete()
  }
}
