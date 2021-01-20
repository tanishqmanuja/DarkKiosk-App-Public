import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AtatService } from 'src/app/services/atat.service';

import { Plugins,Capacitor } from "@capacitor/core";
let Keyboard:any;
  if (Capacitor.platform !== "web") {
    Keyboard = Plugins.Keyboard
}

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.page.html',
  styleUrls: ['./heatmap.page.scss'],
})
export class HeatmapPage implements OnInit {
  @ViewChild('batchIn',{read:ElementRef,static:false}) batchInput:ElementRef
  @ViewChild('semIn',{read:ElementRef,static:false}) semInput:ElementRef

  data = [];
  heatmap = new Array(6).fill([{val:false,length:8}]);

  selected = [];
  keyboardUp = false;

  constructor(
    private ngZone:NgZone,
    private utils:UtilService,
    private atat:AtatService,
    ) { }

  ngOnInit() {
    try {
      // Listen to `keyboardWillShow` event
      Keyboard.addListener('keyboardWillShow', () => {
          this.ngZone.run(() => {
              this.keyboardUp = true;
          });

      });
      // Listen to `keyboardWillHide` event
      Keyboard.addListener('keyboardWillHide', () => {
          this.ngZone.run(() => {
              this.keyboardUp = false;
          });

      });
    } catch (error) {
    } finally {return}

  }

  mapData(data){
    if(!(data.length>0)) return;
    let boolData = new Array(48).fill(false);
    data.forEach(el => {
      let dayIndex = this.utils.days.indexOf(el.day);
      let timeIndex = parseInt(el.time)-9;
      let elIndex = dayIndex*8 + timeIndex;
      let duration = 0;
      while(duration<el.duration){
        boolData[elIndex + duration] = true;
        duration++;
      }
    });
    let tempData = new Array(6)
    for(let i=0;i<6;i++){
      tempData[i] = boolData.slice(8*i,8*i+8);
    }
    let finalData = [[],[],[],[],[],[]]
    for(let i=0;i<6;i++){
      let val = tempData[i][0]
      let length = 1;
      for(let j=1;j<8;j++){
        if(val !== tempData[i][j] || j===7){
          if(j===7) length++;
          let entry = {val:val,length:length};
          finalData[i].push(entry);
          val = !val;
          length = 1;
        } else {
          length++;
        }
      }
    }
    //console.log(tempData)
    //console.log(finalData)
    this.heatmap = finalData;
  }

  generateHeatMap(){
    let data = [];
    this.selected.forEach(selection=>{
      data = data.concat(this.atat.heatMap(selection.batch,selection.sem))
    })
    this.mapData(data)
  }

  addSelection(batch,sem){
    if(sem!='' && batch!=''){
      this.selected.push({batch:batch.toUpperCase(),sem:sem});
      this.batchInput.nativeElement.value = '';
      this.semInput.nativeElement.value = '';
      this.generateHeatMap();
    }
  }

  resetSelection(){
    this.selected = [];
    this.batchInput.nativeElement.value = '';
    this.semInput.nativeElement.value = '';
    this.heatmap = new Array(6).fill([{val:false,length:8}]);
  }

}
