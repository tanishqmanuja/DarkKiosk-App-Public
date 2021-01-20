import { Component, OnInit } from '@angular/core';
import { AtatService } from 'src/app/services/atat.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-vacant-venue',
  templateUrl: './vacant-venue.page.html',
  styleUrls: ['./vacant-venue.page.scss'],
})
export class VacantVenuePage implements OnInit {
  allVenues = [];
  freeVenues = []
  days = this.utils.days;
  times = this.utils.times;
  selectedDayIndex = ((new Date()).getDay()-1)>0?((new Date()).getDay()-1):0;
  selectedTimeIndex = this.times.indexOf((new Date).getHours()) >= 0 ? this.times.indexOf((new Date).getHours()) : 0

  constructor(
    private atat:AtatService,
    private utils:UtilService
  ) { }

  ngOnInit() {
    this.allVenues = this.atat.getAllVenues();
    this.freeVenues = this.atat.getFreeVenues(this.times[this.selectedTimeIndex],this.days[this.selectedDayIndex])
  }

  changeDay(index){
    this.selectedDayIndex = index;
    this.freeVenues = this.atat.getFreeVenues(this.times[this.selectedTimeIndex],this.days[this.selectedDayIndex])
  }

  changeTime(index){
    this.selectedTimeIndex = index;
    this.freeVenues = this.atat.getFreeVenues(this.times[this.selectedTimeIndex],this.days[this.selectedDayIndex])
  }

  isBooked(venue){
    return !this.freeVenues.includes(venue);
  }

}
