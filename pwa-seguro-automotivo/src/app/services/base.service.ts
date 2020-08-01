import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { OnlineOfflineService } from './online-offline.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends {id: string}> {

  private LOCAL_DB_DEXIE: Dexie;
  private table: Dexie.Table<T, any> = null;

  // protected significa que será acessado aqui e em classes filhas também
  protected http: HttpClient;
  protected onlineOfflineService: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    protected nomeTabela: string,
    protected urlApi: string,
  ) {
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);

    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
   }

  private iniciarIndexedDb() {
    // abaixo criando uma nova instância e passando o nome do banco de dados
    //   local
    this.LOCAL_DB_DEXIE = new Dexie('db-seguros');
    this.LOCAL_DB_DEXIE.version(2).stores({
      [this.nomeTabela]: 'id'
    });
    this.table = this.LOCAL_DB_DEXIE.table(this.nomeTabela);
  }

 private salvarAPI(tabela) {
   this.http.post(this.urlApi, tabela)
     .subscribe(
       () => alert('tabela foi cadastrado com sucesso'),
       (err) => console.log('Erro ao cadastrar tabela')
     );
 }

 private async salvarIndexedDb(tabela: T) {
   try {
     await this.table.add(tabela);
     const todostabelas: T[] = await this.table.toArray();
     console.log('tabela foi salvo no IndexedDB', todostabelas);
   } catch (error) {
     console.log('Erro ao incluir tabela no IndexedDB', error);
   }
 }

 private async enviarIndexedDbParaApi() {
   const todostabelas: T[] = await this.table.toArray();

   for (const tabela of todostabelas) {
     this.salvarAPI(tabela);
     await this.table.delete(tabela.id);
     console.log(`tabela com o id ${tabela.id} foi excluído com sucesso`);
   }
 }

 public cadastrar(tabela: T) {
   if (this.onlineOfflineService.isOnline) {
     this.salvarAPI(tabela);
   } else {
     this.salvarIndexedDb(tabela);
   }
 }

 listar(): Observable<T []> {
   return this.http.get<T[]>(this.urlApi);
 }

 private ouvirStatusConexao() {
   this.onlineOfflineService.statusConexao.subscribe(online => {
     if (online) {
       this.enviarIndexedDbParaApi();
     } else {
       console.log('estou offline');
     }
   });
 }
}
