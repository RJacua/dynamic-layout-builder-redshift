import { InjectionToken } from "@angular/core";
import { LayoutElement, ContainerData, LayoutModel, AtomicElementData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: LayoutModel<ContainerData>[] = [
    {
        data: { type: 'container', style: {direction: 'column'} },
        children: [
            { data: { type: 'header', text: 'Coiso' } },
            { data: { type: 'paragraph', text: 'Teste Teste Teste' } },
            { data: { type: 'container' } },
        ]
    },
    {
        data: { type: 'container', style: {direction: 'row'} },
        children: [
            { data: { type: 'header', text: 'Coiso' } },
            { data: { type: 'paragraph', text: 'Teste Teste Teste' } },
            { data: { type: 'container' } },
        ]
    }
]