import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import axios from "axios";
import BpmnModeler from "bpmn-js/lib/Modeler";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import customControlsModule from "./customControlsModule";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import camundaModdlePackage from "camunda-bpmn-moddle/resources/camunda";
import camundaModdleExtension from "camunda-bpmn-moddle/lib";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import download from "./download";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import "./index.css";
import { xml } from "./xml";
import Form1 from "./component/Form1";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";


function App() {
  const [modelerIstance, setModelerIstance] = useState(null);
  const [encodedData, setEncodedData] = useState(null);
  const myBpmn = useRef();
  const myPalette = useRef();
  const [checkForm, setCheckForm] = useState(false);
  function handleDownload() {
    modelerIstance.saveXML({ format: true }, function (err, xml) {
      if (xml) {
        download(xml, "fileXml.bpmn", "application/xml");
      }
    });
  }

  function handleSaveSvg() {
    modelerIstance.saveSVG({}, function (err, svg) {
      download(svg, "fileSvg.svg", "application/xml");
    });
  }

  useEffect(() => {
    if (!myBpmn || !myBpmn.current || !myPalette || !myPalette.current) return;

    const modeler = new BpmnModeler({
      container: myBpmn.current,
      additionalModules: [
        customControlsModule,
        minimapModule,
        ZoomScrollModule,
        propertiesPanelModule,
        propertiesProviderModule,
        BpmnColorPickerModule,
      ],
      moddleExtensions: {
        camunda: camundaModdlePackage,
      },

      // bpmnRenderer: {
      //    defaultFillColor: "#333",
      //     defaultStrokeColor: "#fff"
      //    },
      propertiesPanel: {
        parent: myPalette.current,
      },
    });

    var eventBus = modeler.get("eventBus");

    // you may hook into any of the following events
    var events = [
      "element.hover",
      "element.out",
      "element.click",
      "element.dblclick",
      "element.mousedown",
      "element.mouseup",
    ];

    // events.forEach(function (event) {
    //   eventBus.on(event, function (e) {
    //     // e.element = the model element
    //     // e.gfx = the graphical element
    //     console.log(event, "on", e.element.type);
    //   });
    // });

    eventBus.on("element.click", function (e) {
          setCheckForm(false);
          // e.element = the model element
          // e.gfx = the graphical element
          if(e.element.type ==="bpmn:SequenceFlow"){
            setCheckForm(true);
          }
          // console.log(e.element.type);
        });
    var elements = document.getElementsByClassName("entry");
    Array.from(elements).map((e, index) => {
      if (
        index !== 3 &&
        index !== 4 &&
        index !== 5 &&
        index !== 6 &&
        index !== 7 &&
        index !== 8 &&
        index !== 10 &&
        index !== 13
      ) {
        e.parentNode.removeChild(e);
      }
    });
    // axios
    // 	.get(
    // 		"https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn",
    // 	)
    // 	.then((data) => {
    modeler.importXML(xml, function (err) {
      if (err) {
        console.log("error rendering", err);
      }
    });
    setModelerIstance(modeler);

    return () => modeler.destroy();
  }, [myBpmn, myPalette]);

  return (
    <React.Fragment>
      <Modeler>
        <Bpmn ref={myBpmn} />
        <div className="bpmn-p-p">
          <Palette ref={myPalette}></Palette>
          {/* <div id="b-act" className="c__hide"> */}
          
            {checkForm?<Form1 />:null}  
          {/* <Form1/> */}
          {/* </div> */}
        </div>
      </Modeler>
      <ButtonXML onClick={handleDownload}>Tải file Xml</ButtonXML>
      <ButtonSVG onClick={handleSaveSvg}>Tải ảnh </ButtonSVG>
    </React.Fragment>
  );
}

const Modeler = styled.div`
  border: 5px solid black;
  width: 98vw;
  height: 95vh;
  display: flex;
`;

const Palette = styled.div`
  width: 26vw;
  overflow-x: hidden;
`;
const Bpmn = styled.div`
  border: 1px solid red;
  width: 70vw;
`;
const ButtonXML = styled.button`
  position: absolute;
  bottom: 3rem;
  right: 40rem;
  height: 4rem;
  font-size: 2rem;
`;

const ButtonSVG = styled.button`
  position: absolute;
  bottom: 3rem;
  right: 51rem;
  height: 4rem;
  font-size: 2rem;
`;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
