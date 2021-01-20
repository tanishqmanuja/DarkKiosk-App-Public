import { Component, OnInit } from '@angular/core';
import { WebkioskService } from '@dk/services/webkiosk.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UtilService } from '@dk/services/util.service';

@Component({
  selector: 'app-gp-play',
  templateUrl: './gp-play.page.html',
  styleUrls: ['./gp-play.page.scss'],
})
export class GpPlayPage implements OnInit {
  sgpa:number = 10
  grades = ['A+','A','B+','B','C+','C','D','F']
  points = [10,9,8,7,6,5,4,0]
  colors = ['#30a783','#30a783','#FA8E23','#FA8E23','#FA6023','#FA6023','#E44826','#E44826']
  subjects:any
  shorten = this.utils.titleShortener

  constructor(
    private webkiosk: WebkioskService,
    private utils: UtilService
  ) { }

  async ngOnInit() {
    this.subjects = await this.webkiosk.getSubjects()
    this.subjects.data[0].subjectList.map( s =>{
      s.grade = this.grades[0]
      return s
    })
  }

  onDropped(event: CdkDragDrop<string[]>,index:number){
    this.subjects.data[0].subjectList[index].grade = event.item.element.nativeElement.innerText
    this.calculateSGPA();
  }

  getColor(grade){
    return this.colors[this.grades.indexOf(grade)]
  }

  calculateSGPA(){
    let totalCredits = parseFloat(this.subjects.data[0].totalCredits)
    let subjectsArray:Array<any> = this.subjects.data[0].subjectList
    let obtainedCredits = subjectsArray.reduce((acc,val)=>{
      return acc + this.points[this.grades.indexOf(val.grade)] * parseInt(val.credit)
    },0)
    this.sgpa = obtainedCredits/totalCredits;
  }

}
