import { Component, OnInit } from '@angular/core';
import {ListeGrilleService} from'../../app/ListeGrilleService/liste-grille.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public listeGrille: any = []
  public listeInfo: any = []
  public maxListe: any = []

  constructor(private listeGrilleService: ListeGrilleService) {
    this.maxListe = listeGrilleService.maxListe
  }

  ionViewWillEnter(){
    this.listeGrille = [...this.listeGrilleService.listeGrille]
    this.listeInfo = [...this.listeGrilleService.infoListeGrille]
  }

  remove(i: number){
   /* let tmpArray = []
    let tmpInfo = []
    for(let j = 0; j < this.listeGrille.length; j++){
      if(j != i){
        tmpArray.push(this.listeGrille[j])
        tmpInfo.push(this.listeInfo[j])
      }
    }
    this.listeGrille = [...tmpArray]
    this.listeInfo = [...tmpInfo]*/

    this.listeGrilleService.remove(i)
    this.listeGrilleService.addGlobal()
    this.ionViewWillEnter()
  }

}
