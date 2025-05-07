import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AtomicElementData, ContainerData, LayoutElement } from '../interfaces/layout-elements';
import { ModelService } from './model.service';

//Criar selectedNode que vai ser passado pras coisas do style
//Em cada style fazer o update do Canvas Model grande, isso vai atualizar o seçected node...
//Garantir reatividade, acho q precisa de effect e untracked pra evitar loop infinito

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  readonly modelSvc = inject(ModelService);
  // private selectedElement = new BehaviorSubject<ContainerData | AtomicElementData | any>({});
  // selectedElement$ = this.selectedElement.asObservable();
  // selectedElementId = signal('');
  // selectedNode:WritableSignal<LayoutElement<ContainerData | AtomicElementData> | undefined> = signal(undefined);

  // select(element: ContainerData | AtomicElementData) {
  //   // this.selectedElement.next(element);
  //   console.log("id selected: ", element.id);
  //   this.selectedElementId.set(element.id);
  //   this.selectedNode.set(this.modelSvc.getNodeById(element.id));
  //   //console.log(this.selectedNode());
  // }

  private _selectedId = signal<string>('');
  selectedElementId = computed(this._selectedId);
  selectedNode = computed(() => this.modelSvc.getNodeById(this.selectedElementId(), this.modelSvc.canvasModel()));

  select(element: ContainerData | AtomicElementData): void {   
    if(element.id !== this._selectedId()){
    this._selectedId.set(element.id);
    }
    else this._selectedId.set('0');
    // console.log(this.selectedNode())
  }
  
  selectById(id: string){
    if(id !== this._selectedId()){
      this._selectedId.set(id);
    }
    else this._selectedId.set('0');
  }

}