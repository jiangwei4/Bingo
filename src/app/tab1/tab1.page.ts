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
    if(this.contientGrille(this.compte15())){
      this.listeGrille.push(this.grille)
      this.infoGrilleTotal.push(this.infoGrille)
      this.listeGrilleService.add(this.compte15(),this.infoGrille)
      this.infoGrille = [0,0,0,0,"",0]
      this.effacer()
      this.listeGrilleService.addGlobal()
    }
  }

  addG(g: number []){
    this.infoGrille[0] = this.listePLG[this.plg(g)]
    this.infoGrille[1] = this.listePari[this.impari(g)]
    this.infoGrille[2] = this.listeMoy[this.centreGrilles(g)-34]
    if(this.listeGrille.length == 0){
      this.infoGrille[3] = this.listeGrilleService.maxListe[3]
    }else{
      let cpt = 0
      for(let i = 0; i < this.listeGrilleService.listeGrille.length; i++){
        cpt += this.listeRes[this.ressemblance(this.listeGrilleService.listeGrille[i],g)]
      }
      this.infoGrille[3] = Math.floor(cpt * 100 / (this.listeGrilleService.listeGrille.length))/100 
    }
  }

  disabled(){
    return !this.contientGrille(this.compte15())
  }


  changeVal(val: number){
    this.grille[val] = this.grille[val] == 0 ? 1 : 0 
    let tmpArray = this.compte15()
    if(this.contientGrille(tmpArray)){
      this.addG(tmpArray)
    } else {
      this.infoGrille = [0,0,0,0,"",0]
    }
  }

  contientGrille(tab : number[]){
    let cpt = [0,0,0,0,0,0,0,0,0]
    let compteurFinale = 0
    tab.forEach((i)=>{
      if(i <= 9 && cpt[0] < 2)
        cpt[0] += 1
      if(i <= 19 && i >= 10 && cpt[1] < 2)
        cpt[1] += 1
      if(i <= 29 && i >= 20 && cpt[2] < 2)
        cpt[2] += 1
      if(i <= 39  && i >= 30 && cpt[3] < 2)
        cpt[3] += 1
      if(i <= 49 && i >= 40 && cpt[4] < 2)
        cpt[4] += 1
      if(i <= 59 && i >= 50 && cpt[5] < 2)
        cpt[5] += 1
      if(i <= 69 && i >= 60 && cpt[6] < 2)
        cpt[6] += 1
      if(i <= 79 && i >= 70 && cpt[7] < 2)
        cpt[7] += 1
      if(i >= 80 && cpt[8] < 2)
        cpt[8] += 1
      })
      cpt.forEach((i)=>{
        compteurFinale += i
      })
      if(tab.length == 15 && compteurFinale == 15 && cpt[0] >= 1 && cpt[1] >= 1 && cpt[2] >= 1 && cpt[3] >= 1 && cpt[4] >= 1 && cpt[5] >= 1 && cpt[6] >= 1 && cpt[7] >= 1 && cpt[8] >= 1)
        return true
    return false
  }

  compte15(){
    let cpt = []
    for(let i = 0; i < this.grille.length; i++){
      if(this.grille[i] != 0)
        cpt.push(i)
    }
    return cpt
  }

  impari(g1: number[]){
    let cpt = 0
    g1.forEach((i) => {
      if(i % 2 == 0)
        cpt += 1
    })
    return cpt
  }

  centreGrilles(g1: number[]){
    let cpt = 0
    g1.forEach((i) => {
      cpt += i
    })
    cpt = cpt / 15
    return Math.ceil(cpt)
  }

  plg(g1: number[]){
    let cpt = 0
    g1.forEach((i) => {
      if(i <= 45)
        cpt += 1
    })
    return cpt
  }

  ressemblance(g1: number[],g2: number[]){
    let cpt = 0
    g1.forEach((i) => {
      if(g2.includes(i))
        cpt += 1
    })
    return cpt
  }
}
