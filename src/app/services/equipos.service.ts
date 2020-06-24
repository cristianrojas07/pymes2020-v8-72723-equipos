import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Articulo } from "../models/articulo";

@Injectable()
export class EquiposService {

  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = "https://pavii.ddns.net/api/equipos/";
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  post(obj:Articulo) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj:Articulo) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}