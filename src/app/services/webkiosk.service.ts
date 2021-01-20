import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as IwkAPI from 'src/app/interfaces/webkioskAPI.interface'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebkioskService {
  private apiURL = `${environment.apiURL}/webkiosk/`;

  private base64auth:string = '';

  private attendance = new BehaviorSubject<IwkAPI.Attendance>(null)
  private marks = new BehaviorSubject<IwkAPI.Marks>(null)

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private user: UserService
  ) { 
    //this.apiURL = "http://localhost:3000/webkiosk/"
    //console.log(this.apiURL)
    this.Init()
  }

  async Init(){
    this.base64auth = await this.user.getAuth()
    await this.getAttendance()
    await this.getMarks()
    return;
  }

  async login(enroll,pass,dob){
    if(!(enroll && pass && dob)) return false;
    try{
      let buff = Buffer.from(`{"enroll":"${enroll}","pass":"${pass}","dob":"${dob}"}`)
      let base64auth = 'Basic ' + buff.toString('base64')
      let headers = new HttpHeaders().set('Authorization',base64auth)
      let loginRes:IwkAPI.Login = await this.http.get<IwkAPI.Login>(this.apiURL+'login',{headers}).toPromise()
      if(loginRes.error) return false
      return true      
    } catch(err) {
      return false;
    }
  }

  async logout(){
    try{
      let logoutRes:IwkAPI.Logout = await this.http.get<IwkAPI.Logout>(this.apiURL+'logout').toPromise()
      if(logoutRes.error) return false
      return true      
    } catch(err) {
      return false;
    }
  }

  async updateAttendanceDeatiled(){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let attendance:IwkAPI.Attendance = await this.http.get<IwkAPI.Attendance>(this.apiURL+'attendance/detailed',{headers}).toPromise()
      if(attendance.msg == 'Session Timeout') this.logout();
      if(attendance.error) return false;
      await this.storage.set('attendance',attendance)
      this.attendance.next(attendance)
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateAttendance(){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let attendance:IwkAPI.Attendance = await this.http.get<IwkAPI.Attendance>(this.apiURL+'attendance',{headers}).toPromise()
      if(attendance.msg == 'Session Timeout') this.logout();
      if(attendance.error) return false;
      let attendanceLocal:IwkAPI.Attendance = await this.storage.get('attendance')
      if(attendanceLocal){
        attendance.data.forEach(item=>{
          let matches = attendanceLocal.data.filter(val => item.course.code==val.course.code)
          if(matches && matches[0]){
            item.details = matches[0].details;
          }
        })
        
      }
      await this.storage.set('attendance',attendance)
      this.attendance.next(attendance)
      return true
    } catch (error) {
      return false
    }
  }

  async getAttendance(){
    let data:IwkAPI.Attendance = await this.storage.get('attendance')
    if(!data){
      await this.updateAttendanceDeatiled()
      data = await this.storage.get('attendance')
    }
    this.attendance.next(data)
    return data;
  }

  getAttendance$(){
    return this.attendance.asObservable();
  }

  private async updateMarksForSem(semcode:string){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let marks:IwkAPI.Marks = await this.http.get<IwkAPI.Marks>(this.apiURL+`marks?semcode=${semcode}`,{headers}).toPromise()
      if(marks.msg == 'Session Timeout') this.logout();
      if(marks.error) return false;
      return marks;
    } catch (error) {
      return false;
    }
  }

  async updateMarks(semcode?:string){
    if(!this.base64auth) return;

    let semList = this.user.getSemList()
    let currentSem = await this.user.getSem();
    if(!semList || !currentSem) return;

    let marks:IwkAPI.Marks = await this.storage.get('marks')

    let updateAll = async () => {
      for (let index = 1; index <= parseInt(currentSem); index++) {
        const semcode = semList[index.toString()];
        let response = await this.updateMarksForSem(semcode)
        if(!response || response.error) continue; 
        if(!marks) marks = response;
        marks.data[index] = response.data[0]
        marks.data[index].sem = index.toString()
      }
      if(marks.data.length) marks.data = marks.data.slice(1);
    }

    if(!marks){
      await updateAll()
    } else {
      if(semcode){
        let response = await this.updateMarksForSem(semcode)
        console.log(response)
        if(response && marks){
          marks.data[parseInt(this.user.getSemFromSemCode(semcode)) - 1] = response.data[0]
          marks.data[parseInt(this.user.getSemFromSemCode(semcode)) - 1].sem = this.user.getSemFromSemCode(semcode)
        }
      } else{
        updateAll()
      }
    }
    if(!marks || marks.error) return false;
    this.marks.next(marks)
    await this.storage.set('marks',marks)
    return true
  }


  async getMarks(){
    let data:IwkAPI.Marks = await this.storage.get('marks')
    if(!data){
      await this.updateMarks()
      data = await this.storage.get('marks')
    }
    this.marks.next(data)
    return data;
  }

  getMarks$(){
    return this.marks.asObservable()
  }

  async updatePoints(){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let points:IwkAPI.Points = await this.http.get<IwkAPI.Points>(this.apiURL+'points',{headers}).toPromise()
      if(points.msg == 'Session Timeout') this.logout();
      if(points.error) return false;
      await this.storage.set('points',points)
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPoints(){
    let data:IwkAPI.Points = await this.storage.get('points')
    if(!data){
      await this.updatePoints()
      data = await this.storage.get('points')
    }
    return data;
  }

  async updateGrades(){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let grades:IwkAPI.Grades = await this.http.get<IwkAPI.Grades>(this.apiURL+'grades',{headers}).toPromise()
      if(grades.msg == 'Session Timeout') this.logout();
      if(grades.error) return false;
      await this.storage.set('grades',grades)
      return true;
    } catch (error) {
      return false;
    }
  }

  async getGrades(){
    let data:IwkAPI.Grades = await this.storage.get('grades')
    if(!data){
      await this.updateGrades()
      data = await this.storage.get('grades')
    }
    return data;
  }

  async updateFees(){
    if(!this.base64auth) return;

    try {
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let fees:IwkAPI.Fees = await this.http.get<IwkAPI.Fees>(this.apiURL+'fees',{headers}).toPromise()
      if(fees.msg == 'Session Timeout') this.logout();
      if(fees.error) return false;
      await this.storage.set('fees',fees)
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFees(){
    let data:IwkAPI.Fees = await this.storage.get('fees')
    if(!data){
      await this.updateFees()
      data = await this.storage.get('fees')
    }
    return data;
  }

  async updateSubjects(semcode?:string){
    if(!this.base64auth) return;

    try {
      let query = semcode ? `?semcode=${semcode}` : ''
      let headers = new HttpHeaders().set('Authorization',this.base64auth)
      let subjects:IwkAPI.Subjects = await this.http.get<IwkAPI.Subjects>(this.apiURL+'subjects'+query,{headers}).toPromise()
      if(subjects.msg == 'Session Timeout') this.logout();
      if(subjects.error) return false;
      await this.user.setSem(subjects.currentSem)
      await this.user.setSemCode(subjects.currentSemCode)
      if(subjects.currentSem != subjects.data[0].semCode){
        await this.user.generateSemList()
        let sem = this.user.getSemFromSemCode(subjects.data[0].semCode)
        if(sem && sem>subjects.currentSem){
          await this.user.setSem(sem)
          await this.user.setSemCode(subjects.data[0].semCode)
        }
      }
      let localSubjects:IwkAPI.Subjects = await this.storage.get('subjects')
      if(!localSubjects) {
        await this.storage.set('subjects',subjects)
      } else {
        localSubjects.data = localSubjects.data.filter(d=>d.semCode)
        let index = localSubjects.data.findIndex(s => s.semCode === subjects.data[0].semCode)
        if(index===-1){
          localSubjects.data.push(subjects.data[0])
        } else {
          localSubjects.data[index] = subjects.data[0]
        }
        localSubjects.data.sort((a,b) => parseInt(this.user.getSemFromSemCode(b.semCode)) - parseInt(this.user.getSemFromSemCode(a.semCode)))
        await this.storage.set('subjects',localSubjects)
      }
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  async getSubjects(){
    let subjects:IwkAPI.Subjects = await this.storage.get('subjects')
    if(!subjects.data.length){
      await this.updateSubjects()
      subjects = await this.storage.get('subjects')
    }
    return subjects;
  }
}