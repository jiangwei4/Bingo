import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListeGrilleService {
  public listeGrille: any = []
  public infoListeGrille: any = []
  public listePari = [0, 0.02, 0.27, 1.13, 3.50, 9.13, 16.22, 21.52, 19.99, 15.33, 8.76, 3.01, 0.88, 0.20, 0, 0]
  public listeMoy  = [0, 0, 0, 0.02, 0.10, 0.43, 1.06, 1.99, 3.34, 5.21, 7.40, 8.85, 10.70, 11.54, 12.03, 12.04, 9.49, 9.25, 5.44, 1.09, 0, 0]
  public listePLG  = [0, 0, 0, 0, 0, 3.80, 19.35, 38.86, 29.06, 8.24, 0.67, 0, 0, 0, 0, 0]
  public listeRes  = [5.27, 18.18, 27.98, 25.30, 14.95, 6.11, 1.77, 0.37, 0.05, 0.01, 0, 0, 0, 0, 0, 0,0]
  public maxListe = [Math.max(...this.listePLG),Math.max(...this.listePari),Math.max(...this.listeMoy),Math.max(...this.listeRes)]

  constructor() { 
    this.listeGrille = []
    this.infoListeGrille = []
  }

  add(g: number[], info: number[]){
    this.listeGrille.push(g)
    this.infoListeGrille.push(info)
  }

  ressemblance(g1: number[],g2: number[]){
    let cpt = 0
    g1.forEach((i) => {
      if(g2.includes(i))
        cpt += 1
    })
    return cpt
  }


  addGlobal(){
    if(this.listeGrille.length == 1){
      this.infoListeGrille[0][3] = Math.max(...this.listeRes)
      this.infoListeGrille[0][5] = Math.floor((this.infoListeGrille[0][0] + this.infoListeGrille[0][1] + this.infoListeGrille[0][2] + this.infoListeGrille[0][3]) * 100 / (this.maxListe[0] + this.maxListe[1] + this.maxListe[2] + this.maxListe[3]) * 100) / 100
    }else{
      for(let i = 0; i < this.listeGrille.length; i++){
        let cpt = 0
        let histo = ""
        for(let j = 0; j < this.listeGrille.length; j++){
          if(i != j){
            cpt += this.listeRes[this.ressemblance(this.listeGrille[i],this.listeGrille[j])]
            histo += " "+this.ressemblance(this.listeGrille[i],this.listeGrille[j])
          } else {
            histo += " X "
          }
        }
        this.infoListeGrille[i][3] = Math.floor(cpt * 100 / (this.listeGrille.length-1))/100
        this.infoListeGrille[i][4] = histo
        this.infoListeGrille[i][5] = Math.floor((this.infoListeGrille[i][0] + this.infoListeGrille[i][1] + this.infoListeGrille[i][2] + this.infoListeGrille[i][3]) * 100 / (this.maxListe[0] + this.maxListe[1] + this.maxListe[2] + this.maxListe[3]) * 100) / 100
      }
    }
  }


  remove(i: number){
    let tmpArray = []
    let tmpInfo = []
    for(let j = 0; j < this.listeGrille.length; j++){
      if(j != i){
        tmpArray.push(this.listeGrille[j])
        tmpInfo.push(this.infoListeGrille[j])
      }
    }
    this.listeGrille = [...tmpArray]
    this.infoListeGrille = [...tmpInfo]
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
}
