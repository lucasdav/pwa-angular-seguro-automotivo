import { Injectable, Injector } from '@angular/core';
import { Seguro } from '../models/seguro';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro> {

  constructor(
    protected injector: Injector
  ) {
    super(injector, 'seguros', 'http://localhost:9000/api/seguros');
   }

}
