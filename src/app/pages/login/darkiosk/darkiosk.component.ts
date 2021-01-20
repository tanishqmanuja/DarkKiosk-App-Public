import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from '@dk/services/storage.service'

@Component({
  selector: 'darkiosk-page',
  templateUrl: './darkiosk.component.html',
  styleUrls: ['./darkiosk.component.scss'],
})
export class DarkioskComponent implements OnInit {
  @Output()
  blastOff: EventEmitter<boolean> = new EventEmitter();

  alias='';
  batch='';

  constructor(
    private storage: StorageService
  ) { }

  ngOnInit() {}

  async saveInfo(){
    if(this.alias && this.batch){
      let info = await this.storage.get('userinfo')
      if(info){
        info.alias = this.alias
        info.batch = this.batch
      } else {
        info = {
          alias: this.alias,
          batch: this.batch,
        }
      }
      await this.storage.set('userinfo',info)
      this.blastOff.emit(true)
    }
  }

}
