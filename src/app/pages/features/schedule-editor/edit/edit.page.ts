import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { WebkioskService } from 'src/app/services/webkiosk.service';
import { AtatService } from 'src/app/services/atat.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  data = null;
  subjects;
  days;
  times;
  venues;
  types = ["lecture","tutorial","practical"]
  durations = [1,2,3]
  title = ""

  editForm = this.formBuilder.group({
  })

  constructor(
    private navParams:NavParams,
    private modalCtrl:ModalController,
    private formBuilder: FormBuilder,
    private utils: UtilService,
    private webkiosk: WebkioskService,
    private atat: AtatService
  ) {}

  async ngOnInit() {
    this.data = this.navParams.get('data');
    if(this.data){
      this.title = this.utils.titleShortener(this.data.subject.name,30)
      this.editForm.addControl('day',new FormControl(this.data.day,[Validators.required]))
      this.editForm.addControl('time',new FormControl(this.data.time,[Validators.required]))
      this.editForm.addControl('venue',new FormControl(this.data.venue,[Validators.required]))
    } else {
      this.editForm.addControl('subject',new FormControl('',[Validators.required]))
      this.editForm.addControl('type',new FormControl('',[Validators.required]))
      this.editForm.addControl('day',new FormControl('',[Validators.required]))
      this.editForm.addControl('time',new FormControl('',[Validators.required]))
      this.editForm.addControl('venue',new FormControl('',[Validators.required]))
      this.editForm.addControl('teachers',new FormControl('',[Validators.required]))
      this.editForm.addControl('duration',new FormControl('1',[Validators.required]))
    }


    this.subjects = (await this.webkiosk.getSubjects()).data[0].subjectList
    this.days = this.utils.days
    this.times = this.utils.times
    this.venues = this.atat.getAllVenues()
  }

  titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

  formatTime(str){
    let time = parseInt(str)
    if(time<12) return time+' am';
    else if(time==12) return time+' pm';
    else return time-12+' pm';
  }

  closeModal(deleteOption?:boolean){
    if(deleteOption){
      this.modalCtrl.dismiss({})
      return;
    }

    let newData = null;
    if(this.editForm.valid){
      if(this.data){
        newData = this.data;
        newData.day = this.editForm.value.day;
        newData.time = this.editForm.value.time;
        newData.venue = this.editForm.value.venue;
      } else {
        newData = {}
        newData.day = this.editForm.value.day;
        newData.time = this.editForm.value.time;
        newData.venue = this.editForm.value.venue.toUpperCase();
        newData.subject = {
          name: this.titleCase(this.editForm.value.subject.name),
          coursecode: this.editForm.value.subject.code
        }
        newData.type = this.editForm.value.type;
        newData.duration = newData.duration
        newData.teachers = this.editForm.value.teachers.toUpperCase().split(',');
      }
    }
    this.modalCtrl.dismiss(newData)
  }

}
