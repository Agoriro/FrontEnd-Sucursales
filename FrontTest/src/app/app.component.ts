import { Component,AfterViewInit,ViewChild,OnInit } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Branch } from './Interfaces/branch';
import { BranchService } from './Services/branch.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddEditComponent } from './Modals/dialog-add-edit/dialog-add-edit.component';
import { DialogDeleteComponent } from './Modals/dialog-delete/dialog-delete.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements AfterViewInit, OnInit{
  title = 'Test Quala';
  displayedColumns: string[] = ['branchCode', 'branchDescription', 'branchAddress', 'branchId', 'branchDateCreation','currencyName','Actions'];
  dataSource = new MatTableDataSource<Branch>();
  constructor(
    private _branchServicio:BranchService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar ){}

//Muestra el listado de Sucursales
    showBranches(){
      this._branchServicio.getList().subscribe({
        next:(data)=>{

          this.dataSource.data=data;
        },error:(e)=>{}
      })
    }
//Abre el dialogo para crear una nueva sucursal
    openDialogAddEdit() {
      this.dialog.open(DialogAddEditComponent,{
        disableClose:true,
        width:"400px"
      }).afterClosed().subscribe(resultado =>{
        if(resultado==="creado"){
          this.showBranches();
        }
      });
    }

//Muestra los mensajes
    showAlert(message: string, action: string) {
      this._snackBar.open(message, action,{
        horizontalPosition:"end",
        verticalPosition:"top",
        duration:3000
      });
    }
//Abre el modal para editar
    openDialogEdit(dataBranch:Branch){
      this.dialog.open(DialogAddEditComponent,{
        disableClose:true,
        width:"400px",
        data:dataBranch
      }).afterClosed().subscribe(resultado =>{
        if(resultado==="actualizado"){
          this.showBranches();
        }
      });
    }
//Abre el modal para eliminar
    openDialogDelete(dataBranch:Branch){
      this.dialog.open(DialogDeleteComponent,{
        disableClose:true,
        data:dataBranch
      }).afterClosed().subscribe(resultado =>{
        if(resultado==="eliminado"){
          this._branchServicio.delete(dataBranch.idBranch).subscribe({
            next:(data) =>{
              this.showAlert("Sucursal Eliminada","Listo");
              this.showBranches();
            },error:(e)=>{}

          });
          ;
          
          
        }
      });
    }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.showBranches();
  }


}

