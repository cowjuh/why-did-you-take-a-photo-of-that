import { makeScene2D, Img, Layout, Txt, Rect, Node, Circle } from "@motion-canvas/2d";
import {
  Reference,
  SimpleSignal,
  ThreadGenerator,
  all,
  createRef,
  createSignal,
  makeRef,
  waitFor,
} from "@motion-canvas/core";
import image1 from "../../images/v1/IMG_3763.png";
import image2 from "../../images/v1/IMG_3765.png";
import image3 from "../../images/v1/IMG_4181.png";
import image4 from "../../images/v1/IMG_7459.png";
import image5 from "../../images/v1/IMG_7459.png";
import image6 from "../../images/v1/IMG_7472.png";
import image7 from "../../images/v1/IMG_8897.png";

const PINK = "#EF33FF";
const PINK_20 = "rgba(239, 51, 255, 0.20)";
const LIME = "#DBFF00";
const LIME_20 = "rgba(219, 255, 0, 0.2)";
const CYAN = "#00E0FF";

const FONT_FAMILY = "'IBM Plex Mono', monospace";

type ImageObject = {
  src: string;
  textDetections: TextDetection[];
  imageDetections: ImageDetection[];
  sceneDetections: SceneDetection[];
};

type TextDetection = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type ImageDetection = {
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type SceneDetection = {
  description: string;
};

const imgBacklitAngel: ImageObject = {
  src: image1,
  textDetections: [],
  imageDetections: [{ description: "Backlit angel", x: -100, y: 30, width: 250, height: 200 }],
  sceneDetections: [{ description: "Ethereal ambiance" }, { description: "Are we about to make out rn?" }],
};

const imgNewspaper: ImageObject = {
  src: image4,
  textDetections: [
    { text: "!@8#*(*@32°?", x: -250, y: -100, width: 500, height: 400 },
    { text: "!@8#*(*@32°?", x: -450, y: -100, width: 500, height: 400 },
    { text: "!@8#*(*@32°?", x: -350, y: -100, width: 500, height: 400 },
  ],
  imageDetections: [{ description: "Tear", x: -700, y: 40, width: 200, height: 200 }],
  sceneDetections: [{ description: "Analog nature" }, { description: "I can't read Chinese" }],
};

const imgPls: ImageObject = {
  src: image6,
  textDetections: [
    { text: "BIG*ALL", x: -600, y: -600, width: 500, height: 200 },
    { text: "TItTieS", x: -600, y: -400, width: 500, height: 200 },
    { text: "pls", x: -600, y: -400, width: 500, height: 200 },
  ],
  imageDetections: [{ description: "Tear", x: -700, y: 40, width: 200, height: 200 }],
  sceneDetections: [{ description: "Analog nature" }, { description: "I can't read Chinese" }],
};

const allImages: ImageObject[] = [imgNewspaper, imgBacklitAngel];

export default makeScene2D(function* (view) {
  const imageObj: SimpleSignal<ImageObject> = createSignal(allImages[0]);
  const src = createSignal(() => imageObj().src);

  const textDetections = createSignal(() => imageObj().textDetections);
  const imageDetections = createSignal(() => imageObj().imageDetections);
  const sceneDetections = createSignal(() => imageObj().sceneDetections);

  const numTextDetections = createSignal(allImages[0].textDetections.length);
  const numImageDetections = createSignal(allImages[0].imageDetections.length);
  const numSceneDetections = createSignal(allImages[0].sceneDetections.length);

  const bgImgRef = createRef<Img>();

  // Image Detections
  const imageBoundingBoxRefs: Rect[] = [];
  const imageDescriptionBoxRefs: Rect[] = [];
  const imageDescriptionTextBoxRefs: Txt[] = [];
  const imageDetectionContainerRefs: Rect[] = [];

  // Text Detections
  const textBoundingBoxRefs: Rect[] = [];
  const textDescriptionBoxRefs: Rect[] = [];
  const textDescriptionTextBoxRefs: Txt[] = [];
  const textDetectionContainerRefs: Rect[] = [];

  view.add(
    <Rect offset={[-1, -1]} x={0} y={0}>
      <Img src={src} scale={0.5} ref={bgImgRef} />
      {/* COUNTERS */}
      <Rect layout offset={[-1, 1]} x={-680} y={-800} direction={"column"} fontSize={40} gap={30}>
        <Txt text={"Detected"} fontFamily={FONT_FAMILY} fill={"#FFFFFF"} />
        <Rect layout direction={"row"} gap={50}>
          <Rect fill={PINK} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={() => {
                let singular = numImageDetections() === 1;
                let num = numImageDetections();
                return `${num} image${singular ? "" : "s"}`;
              }}
              fill={"#FFFFFF"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
          <Rect fill={LIME} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={() => {
                let singular = numTextDetections() === 1;
                let num = numTextDetections();
                return `${num} segment${singular ? "" : "s"}`;
              }}
              fill={"#000000"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
          <Rect fill={CYAN} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={() => {
                let singular = numSceneDetections() === 1;
                let num = numSceneDetections();
                return `${num} scene${singular ? "" : "s"}`;
              }}
              fill={"#000000"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
        </Rect>
      </Rect>

      {/* IMAGE DETECT BOXES */}
      <Rect>
        {imageDetections().map((detection, i) => {
          const { description, x, y, width, height } = detection;
          return (
            <Rect
              layout
              direction={"column"}
              x={x}
              y={y}
              offset={[-1, -1]}
              ref={makeRef(imageDetectionContainerRefs, i)}
            >
              <Rect
                fill={PINK}
                x={0}
                y={0}
                minWidth={width}
                layout
                padding={[30, 30, 20, 30]}
                ref={makeRef(imageDescriptionBoxRefs, i)}
              >
                <Txt
                  text={description}
                  fill={"#FFFFFF"}
                  fontSize={30}
                  fontFamily={FONT_FAMILY}
                  ref={makeRef(imageDescriptionTextBoxRefs, i)}
                />
              </Rect>
              <Rect
                width={width}
                height={height}
                fill={PINK_20}
                stroke={PINK}
                lineWidth={4}
                ref={makeRef(imageBoundingBoxRefs, i)}
              />
            </Rect>
          );
        })}
      </Rect>
      {/* TEXT DETECT BOXES */}
      <Rect>
        {textDetections().map((detection, i) => {
          const { text, x, y, width, height } = detection;
          return (
            <Rect
              layout
              direction={"column"}
              x={x}
              y={y}
              offset={[-1, -1]}
              ref={makeRef(textDetectionContainerRefs, i)}
            >
              <Rect
                fill={LIME}
                x={0}
                y={0}
                minWidth={width}
                layout
                padding={[30, 30, 20, 30]}
                ref={makeRef(textDescriptionBoxRefs, i)}
              >
                <Txt
                  text={text}
                  fill={"#000000"}
                  fontSize={30}
                  fontFamily={FONT_FAMILY}
                  ref={makeRef(textDescriptionTextBoxRefs, i)}
                />
              </Rect>
              <Rect
                width={width}
                height={height}
                fill={LIME_20}
                stroke={LIME}
                lineWidth={4}
                ref={makeRef(textBoundingBoxRefs, i)}
              />
            </Rect>
          );
        })}
      </Rect>
      {/* SCENE DETECTIONS */}
      <Rect layout offset={[-1, 1]} x={-680} y={940} direction={"column"} fontSize={40} gap={30}>
        <Txt text={"Scenes"} fontFamily={FONT_FAMILY} fill={"#FFFFFF"} />
        <Rect layout direction={"row"} gap={50}>
          {sceneDetections().map((detection) => {
            return (
              <Rect fill={CYAN} x={0} y={0} layout padding={[20, 20, 15, 20]}>
                <Txt text={detection.description} fill={"#000000"} fontSize={30} fontFamily={FONT_FAMILY} />
              </Rect>
            );
          })}
        </Rect>
      </Rect>
    </Rect>
  );

  const initializeState = () => {
    const obj = [];

    // Reset image boxes
    for (let i = 0; i < imageBoundingBoxRefs.length; i++) {
      obj.push(imageBoundingBoxRefs[i].height(0, 0));
      obj.push(imageBoundingBoxRefs[i].opacity(0, 0));
      obj.push(imageDescriptionBoxRefs[i].opacity(0, 0));
      obj.push(imageDescriptionTextBoxRefs[i].text("...", 0));
    }

    // Reset text boxes
    for (let i = 0; i < textBoundingBoxRefs.length; i++) {
      obj.push(textBoundingBoxRefs[i].height(0, 0));
      obj.push(textBoundingBoxRefs[i].opacity(0, 0));
      obj.push(textDescriptionBoxRefs[i].opacity(0, 0));
      obj.push(textDescriptionTextBoxRefs[i].text("...", 0));
    }
    return obj;
  };

  // Animates one single image bounding box
  const displayImageBoundingBox = (textRef: Txt, containerRef: Layout, boundingBoxRef: Rect) => {
    // assumes image state has been initialized?
    return boundingBoxRef.height(0, 0);
  };

  //TODO: Add loader animation here
  const animateAnalyzing = () => {};

  const swapImage = (newImageObject: ImageObject, imgRef: Reference<Img>) => {
    return imgRef().src(newImageObject.src);
  };

  function* animateSingleImage() {
    for (let i = 0; i < allImages.length; i++) {
      const imgData = allImages[i];

      yield* initializeState();

      yield* all(
        numImageDetections(imgData.imageDetections.length, 0),
        numTextDetections(imgData.textDetections.length, 0),
        numSceneDetections(imgData.sceneDetections.length, 0)
      );

      // TODO: this does not need to be duplicate code
      // Image detections
      if (imgData.imageDetections.length > 0) {
        for (let j = 0; j < imgData.imageDetections.length; j++) {
          let curImgDetection = imgData.imageDetections[j];
          let boundingBoxRef = imageBoundingBoxRefs[j];
          let descriptionTextRef = imageDescriptionTextBoxRefs[j];
          let descriptionBoxRef = imageDescriptionBoxRefs[j];
          let detectionContainerRef = imageDetectionContainerRefs[j];
          yield* swapImage(imgData, bgImgRef);
          yield* all(
            detectionContainerRef.position([curImgDetection.x, curImgDetection.y], 0),
            detectionContainerRef.minWidth(curImgDetection.width, 0)
          );
          yield* all(boundingBoxRef.opacity(100, 0.5), boundingBoxRef.height(curImgDetection.height, 0.7));
          yield* all(descriptionBoxRef.opacity(100, 0.5), descriptionTextRef.text(curImgDetection.description, 1));
        }
      }

      if (imgData.textDetections.length > 0) {
        for (let k = 0; k < imgData.textDetections.length; k++) {
          let txtCurImgDetection = imgData.textDetections[k];
          let txtBoundingBoxRef = textBoundingBoxRefs[k];
          let txtDescriptionTextRef = textDescriptionTextBoxRefs[k];
          let txtDescriptionBoxRef = textDescriptionBoxRefs[k];
          let txtDetectionContainerRef = textDetectionContainerRefs[k];
          yield* swapImage(imgData, bgImgRef);
          yield* all(
            txtDetectionContainerRef.position([txtCurImgDetection.x, txtCurImgDetection.y], 0),
            txtDetectionContainerRef.minWidth(txtCurImgDetection.width, 0)
          );
          yield* all(txtBoundingBoxRef.opacity(100, 0.5), txtBoundingBoxRef.height(txtCurImgDetection.height, 0.7));
          yield* all(txtDescriptionBoxRef.opacity(100, 0.5), txtDescriptionTextRef.text(txtCurImgDetection.text, 1));
        }
      }
      // Text detections
      yield* waitFor(2);
    }
  }

  yield* animateSingleImage();
});
