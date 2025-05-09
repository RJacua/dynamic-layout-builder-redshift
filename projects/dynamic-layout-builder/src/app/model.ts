import { InjectionToken } from "@angular/core";
import { ContainerData, LayoutElement, AtomicElementData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: LayoutElement<ContainerData>[] = [
    {
        data: {
            id: 'aikb5', parentId: 'canvas', type: 'container', style: { }, enabler: {},
            children: [
                { data: { id: 'mo6av', parentId: 'aikb5', type: 'header', style: {}, enabler: {}, text: 'Coiso' } },
                { data: { id: 'plq01', parentId: 'aikb5', type: 'paragraph', style: {}, enabler: {}, text: 'Teste Teste Teste' } },
                { data: { id: '1bu89', parentId: 'aikb5', type: 'container', style: {}, enabler: {} } },
            ]
        },
    },
    {
        data: {
            id: 'aikb5', parentId: 'canvas', type: 'container', style: { }, enabler: {},
            children: [
                { data: { id: 'mo6av', parentId: 'aikb5', type: 'header', style: {}, enabler: {}, text: 'Coiso' } },
                { data: { id: 'plq01', parentId: 'aikb5', type: 'paragraph', style: {}, enabler: {}, text: 'Teste Teste Teste' } },
                { data: { id: '1bu89', parentId: 'aikb5', type: 'container', style: {}, enabler: {} } },
            ]
        },
    },
    {
        data: {
            id: 'b8c22183',
            parentId: 'canvas',
            type: 'container',
            style: {}, 
            enabler: {},
            children: [
                {
                    data: {
                        id: '6b63e537',
                        parentId: 'b8c22183',
                        type: 'header',
                        text: 'Header 1 size1',
                        style: {
                            
                        }, 
                        enabler: {}
                    }
                },
                {
                    data: {
                        id: 'b757d185',
                        parentId: 'b8c22183',
                        type: 'container',
                        style: {},
                        enabler: {},
                        children: [
                            {
                                data: {
                                    id: '3b0fdac2',
                                    parentId: 'b757d185',
                                    type: 'header',
                                    text: 'Header 1-1 size3',
                                    style: {
                                       
                                    }, 
                                    enabler: {}
                                }
                            }
                        ]
                    }
                },
                {
                    data: {
                        id: 'ffa2d18f',
                        parentId: 'b8c22183',
                        type: 'container',
                        style: {}, 
                        enabler: {},
                        children: [
                            {
                                data: {
                                    id: 'e1abccb2',
                                    parentId: 'ffa2d18f',
                                    type: 'header',
                                    text: 'Header 1-2 size1',
                                    style: {
                                       
                                    }, 
                                    enabler: {}
                                }
                            },
                            {
                                data: {
                                    id: '8679c17a',
                                    parentId: 'ffa2d18f',
                                    type: 'paragraph',
                                    text: 'Para 1-2 align left',
                                    style: {
                                        'background-color': '#3dd',
                                        'opacity': 1,
                                        'font-size': '24px',
                                        'font-weight': '900',
                                        'color': 'blue',
                                        'text-align': 'right',
                                      }, 
                                      enabler: {}
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
]