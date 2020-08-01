import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {

  // Subject é um observable que emite eventos
  private statusConexao$ = new Subject<boolean>();

  constructor() {
    // verifica se está online ou offline para testar local, é só alterar
    //   inspecionando a tela e indo na aba Network
    // ----------------------------------abaixo um callback
    window.addEventListener('online', () => this.atualizaStatusConexao());
    window.addEventListener('offline', () => this.atualizaStatusConexao());
  }

  // utilizando o método get (getter) é possível utilizar a função abaixo como
  //  uma variável
  get isOnline(): boolean {
    return !!window.navigator.onLine;
  }

  get statusConexao(): Observable<boolean> {
    return this.statusConexao$.asObservable();
  }

  atualizaStatusConexao() {
    // o .next() vai emitir os resultados do subject
    this.statusConexao$.next(this.isOnline);
  }
}
