import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Gcp } from '../gcp-structure';


@Injectable({
  providedIn: 'root'
})
export class GcpService {

  private gcpDataByName:{[name:string]:Gcp}={}

  private listGcp = new Subject<Gcp[]>()

  listGcp$ = this.listGcp.asObservable()

  constructor() { }

  async loadGcp(){
  }

  addGcps(data:Gcp[]){
    const datawithoutDuplications:Gcp[]=data.filter(d=> !this.gcpDataByName[d.name])
    datawithoutDuplications.forEach(d=> this.gcpDataByName[d.name]=d)
    this.listGcp.next(datawithoutDuplications)
  }
}
