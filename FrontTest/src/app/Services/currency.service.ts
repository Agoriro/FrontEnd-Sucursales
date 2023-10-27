import { Injectable } from '@angular/core';

import{HttpClient} from '@angular/common/http';
import{environment} from 'src/environments/enviroment';
import {Observable} from 'rxjs';
import { Currency } from '../Interfaces/currency';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private endPoint:string = environment.endPoint;
  private apiUrl:string = this.endPoint +"currency/";
  constructor(private http:HttpClient) { }

  getList():Observable<Currency[]>{
    return this.http.get<Currency[]>(`${this.apiUrl}list`);
  }
}
