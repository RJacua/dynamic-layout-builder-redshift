import { InjectionToken } from "@angular/core";
import { ContainerData, LayoutElement, AtomicElementData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: LayoutElement<ContainerData>[] = [
    {
        data: {
            id: "3616768e",
            parentId: "canvas",
            type: "container",
            enabler: {
                enableStroke: false
            },
            style: {
                "background-color": "rgba(255, 255, 255,0)",
                "opacity": "1",
                "flex-direction": "column",
                "border-color": "#81828555",
                "border-style": "solid",
                "border-width": "1px",
                "border-radius": "0px"
            },
            children: [
                {
                    data: {
                        id: "95c27bd6",
                        parentId: "3616768e",
                        type: "header",
                        enabler: {
                            enableStroke: false
                        },
                        style: {
                            "background-color": "rgba(255,255,255,0)",
                            "opacity": "1",
                            "color": "#ff0000",
                            "text-align": "center",
                            "border-color": "",
                            "border-style": "",
                            "border-width": "0px"
                        },
                        text: "Your Title Here",
                        headerSize: "h1"
                    }
                }
            ]
        }
    },
    {
        data: {
            id: "a6cc0864",
            parentId: "canvas",
            type: "container",
            enabler: {
                enableStroke: false
            },
            style: {
                "background-color": "rgba(255, 255, 255,0)",
                "opacity": "1",
                "flex-direction": "column",
                "border-color": "#81828555",
                "border-style": "solid",
                "border-width": "1px",
                "border-radius": "0px"
            },
            children: [
                {
                    data: {
                        id: "7d6cf9ad",
                        parentId: "a6cc0864",
                        type: "header",
                        enabler: {
                            enableStroke: false
                        },
                        style: {
                            "background-color": "rgba(255,255,255,0)",
                            "opacity": "1",
                            "color": "#ff0000",
                            "text-align": "center",
                            "border-color": "",
                            "border-style": "",
                            "border-width": "0px"
                        },
                        text: "Your Title Here",
                        headerSize: "h1"
                    }
                },
                {
                    data: {
                        id: "b63471a2",
                        parentId: "a6cc0864",
                        type: "container",
                        enabler: {
                            enableStroke: false
                        },
                        style: {
                            "background-color": "rgba(255, 255, 255,0)",
                            "opacity": "1",
                            "flex-direction": "column",
                            "border-color": "#81828555",
                            "border-style": "solid",
                            "border-width": "1px",
                            "border-radius": "0px"
                        },
                        children: [
                            {
                                data: {
                                    id: "6dbb3745",
                                    parentId: "b63471a2",
                                    type: "header",
                                    enabler: {
                                        enableStroke: false
                                    },
                                    style: {
                                        "background-color": "rgba(255,255,255,0)",
                                        "opacity": "1",
                                        "color": "#000000",
                                        "text-align": "center",
                                        "border-color": "",
                                        "border-style": "",
                                        "border-width": "0px"
                                    },
                                    text: "Your Title Here",
                                    headerSize: "h2"
                                }
                            },
                            {
                                data: {
                                    id: "827da5db",
                                    parentId: "b63471a2",
                                    type: "paragraph",
                                    enabler: {
                                        enableStroke: false
                                    },
                                    style: {
                                        "background-color": "rgba(255,255,255,0)",
                                        "opacity": "1",
                                        "font-size": "16px",
                                        "font-weight": "400",
                                        "color": "#000000",
                                        "text-align": "center",
                                        "border-color": "",
                                        "border-style": "",
                                        "border-width": "0px"
                                    },
                                    text: "Lorem ipsum dolor sit amet consectetur..."
                                }
                            },
                            {
                                data: {
                                    id: "9e2e2060",
                                    parentId: "b63471a2",
                                    type: "container",
                                    enabler: {
                                        enableStroke: false
                                    },
                                    style: {
                                        "background-color": "rgba(255, 255, 255,0)",
                                        "opacity": "1",
                                        "flex-direction": "row",
                                        "border-color": "#81828555",
                                        "border-style": "solid",
                                        "border-width": "1px",
                                        "border-radius": "0px"
                                    },
                                    children: [
                                        {
                                            data: {
                                                id: "125f332d",
                                                parentId: "9e2e2060",
                                                type: "paragraph",
                                                enabler: {
                                                    enableStroke: false
                                                },
                                                style: {
                                                    "background-color": "rgba(255,255,255,0)",
                                                    "opacity": "1",
                                                    "font-size": "16px",
                                                    "font-weight": "400",
                                                    "color": "#000000",
                                                    "text-align": "center",
                                                    "border-color": "",
                                                    "border-style": "",
                                                    "border-width": "0px"
                                                },
                                                text: "Lorem ipsum dolor sit amet consectetur..."
                                            }
                                        },
                                        {
                                            data: {
                                                id: "51a4288b",
                                                parentId: "9e2e2060",
                                                type: "paragraph",
                                                enabler: {
                                                    enableStroke: false
                                                },
                                                style: {
                                                    "background-color": "rgba(255,255,255,0)",
                                                    "opacity": "1",
                                                    "font-size": "16px",
                                                    "font-weight": "400",
                                                    "color": "#000000",
                                                    "text-align": "center",
                                                    "border-color": "",
                                                    "border-style": "",
                                                    "border-width": "0px"
                                                },
                                                text: "Lorem ipsum dolor sit amet consectetur..."
                                            }
                                        },
                                        {
                                            data: {
                                                id: "80460d09",
                                                parentId: "9e2e2060",
                                                type: "paragraph",
                                                enabler: {
                                                    enableStroke: false
                                                },
                                                style: {
                                                    "background-color": "rgba(255,255,255,0)",
                                                    "opacity": "1",
                                                    "font-size": "16px",
                                                    "font-weight": "400",
                                                    "color": "#000000",
                                                    "text-align": "center",
                                                    "border-color": "",
                                                    "border-style": "",
                                                    "border-width": "0px"
                                                },
                                                text: "Lorem ipsum dolor sit amet consectetur..."
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    
]