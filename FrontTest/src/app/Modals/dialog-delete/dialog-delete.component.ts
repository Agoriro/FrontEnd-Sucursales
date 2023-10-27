import { Component,OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Branch } from 'src/app/Interfaces/branch';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent {

  constructor(
    private dialogReference:MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataBranch:Branch
  ){}

  ngOnInit():void{}

  confirmDelete(){
    //Verifica que le hayan enviado datos para eliminar
    if(this.dataBranch){
      this.dialogReference.close("eliminado");
    }
  }
}
