import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { WebkioskService } from '@dk/services/webkiosk.service';
import { StorageService } from '@dk/services/storage.service'

@Component({
  selector: 'webkiosk-page',
  templateUrl: './webkiosk.component.html',
  styleUrls: ['./webkiosk.component.scss'],
})
export class WebkioskComponent implements OnInit {
  @Output()
  loggedIn: EventEmitter<boolean> = new EventEmitter()

  loginStatus:string = 'none'
  disabled = false
  hide = true

  loginForm = this.formBuilder.group({
    enroll: new FormControl('',[Validators.required]),
    pass: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required,Validators.pattern(/\d{1,2}\/\d{2}\/\d{4}/)])
  })

  constructor(
    private formBuilder: FormBuilder,
    private webkiosk: WebkioskService,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  get fEnroll() {
		return this.loginForm.get('enroll');
  }
  get fPass() {
		return this.loginForm.get('pass');
  }
  get fDob() {
		return this.loginForm.get('dob');
  }

  async login(){
    if(!this.loginForm.valid) return;
    this.disabled = true;
    this.loginForm.disable()
    let loginStatus = await this.webkiosk.login(this.loginForm.value.enroll,this.loginForm.value.pass,this.loginForm.value.dob)
    if(loginStatus){
      this.loginStatus = 'success'
      let info = await this.storage.get('userinfo')
      let buff = new Buffer(`{"enroll":"${this.loginForm.value.enroll}","pass":"${this.loginForm.value.pass}","dob":"${this.loginForm.value.dob}"}`)
      let base64auth = 'Basic ' + buff.toString('base64')
      if(info){
        info.enroll = this.loginForm.value.enroll
        info.pass = this.loginForm.value.pass
        info.dob = this.loginForm.value.dob
        info.base64auth = base64auth
      } else {
        info = {
          enroll: this.loginForm.value.enroll,
          pass: this.loginForm.value.pass,
          dob: this.loginForm.value.dob,
          base64auth
        }
        await this.storage.set('userinfo',info)
        this.webkiosk.Init()
        this.loggedIn.emit(true)
      }
    } else {
      this.loginStatus = 'failed'
    }
    this.loginForm.enable()
    this.disabled = false;
  }
}
