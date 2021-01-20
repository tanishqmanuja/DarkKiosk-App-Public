import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardPage } from '../dashboard/dashboard.page';
import { AttendancePage } from '../attendance/attendance.page'
import { ReportsPage } from '../reports/reports.page'
import { FeaturesPage } from '../features/features.page'
import { SchedulePage } from '../schedule/schedule.page'
import { Platform, ModalController, NavController, PickerController } from '@ionic/angular';
import { SuperTabs } from '@ionic-super-tabs/angular';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild(SuperTabs, { static: false }) superTabs: SuperTabs;
  
  backButtonSubscription:any;
  tabsSubscription:any;
  dashboardPage = DashboardPage;
  attendancePage = AttendancePage;
  reportsPage = ReportsPage;
  schedulePage = SchedulePage;
  featuresPage = FeaturesPage;
  title = 'DarkKiosk'
  titles = ['Attendance','Reports','DarkKiosk','Schedule','Features']
  displays:Array<boolean> = [false,false,true,false,false]

  config:any = {
    allowElementScroll: false,
    transitionDuration: 0
  }

  constructor(
    private platform: Platform,
    private modalCtrl:ModalController,
    private navCtrl: NavController,
    private pickerCtrl:PickerController,
    ) {}

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.superTabs.setConfig({
      nativeSmoothScroll: true,
      allowElementScroll: false,
      transitionDuration: 150
    })

    this.tabsSubscription = this.superTabs.tabChange.subscribe((ev)=>{
      let tabIndex = ev.detail.index; 
      if(0 <= tabIndex && 4 >= tabIndex){
        this.title = this.titles[ev.detail.index]
        if(tabIndex==0){
          this.displays = [true,true,false,false,false]
        } else if(tabIndex==4){
          this.displays = [false,false,false,true,true]
        } else {
          this.displays.fill(false)
          this.displays[tabIndex] = true
          this.displays[tabIndex-1] = true
          this.displays[tabIndex+1] = true
        }
      }
    })
    if(this.backButtonSubscription) return;
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      let urls = this.platform.url().split('/')
      let endUrl = urls[urls.length-1]
      if(await this.pickerCtrl.getTop()){
        this.pickerCtrl.dismiss()
      } else if(await this.modalCtrl.getTop()){
        this.modalCtrl.dismiss()
      } else if(endUrl!='home'){
        this.navCtrl.pop();
      } else if(this.title == 'DarkKiosk'){
        this.backButtonSubscription.unsubscribe();
        App.exitApp();
      } else {
        this.superTabs.selectTab(2,false);
      }
    });
  }

  // ionViewDidLeave(){
  //   this.tabsSubscription.unsubscribe();
  // }
}