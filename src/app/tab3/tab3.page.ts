import { Component } from '@angular/core';
import {ListeGrilleService} from'../../app/ListeGrilleService/liste-grille.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public apiaddress : string = ""

  constructor(private listeGrilleService: ListeGrilleService) {
    this.apiaddress = listeGrilleService.apiAddress
  }

  changeAPIAddress(){
    this.listeGrilleService.changeAPIAddress(this.apiaddress)
  }

}
