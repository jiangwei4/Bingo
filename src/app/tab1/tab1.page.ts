import { Component } from '@angular/core';
import {ListeGrilleService} from'../../app/ListeGrilleService/liste-grille.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 public listePari : any = []//[0, 0.02, 0.27, 1.13, 3.50, 9.13, 16.22, 21.52, 19.99, 15.33, 8.76, 3.01, 0.88, 0.20, 0, 0]
  public listeMoy : any = []// [0, 0, 0, 0.02, 0.10, 0.43, 1.06, 1.99, 3.34, 5.21, 7.40, 8.85, 10.70, 11.54, 12.03, 12.04, 9.49, 9.25, 5.44, 1.09, 0, 0]
  public listePLG : any = []// [0, 0, 0, 0, 0, 3.80, 19.35, 38.86, 29.06, 8.24, 0.67, 0, 0, 0, 0, 0]
  public listeRes : any = []// [5.27, 18.18, 27.98, 25.30, 14.95, 6.11, 1.77, 0.37, 0.05, 0.01, 0, 0, 0, 0, 0, 0,0]
  public color = ["#FE277E","#06668C","#C23028","#5B374D","#F26619","#96527A","#679436","#77021D","#5FC2BA","#5FC2BA"]
  public maxListe : any = []
  public grille: any = []
  public listeGrille : any = []
  public infoGrille: any = [0,0,0,0,"",0]
  public infoGrilleTotal: any = []

  constructor(private listeGrilleService: ListeGrilleService) {
    this.listePari = listeGrilleService.listePari
    this.listeMoy = listeGrilleService.listeMoy
    this.listePLG = listeGrilleService.listePLG
    this.listeRes = listeGrilleService.listeRes
    this.maxListe = this.listeGrilleService.maxListe
    this.effacer()
  }

  effacer(){
    this.grille =  []
    for(let i = 0; i < 90; i++){
      this.grille.push(0)
    }
  }

  add(){
    if(this.listeGrilleService.contientGrille(this.compte15())){
      this.listeGrille.push(this.grille)
      this.infoGrilleTotal.push(this.infoGrille)
      this.listeGrilleService.add(this.compte15(),this.infoGrille)
      this.infoGrille = [0,0,0,0,"",0]
      this.effacer()
      this.listeGrilleService.addGlobal()
    }
  }

  addG(g: number []){
    this.infoGrille[0] = this.listePLG[this.listeGrilleService.plg(g)]
    this.infoGrille[1] = this.listePari[this.listeGrilleService.impari(g)]
    this.infoGrille[2] = this.listeMoy[this.listeGrilleService.centreGrilles(g)-34]
    if(this.listeGrille.length == 0){
      this.infoGrille[3] = this.listeGrilleService.maxListe[3]
    }else{
      let cpt = 0
      for(let i = 0; i < this.listeGrilleService.listeGrille.length; i++){
        cpt += this.listeRes[this.listeGrilleService.ressemblance(this.listeGrilleService.listeGrille[i],g)]
      }
      this.infoGrille[3] = Math.floor(cpt * 100 / (this.listeGrilleService.listeGrille.length))/100 
    }
  }

  disabled(){
    return !this.listeGrilleService.contientGrille(this.compte15())
  }


  changeVal(val: number){
    this.grille[val] = this.grille[val] == 0 ? 1 : 0 
    let tmpArray = this.compte15()
    if(this.listeGrilleService.contientGrille(tmpArray)){
      this.addG(tmpArray)
    } else {
      this.infoGrille = [0,0,0,0,"",0]
    }
  }

  compte15(){
    let cpt = []
    for(let i = 0; i < this.grille.length; i++){
      if(this.grille[i] != 0)
        cpt.push(i)
    }
    return cpt
  }
}
