import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';


interface UserInfo {
  alias: string,
  batch: string,
  sem: string,
  semCode: string,
  enroll: string,
  pass: string,
  dob: string,
  base64auth: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private semList = {}

  constructor(
    private storage: StorageService
  ) { 
    this.generateSemList()
  }

  async getSem(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && info.sem
  }
  async setSem(sem:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.sem = sem
    return await this.storage.set('userinfo',info)
  }

  async getSemCode(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && info.semCode
  }
  async setSemCode(semCode:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.semCode = semCode
    return await this.storage.set('userinfo',info)
  }

  getSemFromSemCode(semcode?:string){
    return Object.keys(this.semList).find(key => this.semList[key] === semcode);
  }
  getSemCodeFromSem(sem?:number){
    return this.semList[sem.toString()]
  }

  async getAlias(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && info.alias
  }
  async setAlias(alias:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.alias = alias
    return await this.storage.set('userinfo',info)
  }

  async getBatch(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && info.batch
  }
  async setBatch(batch:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.batch = batch
    return await this.storage.set('userinfo',info)
  }

  async getAuth(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && info.base64auth
  }
  async setAuth(base64auth:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.base64auth = base64auth
    return await this.storage.set('userinfo',info)
  }

  async getCredentials(){
    let info:UserInfo = await this.storage.get('userinfo')
    return info && {
      enroll: info.enroll,
      pass: info.pass,
      dob: info.dob
    }
  }
  async setCredentials(enroll:string, pass:string, dob:string){
    let info:UserInfo = await this.storage.get('userinfo')
    info.enroll = enroll
    info.pass = pass
    info.dob = dob
    return await this.storage.set('userinfo',info)
  }

  async generateSemList(){
    let sem = await this.getSem()
    let semCode = await this.getSemCode()

    if(!( 0 < parseInt(sem) && parseInt(sem)<=10)) return
    if(!semCode) return;

    for(let s=0; s <= 10; s++){
      let yearAdjustment = Math.ceil((parseInt(sem) - (parseInt(sem)%2==0?s:s+1))/2)
      this.semList[s.toString()] =  (parseInt(semCode.slice(0,4)) - yearAdjustment).toString() + (s%2==0?'EVE':'ODD') + 'SEM'
    }
  }

  getSemList(){
    return this.semList;
  }

}
