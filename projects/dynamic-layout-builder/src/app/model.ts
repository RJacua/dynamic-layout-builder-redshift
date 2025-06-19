import { InjectionToken } from "@angular/core";
import { ContainerData, LayoutElement, AtomicElementData, Canvas, CanvasData } from "./interfaces/layout-elements";

// export const DYNAMIC_LAYOUT_BUILDER_TOKEN = new InjectionToken('DynamicLayoutBuilderToken');

export const layoutModels: Canvas<CanvasData>[] = [

    {
        data: {
            id: "canvas",
            type: "canvas",
            children: [
                {
                    data: {
                        id: "3616768e",
                        parentId: "canvas",
                        type: "container",
                        enabler: {
                            enableStroke: false,
                            enableIndividualCorner: false,
                            enableIndividualPadding: false,
                            enableIndividualMargin: false
                        },
                        style: {
                            "background-color": "#c62a2a",
                            "opacity": "1",
                            "flex-direction": "column",
                            "border-color": "#81828555",
                            "border-style": "solid",
                            "border-width": "1px",
                            "border-radius": "0px",
                            "border-top-left-radius": "0px",
                            "border-top-right-radius": "0px",
                            "border-bottom-left-radius": "0px",
                            "border-bottom-right-radius": "0px",
                            "padding": "10px",
                            "padding-top": "0px",
                            "padding-right": "0px",
                            "padding-bottom": "0px",
                            "padding-left": "0px",
                            "margin": "0px",
                            "margin-top": "0px",
                            "margin-right": "0px",
                            "margin-bottom": "0px",
                            "margin-left": "0px",
                            "height": "auto",
                            "width": "auto",
                            "max-height": "0%",
                            "max-width": "0%",
                            "min-height": "0%",
                            "min-width": "0%"
                        },
                        children: [
                            {
                                data: {
                                    id: "95c27bd6",
                                    parentId: "3616768e",
                                    type: "header",
                                    enabler: {
                                        enableStroke: false,
                                        enableIndividualCorner: false,
                                        enableIndividualPadding: false,
                                        enableIndividualMargin: false
                                    },
                                    style: {
                                        "background-color": "rgba(255,255,255,0)",
                                        "opacity": "1",
                                        "color": "#002aff",
                                        "text-align": "center",
                                        "border-color": "",
                                        "border-style": "",
                                        "border-width": "0px",
                                        "border-radius": "0px",
                                        "border-top-left-radius": "0px",
                                        "border-top-right-radius": "0px",
                                        "border-bottom-left-radius": "0px",
                                        "border-bottom-right-radius": "0px",
                                        "padding": "10px",
                                        "padding-top": "0px",
                                        "padding-right": "0px",
                                        "padding-bottom": "0px",
                                        "padding-left": "0px",
                                        "margin": "0px",
                                        "margin-top": "0px",
                                        "margin-right": "0px",
                                        "margin-bottom": "0px",
                                        "margin-left": "0px",
                                        "height": "auto",
                                        "width": "auto",
                                        "max-height": "0%",
                                        "max-width": "0%",
                                        "min-height": "0%",
                                        "min-width": "0%"
                                    },
                                    text: "Primeaaairo Slwideagg",
                                    headerSize: "h1"
                                }
                            }
                        ]
                    }
                }
            ],
            expandedNodes: new Set(),
            style: {
                "background-color": "#ee1b1b",
                "opacity": "1",
                "border-color": "#81828",
                "border-style": "solid",
                "border-width": "0px",
                "padding": "10px",
                "padding-top": "10px",
                "padding-right": "10px",
                "padding-bottom": "10px",
                "padding-left": "10px"
            },
            enabler: {
                enableStroke: false,
                enableIndividualPadding: false
            }
        }
    }
    
]