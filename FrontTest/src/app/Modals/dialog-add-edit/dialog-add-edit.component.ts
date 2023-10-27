import { Component,OnInit,Inject } from '@angular/core';
import{FormBuilder,FormGroup,Validators,FormControl, ValidationErrors, AbstractControl} from "@angular/forms";
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import{MAT_DATE_FORMATS} from '@angular/material/core';
import * as moment from 'moment';

import { Branch } from 'src/app/Interfaces/branch';
import { BranchService } from 'src/app/Services/branch.service';
import { Currency } from 'src/app/Interfaces/currency';
import { CurrencyService } from 'src/app/Services/currency.service';



export const MY_DATE_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY',
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY',
    dateA11yLabel:'LL',
    monthYearA11yLabel:'MMMM YYYY'

  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers:[
    {
      provide:MAT_DATE_FORMATS,useValue:MY_DATE_FORMATS
    }
  ]
})
export class DialogAddEditComponent implements OnInit {
  //Carga Variables
  formBranch:FormGroup;
  title:string = "Nuevo";
  actionButton:string ="Guardar";
  public listaResult:Currency[]=[];
 

  constructor(
    private dialogReference:MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _branchService:BranchService,
    private _currencyService:CurrencyService,
    @Inject(MAT_DIALOG_DATA) public dataBranch:Branch
  ){
    //Inicializa el formulario
    this.formBranch = this.fb.group({
      branchCode:["",Validators.required], 
      branchDescription:["",[Validators.required,Validators.maxLength(250)]], 
      branchAddress:["",[Validators.required,Validators.maxLength(250)]], 
      branchId:["",[Validators.required,Validators.maxLength(50)]], 
      branchDateCreation:["",[Validators.required,this.dateValidator]],
      idCurrency:["",Validators.required]
    })

    //obtiene datos de las monedas
    this._currencyService.getList().subscribe({
      next:(data)=>{
        
        this.listaResult=data;
        
        
        
      },error:(e)=>{}

      
  })

  }

  //validación de la fecha
dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control?.value) {
      const today = new Date();
      const dateToCheck = new Date(control.value);
      if (dateToCheck < today) {
          return {'Invalid date': true}
      }
  }
  return null;
}

//muestras mensajes
  showAlert(message: string, action: string) {
    this._snackBar.open(message, action,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  //anexa o guarda el registro según sea el caso
  addEditBranch(){
    
    const modelo:Branch={
      idBranch:0,
      branchCode: this.formBranch.value.branchCode,
      branchDescription: this.formBranch.value.branchDescription,
      branchAddress:this.formBranch.value.branchAddress,
      branchId:this.formBranch.value.branchId,
      branchDateCreation:moment(this.formBranch.value.branchDateCreation).format("DD/MM/YYYY"),
      idCurrency:this.formBranch.value.idCurrency,
      currencyName:this.formBranch.value.currencyName
    }
    if(this.dataBranch == null){
      this._branchService.add(modelo).subscribe({
        next:(data)=>{
          this.showAlert("Sucursal Creada","Listo");
          this.dialogReference.close("creado");
        },error:(e)=>{
          this.showAlert("Error al crea la sucursal","Error");
        }
      })
    }
    else{
      this._branchService.update(this.dataBranch.idBranch,modelo).subscribe({
        next:(data)=>{
          this.showAlert("Sucursal Actualizada","Listo");
          this.dialogReference.close("actualizado");
        },error:(e)=>{
          this.showAlert("Error al creal la sucursal","Error");
        }
      })
    }
  }


  ngOnInit():void{
    //Muestra los datos cuando es por editar
    if(this.dataBranch){
      
      this.formBranch.patchValue(
        {
          idBranch:this.dataBranch.idBranch,
          branchCode:this.dataBranch.branchCode,
          branchDescription:this.dataBranch.branchDescription,
          branchAddress:this.dataBranch.branchAddress,
          branchId:this.dataBranch.branchId,
          branchDateCreation:moment(this.dataBranch.branchDateCreation,'DD/MM/YYYY'),
          idCurrency:this.dataBranch.idCurrency
        }
      )
      
      this.title = "Editar";
      this.actionButton = "Actualizar"
    }



  }
}
