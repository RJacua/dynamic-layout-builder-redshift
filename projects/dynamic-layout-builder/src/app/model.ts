import { InjectionToken } from "@angular/core";
import { LayoutElement, ContainerData, LayoutModel, AtomicElementData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: LayoutModel<ContainerData>[] = [
    {
        data: {id: 'aikb5', type: 'container', style: {direction: 'column'} },
        children: [
            { data: {id: 'mo6av', type: 'header', text: 'Coiso' } },
            { data: {id: 'plq01', type: 'paragraph', text: 'Teste Teste Teste' } },
            { data: {id: '1bu89', type: 'container' } },
        ]
    },
    {
        data: {id: 'aikb5', type: 'container', style: {direction: 'row'} },
        children: [
            { data: {id: 'mo6av', type: 'header', text: 'Coiso' } },
            { data: {id: 'plq01', type: 'paragraph', text: 'Teste Teste Teste' } },
            { data: {id: '1bu89', type: 'container' } },
        ]
    }
]