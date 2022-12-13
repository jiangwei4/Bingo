import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@awesome-cordova-plugins/camera-preview/ngx';
import {ListeGrilleService} from'../../app/ListeGrilleService/liste-grille.service';
import axios from 'axios';


interface APIGET {
  message: string;
}


interface APIPOST {
  optout: string;
  image:string;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})


export class CameraPage implements OnInit {
  public listePari : any = []
  public listeMoy : any = []
  public listePLG : any = []
  public listeRes : any = []
  public maxListe : any = []
  public listeGrille: any = []
  public listeInfo: any = []
  public currentGrille : any = []//[1,2,10,25,28,34,38,40,54,59,68,72,78,81,88]
  public currentGrilleString: string = ""
  public grilleValide: boolean = false
  public infoGrille: any = [0,0,0,0,"",0]
  public cameraOpen: boolean = false
  public pictureIs: boolean = false
  public imageB64First: string = ""
  public imageB64: string = ""
  public tmpFili: boolean = false
  public valScale: string = ""

  public filigrane: boolean = true
  public margin: string = '0px 0px 0px 30px'
  public rotaVal: number = 90

  constructor(private router: Router,  private platform: Platform, private cameraPreview:CameraPreview, private listeGrilleService: ListeGrilleService) { 
    this.listePari = listeGrilleService.listePari
    this.listeMoy = listeGrilleService.listeMoy
    this.listePLG = listeGrilleService.listePLG
    this.listeRes = listeGrilleService.listeRes
    this.maxListe = this.listeGrilleService.maxListe
    if (this.filigrane)
      this.scale(this.rotaVal)
  }
  

  ngOnInit() {
     axios.get<APIGET>("http://192.168.1.172:9000/")
    .then(response => {
      alert(response.data.message)
      //this.imageB64First = 'data:image/jpeg;base64,'+ response.image 
    }).catch(function (error) {
      alert(error)
    });
  } 
 
  startCamera() {
    if (!this.cameraOpen) {
      console.log(window.screen.height)
      this.tmpFili = true
      const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width:this.platform.width(),
        height:this.platform.height(),
        /*width: window.screen.width,
        height: window.screen.height,*/
        camera: 'back',
        tapPhoto: true,
        previewDrag: false,
        toBack: true,
        storeToFile: false
      }
      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts)
     
      this.cameraOpen = true
    }
  }

  savePicture() {
    this.pictureIs = false
    /*this.rotate(this.imageB64, -this.rotaVal, (b64) => {
      //this.photoService.addNewToGallery(this.iaService, b64)
    })*/
    console.log(this.imageB64)
    this.listeGrilleService.add(this.currentGrille,this.infoGrille)
    this.infoGrille = [0,0,0,0,"",0]
    this.listeGrilleService.addGlobal()


    this.imageB64 = ""
    this.returnMenu()
    this.router.navigate(['/camera'])
  }



  returnMenu() {
    if (this.cameraOpen) {
      this.cameraPreview.stopCamera()
      this.cameraOpen = false
    }
    this.router.navigate(['/'])
  }

  changeCurrentGrille(){
    this.currentGrille = JSON.parse(this.currentGrilleString)
    this.grilleValide = this.listeGrilleService.contientGrille(this.currentGrille)
    if(this.grilleValide){
      this.calculateGrille()
    }
  }

  scale(rota:number) {
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.src = "assets/filigrane.png"
    im.onload = () => {
      if (rota == 90 || rota == -90) {
        this.valScale = 'rotate('+rota+'deg) '
      } else {
        this.valScale = 'rotate(' + rota + 'deg) '
      }
    }
  }

  takePicture() {
    this.cameraPreview.hide()
    this.cameraPreview.takePicture({
      width: window.screen.width,
      height: window.screen.height,
      quality: 100
    }).then((b64) => {
      this.imageB64First = 'data:image/jpeg;base64,'+ b64
      this.imageB64 =   this.imageB64First
      this.rotate(this.imageB64, -90, async (b64) => {
        b64 = b64.split(',')[1]
        await axios.post<APIPOST>("http://192.168.1.172:9000",{imageB64:"'"+b64+"'"})
          .then(resp => {
          this.currentGrilleString = resp.data.optout
          this.currentGrille = JSON.parse(resp.data.optout)
          this.imageB64 = 'data:image/jpeg;base64,'+ resp.data.image   
          this.grilleValide = this.listeGrilleService.contientGrille(this.currentGrille)
          if(this.grilleValide){
                      this.calculateGrille()
          }
       }).catch(err => {
         alert(err)
      })
    })
  })
  this.tmpFili = false
  this.pictureIs = true
}

  supprPicture() {
    this.pictureIs = false
    this.tmpFili = true
    this.cameraPreview.show()
  }


  rotate(srcBase64:string, degrees:number, callback: (arg0: string) => void) {
    const canvas = document.createElement('canvas')
    let ctx = canvas.getContext("2d")
    let image = new Image()
    image.onload = () => {
      canvas.width = degrees % 180 === 0 ? image.width : image.height
      canvas.height = degrees % 180 === 0 ? image.height : image.width
      if(ctx){
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(degrees * Math.PI / 180)
        ctx.drawImage(image, image.width / -2, image.height / -2) 
      }
      callback(canvas.toDataURL())
    }
    image.src = srcBase64
  }

  calculateGrille(){
    let tmpArray = this.currentGrille
    this.infoGrille = [0,0,0,0,"",0]
    this.listeGrille = [...this.listeGrilleService.listeGrille]
    this.listeInfo = [...this.listeGrilleService.infoListeGrille]
    this.addG(tmpArray)
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
}
