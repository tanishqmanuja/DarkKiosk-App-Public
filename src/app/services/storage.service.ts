import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async get(key){
    let res = await Storage.get({ key: key });
    let data = JSON.parse(res.value);
    return data;
  }

  async set(key,value){
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
    return;
  }
}
