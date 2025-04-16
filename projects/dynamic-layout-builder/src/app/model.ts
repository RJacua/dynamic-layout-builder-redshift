import { InjectionToken } from "@angular/core";
import { ContainerData, LayoutElement, AtomicElementData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: LayoutElement<ContainerData>[] = [
    {
        data: {
            id: 'aikb5', parentId: 'canvas', type: 'container', style: { direction: 'column' },
            children: [
                { data: { id: 'mo6av', parentId: 'aikb5', type: 'header', style: {}, text: 'Coiso' } },
                { data: { id: 'plq01', parentId: 'aikb5', type: 'paragraph', style: {}, text: 'Teste Teste Teste' } },
                { data: { id: '1bu89', parentId: 'aikb5', type: 'container', style: {} } },
            ]
        },
    },
    {
        data: {
            id: 'aikb5', parentId: 'canvas', type: 'container', style: { direction: 'row' },
            children: [
                { data: { id: 'mo6av', parentId: 'aikb5', type: 'header', style: {}, text: 'Coiso' } },
                { data: { id: 'plq01', parentId: 'aikb5', type: 'paragraph', style: {}, text: 'Teste Teste Teste' } },
                { data: { id: '1bu89', parentId: 'aikb5', type: 'container', style: {} } },
            ]
        },
    }
]