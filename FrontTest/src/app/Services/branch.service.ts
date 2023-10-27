import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import{environment} from 'src/environments/enviroment';
import {Observable} from 'rxjs';
import { Branch } from '../Interfaces/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private endPoint:string = environment.endPoint;
  private apiUrl:string = this.endPoint +"branches/";

  constructor(private http:HttpClient) { }

  getList():Observable<Branch[]>{
    return this.http.get<Branch[]>(`${this.apiUrl}list`);
  }

  add(model:Branch):Observable<Branch>{
    return this.http.post<Branch>(`${this.apiUrl}add`,model);
  }

  update(idBranch:number,model:Branch):Observable<Branch>{
    return this.http.put<Branch>(`${this.apiUrl}Update/${idBranch}`,model);
  }
  delete(idBranch:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}delete/${idBranch}`);
  }
}
