import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IRoles } from "../../../../common/constans/models/IRoles";
import { DataTable } from "../../../../common/constans/models/IDataTable";
import { Element } from "@angular/compiler";

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
    estado: boolean = false;
    checkInput: boolean = false;
    datatable!: DataTable;
    idSeleccionado:number = 0;

    @Input() dataRol!: any;
    

    ngOnInit(): void {
        this.datatable = {
        headerRows: {
                    Titulo: "Titulo",
                    Permisos: "Permisos"
                  },
                    dataRows: []
        };
        this.titulo = this.dataRol.titulo;
        this.getActions();
        if(this.dataRol.idRol != null){
            this.getMenusRol(this.dataRol.idRol);
        }else{
            this.getMenus(this.dataRol.idRol);
        }
        
    };
    
    getActions(){
        const result = [{codigo: 1, valor: 'Obtener'},{codigo: 2, valor: 'Crear'},{codigo: 3, valor: 'Actualizar'},{codigo: 4, valor: 'Eliminar'}]
        result.forEach((Element:any) =>{
            const value = {...Element, status:false};
            this.actionsArr.push(value);
        });
    };

    getMenusRol(idRol:number){
        const getMenusRol = [
    {
        "ID_ROL": 1,
        "ID_MENU": 1,
        "ID_ACCION": 1
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 1,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 1,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 1,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 2,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 2,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 2,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 2,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 3,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 3,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 3,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 3,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 4,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 4,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 4,
        "ID_ACCION": null
    },
    {
        "ID_ROL": 1,
        "ID_MENU": 4,
        "ID_ACCION": null
    }
    ];
     this.getMenus(idRol);

     for( let i of getMenusRol) {
           const {ID_MENU,ID_ACCION} = i;
           for(let e in this.datatable.dataRows){
            if(this.datatable.dataRows[e].idMenu === ID_MENU ){
                for(let i in this.datatable.dataRows[e].idAction){
                    if(this.datatable.dataRows[e].idAction[i].codigo === ID_ACCION){
                        this.datatable.dataRows[e].idAction[i].status = true;
                    };
                };
            };
        };
      
    
     };
    console.log(this.datatable.dataRows);
   };


    //Construye objeto base 
    getMenus(idRol:number | null){
        const getMenus = [{id_menu: 1, titulo: 'Quotes'},{id_menu: 2, titulo: 'Reports'},{id_menu: 3, titulo: 'Upload'},{id_menu: 4, titulo: 'Users'}];
        getMenus.forEach(Element =>{

            const menu :IRoles = {
                idRol,
                titulo: Element.titulo,
                idMenu: Element.id_menu,
                idAction: this.actionsArr.map((x:any)=>({...x}))
            };
            
            this.menusArr.push(menu);
        })

       this.datatable.dataRows = this.menusArr;
       console.log(this.datatable.dataRows);
    }

    updatePermiso(idmenu:number,codigo:number,permiso:boolean){
        console.log({idmenu,codigo,permiso});
        
        for(let e in this.datatable.dataRows){
            if(this.datatable.dataRows[e].idMenu === idmenu ){
                for(let i in this.datatable.dataRows[e].idAction){
                    if(this.datatable.dataRows[e].idAction[i].codigo === codigo){
                        this.datatable.dataRows[e].idAction[i].status = permiso;
                        break;
                    };
                };
            };
        };
      console.log(this.datatable.dataRows);
    };

    guardarRol(){
        //Backend
        const rows = [];
        const row = {
            ID_ROL: null,
            ID_MENU: null,
            ID_ACCION: null
        }

        for(let i of this.datatable.dataRows){
            row.ID_ROL = i.idRol
            row.ID_MENU = i.idMenu
            for(let j of i.idAction){
                row.ID_ACCION = null;
                if(j.status) row.ID_ACCION = j.codigo;
                    rows.push({...row})
                    continue;
            }
        };
        console.log({rows});
    };
};