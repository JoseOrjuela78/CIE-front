import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IRoles } from "../../../../common/constans/models/IRoles";
import { DataTable } from "../../../../common/constans/models/IDataTable";

@Component({
  selector: 'app-editarol',
  standalone: true,
  templateUrl: './editarol.component.html',
  styleUrls: ['./editarol.component.css'],
  imports:[CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditRolComponent implements OnInit {

    menusArr:any = [];
    actionsArr:any=[];
    titulo!: string;
    estado!: boolean;
    datatable!: DataTable;
    idSeleccionado:number = 0;

    @Input() dataRol!: any;
    

    ngOnInit(): void {
        this.datatable = {
        headerRows: {
                    Titulo: "Titulo",
                    Permiso: "Permiso",
                    Estado:"Estado"
                  },
                    dataRows: []
        };
        this.titulo = this.dataRol.titulo;
        this.estado = this.dataRol.estado === 1;
        this.getMenus(this.dataRol.idRol);
        this.actionsArr = this.getActions();
    }
    
    getActions(){
        return [{codigo: 1, valor: 'Obtener'},{codigo: 2, valor: 'Obtener,Crear'},{codigo: 3, valor: 'Obtener,Crear,Actualizar'},{codigo: 4, valor: 'Obtener,Crear,Actualizar,Eliminar'}]
    }

    getMenus(idRol:number){
        const arr = [{id_menu: 1, titulo: 'Quotes'},{id_menu: 2, titulo: 'Reports'},{id_menu: 3, titulo: 'Upload'},{id_menu: 4, titulo: 'Users'}];
        arr.forEach(Element =>{
            const menu :IRoles = {
                idRol,
                titulo: Element.titulo,
                idMenu: Element.id_menu,
                idAction: 0
            };
            
            this.menusArr.push(menu);
        })
       this.datatable.dataRows = this.menusArr;
    }

    updatePermiso(idmenu:number,permiso:number){

        for(let e in this.datatable.dataRows){
            console.log(this.datatable.dataRows[e]);
            if(this.datatable.dataRows[e].idMenu === idmenu ){
                this.datatable.dataRows[e].idAction = permiso;
                break;
            }
        }

        console.log(this.datatable.dataRows);

    }
}