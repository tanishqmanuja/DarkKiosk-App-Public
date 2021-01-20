import ttJSON from '../../assets/json/timetables.json'
import { Injectable, OnDestroy } from '@angular/core';
import { PickerController, AlertController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { BehaviorSubject,interval, Subscription } from 'rxjs';
import { WebkioskService } from './webkiosk.service';
import { UtilService } from './util.service';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AtatService implements OnDestroy {
  private databaseMetaInfo = ttJSON.shift()
  private database = ttJSON;
  private generated = false;
  private timetable = []
  private currentClasses = new BehaviorSubject([null,null]);
  private findClasses$:Subscription;

  constructor(
    private webkiosk: WebkioskService,
    private pickerCtrl:PickerController,
    private utils:UtilService,
    private storage: StorageService,
    private http: HttpClient,
    private afs: AngularFireStorage,
    private alertCtrl: AlertController,
    ) {
      this.findClasses$ = interval(1000*60*5).subscribe(()=>{
        this.findClasses();
      })
    }

  ngOnDestroy(){
    this.findClasses$.unsubscribe();
  }

  private studentTimetable(sem,batch,subjects){
    const codeCorrect = (subs,str)=>{
      const ans = subs.filter(sub=>sub.substring(5)==str.substring(5))
      if(ans[0] && ans[0].substring(0,3)==str.substring(0,3)){
        return true;
      } else {
        return false
      }
    }
    batch =  batch.toUpperCase();
    subjects = subjects.map((item:any)=>{
      return item.toUpperCase();
    })
    let tt:any = this.database.filter((item)=>{
      if(parseInt(item.sem) === parseInt(sem) && (item.batches.includes(batch)||item.batches.includes("ABC")||item.batches.includes(batch.charAt(0))) && ( subjects.includes(item.subject.coursecode)||subjects.includes(item.subject.refcode)||codeCorrect(subjects,item.subject.coursecode))){
        return true;
      } else {
        return false;
      }
    });
    return tt;
  }

  teacherTimetable(teacher){
    teacher = teacher.toUpperCase();
    let tt:any = this.database.filter((item)=>{
      if(item.teachers.includes(teacher)){
        return true;
      } else {
        return false;
      }
    });
    return tt;
  }

  private async generateTimetable(force?:boolean){
    if(!force){
      let tt =  await this.storage.get('timetable');
      if(tt){
        this.timetable=tt;
        this.generated = true;
        return;
      }
    }
    let subjects = (await this.webkiosk.getSubjects()).data[0].subjectList.map(s=>s.code)
    let data = await this.storage.get('userinfo')
    if(data && data.batch && data.sem){
      this.timetable = this.studentTimetable(data.sem,data.batch,subjects);
      await this.storage.set('timetable',this.timetable)
      this.generated = true;
    }
  }

  async getTimetable(force?:boolean){
    if(!this.generated || force){
      await this.generateTimetable(force);
    }
    this.findClasses();
    return this.timetable;
  }

  getAllBatches(){
    let batches = []
    this.database.forEach(entry=>{
      entry.batches.forEach(batch=>{
        if(!batches.includes(batch)){
          let res = batch.match(/[A|B|C]\d?\d/)
          if(res){
            batches.push(res[0]);
          }
        }
      })
    })
    batches = batches.filter(function(item, pos) {
      return batches.indexOf(item) == pos;
    })
    return batches.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}));
  }

  getAllVenues(){
    let venues = []
    this.database.forEach(entry=>{
        if(!venues.includes(entry.venue)){
          if(entry.venue){
            venues.push(entry.venue)
          }
        }
    })
    venues = venues.filter(function(item, pos) {
      return venues.indexOf(item) == pos;
    })
    return venues.sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}));
  }

  getFreeVenues(time,day){
    if(!(time&&day)) return;
    let freeVenues = [];
    this.getAllVenues().forEach(v=>{
      this.database.forEach(entry=>{
        if(entry.venue===v && entry.day===day){
          let duration = 0;
          while(duration<parseInt(entry.duration)){
            if((entry.time+duration)===parseInt(time)){
              //console.log(v);
              freeVenues.push(v);
            }
            duration++;
          }
        }
      })
    })
    return this.getAllVenues().filter(v=>{
      return freeVenues.indexOf(v)<0
    });
  }

  async showPicker(){
    let getBatchesOptions = ()=>{
      let options = [];
      this.getAllBatches().forEach(x => {
        options.push({text:x,value:x});
      });
      return options;
    }

    let getSemsOptions = ()=>{
      let options = [];
      ['1','2','3','4','5','6','7','8'].forEach(x => {
        options.push({text:'Sem '+x,value:x});
      });
      return options;
    }

    let options: PickerOptions = {
      mode: 'ios',
      backdropDismiss:false,
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Set',
          handler:(value:any) => {
            let data = {sem:value.Sems.value,batch:value.Batches.value}
            this.storage.get('userinfo').then(info=>{
              if(info){
                info.sem = data.sem
                info.batch = data.batch
                this.storage.set('userinfo',info)
              }
            })
            this.generateTimetable(true);
          }
        }
      ],
      columns:[
        {
          name:'Batches',
          options:getBatchesOptions()
        },
        {
          name:'Sems',
          options:getSemsOptions()
        }
      ]
    };
    let picker = await this.pickerCtrl.create(options);
    picker.present()
    await picker.onDidDismiss();
  }

  private findClasses(){
    if(!this.timetable.length) return;
    
    let classes = [];
    let date = new Date();
    let currentHrs = date.getHours();
    let currentMins = date.getMinutes();

    if(date.getDay() == 0){
      this.currentClasses.next(classes);
      return;
    }

    let currentDay = this.utils.days[date.getDay() - 1];

    let tt = this.timetable.filter((val) => val.day == currentDay).sort((a, b) => a.time - b.time);
    
    for (let i = 0; i < tt.length; i++) {
      if (tt[i].time <= currentHrs) {
        let duration = 0;
        while(duration < tt[i].duration){
          if((tt[i].time + duration) == currentHrs && currentMins<=50){
            classes[0] = tt[i];
          }
          duration++;
        }
      } else {
        if(!classes[1]) classes[1] = tt[i];
      }
    }
    
    this.currentClasses.next(classes);
  }

  getCurrentClasses(){
    return this.currentClasses;
  }

  heatMap(batch,sem){
    batch =  batch.toUpperCase();
    let tt:any = this.database.filter((item)=>{
      if(parseInt(item.sem) === parseInt(sem) && (item.batches.includes(batch)||item.batches.includes("ABC")||item.batches.includes(batch.charAt(0)))){
        return true;
      } else {
        return false;
      }
    });
    return tt;
  }

  getMetaInfo(){
    return this.databaseMetaInfo;
  }

  async getTimetableFromFS(code){
    try {
      let url = await this.afs.storage.ref(`sharedTimetables/${code}.json`).getDownloadURL()
      if(!url){
        this.utils.presentToast('No Timetable Found')
        return
      }
      let data = await this.http.get(url).toPromise()
      return data;
    } catch (error) {
      return false;
    }
  }

  async setTimetable(timetable){
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      cssClass: 'settings-alert',
      header: 'Set Timetable',
      message: 'This will overide the default Timetable.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          handler: () => {
            this.storage.set('timetable',timetable)
            this.utils.presentToast('Timetable Updated')
          }
        }
      ]
    });

    await alert.present();
  }
}

//https://firebasestorage.googleapis.com/b/dark-kiosk.appspot.com/o/sharedTimetables%tanishq18.json