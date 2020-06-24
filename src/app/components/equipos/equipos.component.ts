import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { Equipos } from '../../models/equipos';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css'],
  providers: [EquiposService]
})
export class EquiposComponent implements OnInit {
  Titulo = "Equipos";
  TituloAccionABMC = {
    A: "(Agregar)",
    M: "(Modificar)",
    L: "(Listado)"
  };

  AccionABMC = "L";

  Mensajes = {
    RD: " Revisar los datos ingresados..."
  };

  submitted = false;

  Equipos: Equipos[] = [];

  formGroup: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private equiposService: EquiposService,
    private modalDialogService: ModalDialogService
  ){}
 
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      IdEquipo: [0],
      EquipoNombre: ["", Validators.required],
      EquipoRanking: ["",[Validators.required, Validators.pattern("[0-9]{1,7}")]
      ],
    });
    this.GetEquipos();
  }
 
  GetEquipos() {
    this.equiposService.get().subscribe((res: Equipos[])=> {
      this.Equipos = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.formGroup.reset();
    this.submitted = false;
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); 
    this.equiposService.getById(Dto.IdEquipo).subscribe((res: any) => {
      this.formGroup.patchValue(res);
      this.AccionABMC = AccionABMC;
    });
  }

  Modificar(Dto) {
    this.submitted = false;
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.BuscarPorId(Dto, "M");
  }
  
  Grabar() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const itemCopy = { ...this.formGroup.value };
    if (itemCopy.IdEquipo == null){
      itemCopy.IdEquipo = 0;
    }
    // agregar post
    if (itemCopy.IdEquipo == 0) {
      this.equiposService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.', 'Exito', 's');
        this.GetEquipos();
      });
    } else {
      // modificar put
      this.equiposService.put(itemCopy.IdEquipo, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.GetEquipos();
        });
    }
  }

  Eliminar(Dto) {
    this.modalDialogService.Confirm(
      "Esta seguro de eliminar este registro?", undefined, undefined, undefined, () => this.equiposService.delete(Dto.IdEquipo).subscribe((res: any) => {
        this.modalDialogService.Alert('Registro eliminado correctamente.', 'Exito', 's');
        this.GetEquipos();
      }), () => this.Volver(), 'd'
    );
  }

  Volver() {
    this.AccionABMC = "L";
  }

}