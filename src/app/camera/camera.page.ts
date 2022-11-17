import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  public cameraOpen: boolean = false
  public pictureIs: boolean = false
  public imageB64: string = ""
  public tmpFili: boolean = false
  public valScale: string = ""

  public filigrane: boolean = false
  public margin: string = '0px 0px 0px 30px'
  public rotaVal: number = 90

  constructor(private router: Router,  private platform: Platform) { 
    if (this.filigrane)
    this.scale(this.rotaVal)
    this.platform.ready().then(_ => {
      this.startCamera() // here the call of your function
    })

  }

  ngOnInit() {
  }

  startCamera() {
    if (!this.cameraOpen) {
      this.tmpFili = true
    /*  const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: 'rear',
        tapPhoto: true,
        previewDrag: false,
        toBack: true,
        storeToFile: false
      }  
      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts)
     
      this.cameraOpen = true

      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });
      */
    }
  }

  savePicture() {
    this.pictureIs = false
    this.rotate(this.imageB64, -this.rotaVal, (b64) => {
      //this.photoService.addNewToGallery(this.iaService, b64)
    })
    this.imageB64 = ""
    //this.returnMenu()
    this.router.navigate(['/camera'])
  }

  returnMenu() {
    if (this.cameraOpen) {
      //this.cameraPreview.stopCamera()
      this.cameraOpen = false
    }
    this.router.navigate(['/'])
  }


scale(rota:number) {
      const im = new Image()
      im.crossOrigin = 'anonymous'
      im.src = "assets/filigrane.png"
    im.onload = () => {
      if (rota == 90 || rota == -90) {
        this.valScale = 'rotate('+rota+'deg) scale(' + Math.floor(((window.screen.height / im.width + window.screen.width / im.height) / 2) * 100) / 100 + ')'
      } else {
        this.valScale = 'rotate(' + rota + 'deg) scale(' + Math.floor((window.screen.width / im.width) * 100) / 100 + ')'
      }
    }
  }

  takePicture() {
   // this.cameraPreview.hide()
   /* this.cameraPreview.takePicture({
      width: window.screen.width,
      height: window.screen.height,
      quality: 100
    }).then((b64) => {
      console.log("ici")
      this.imageB64 =  'data:image/jpeg;base64,'+ b64
    })*/
    this.tmpFili = false
    this.pictureIs = true
  }

  supprPicture() {
    this.pictureIs = false
    this.tmpFili = true
   // this.cameraPreview.show()
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


}