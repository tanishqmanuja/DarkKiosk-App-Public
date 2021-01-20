import { Component, OnInit } from '@angular/core';
import { WebkioskService } from '@dk/services/webkiosk.service';

@Component({
  selector: 'app-fee-details',
  templateUrl: './fee-details.page.html',
  styleUrls: ['./fee-details.page.scss'],
})
export class FeeDetailsPage implements OnInit {
  totalPaid = 0;
  totalDue = 0;
  feeDetails = [];

  constructor(
    private webkiosk:WebkioskService
  ) { }

  async ngOnInit() {
    this.feeDetails = (await this.webkiosk.getFees()).data.reverse();
    this.totalPaid = this.feeDetails.reduce((acc,entry) => acc+parseInt(entry.paid),0)
    this.totalDue = this.feeDetails.reduce((acc,entry) => acc+parseInt(entry.due),0)
  }

  formatMoney(amt){
    amt = parseInt(amt)
    if(amt<0) return 0;
    else if(amt>99999) return (amt/100000) + 'L';
    else if(amt > 999) return (amt/1000) + 'K';
    else return amt;
  }

  isDue(amt){
    amt= parseInt(amt)
    return amt>0;
  }

  async doRefresh(event){
    await this.webkiosk.updateFees()
    await this.ngOnInit()
    event.target.complete()
  }
}
