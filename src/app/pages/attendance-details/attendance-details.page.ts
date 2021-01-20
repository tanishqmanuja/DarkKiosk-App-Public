import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.page.html',
  styleUrls: ['./attendance-details.page.scss'],
})
export class AttendanceDetailsPage implements OnInit {
  data:any;
  missingNext:number;
  attendingNext:number;
  titleShort = this.utils.titleShortener

  constructor(
    private navParams:NavParams,
    private modalCtrl:ModalController,
    private utils:UtilService
    ) { }

  ngOnInit() {
    this.data = this.navParams.get('data');
    if(this.data.details){
      this.attendingNext = Math.floor((this.data.details.filter(val=>val.status=="Present").length+1)*100/(this.data.details.length+1))
      this.missingNext = Math.floor((this.data.details.filter(val=>val.status=="Present").length)*100/(this.data.details.length+1))
    }
  }

  closeModal(){
    this.modalCtrl.dismiss()
  }

  nameShort(str){
    let arr = str.split(" ")
    return arr[0] + (arr[1]?(" "+arr[1]):"")
  }

}
