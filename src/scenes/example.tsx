import { makeScene2D, Img, Layout, Txt, Rect, Node } from "@motion-canvas/2d";
import { Reference, ThreadGenerator, all, createRef, makeRef, waitFor } from "@motion-canvas/core";
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
  textDetections: [{ text: "!@8#*(*@32°?", x: -250, y: -100, width: 500, height: 400 }],
  imageDetections: [{ description: "Tear", x: -700, y: 40, width: 200, height: 200 }],
  sceneDetections: [{ description: "Analog nature" }, { description: "I can't read Chinese" }],
};

const allImages: ImageObject[] = [imgNewspaper, imgBacklitAngel];

export default makeScene2D(function* (view) {
  const { src, textDetections, imageDetections, sceneDetections } = imgNewspaper;
  const numTextDetections = textDetections.length;
  const numImageDetections = imageDetections.length;
  const numSceneDetections = sceneDetections.length;

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

  const bgImgRef = createRef<Img>();
  view.add(
    <Rect offset={[-1, -1]} x={0} y={0}>
      <Img src={src} scale={0.5} ref={bgImgRef} />
      {/* COUNTERS */}
      <Rect layout offset={[-1, 1]} x={-680} y={-800} direction={"column"} fontSize={40} gap={30}>
        <Txt text={"Detected"} fontFamily={FONT_FAMILY} fill={"#FFFFFF"} />
        <Rect layout direction={"row"} gap={50}>
          <Rect fill={PINK} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={`${numImageDetections} image${numImageDetections === 1 ? "" : "s"}`}
              fill={"#FFFFFF"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
          <Rect fill={LIME} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={`${numTextDetections} segment${numTextDetections === 1 ? "" : "s"}`}
              fill={"#000000"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
          <Rect fill={CYAN} x={0} y={0} layout padding={[20, 20, 15, 20]}>
            <Txt
              text={`${numSceneDetections} scene${numSceneDetections === 1 ? "" : "s"}`}
              fill={"#000000"}
              fontSize={30}
              fontFamily={FONT_FAMILY}
            />
          </Rect>
        </Rect>
      </Rect>
      {/* IMAGE DETECT BOXES */}
      <Rect>
        {imageDetections.map((detection, i) => {
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
        {textDetections.map((detection, i) => {
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
          {sceneDetections.map((detection) => {
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

  const expandImageBoundingBox = () => {
    const obj = [];
    for (let i = 0; i < imageBoundingBoxRefs.length; i++) {
      const imageObj = imageBoundingBoxRefs[i].getState();
      obj.push(imageBoundingBoxRefs[i].height(0, 0));
      obj.push(imageBoundingBoxRefs[i].height(imageObj.size.y, 1));
    }
    return obj;
  };

  const loadImageDescriptionBox = () => {
    const obj = [];
    for (let i = 0; i < imageDescriptionBoxRefs.length; i++) {
      const textObj = imageDescriptionTextBoxRefs[i].getState();
      // console.log(textObj);
      obj.push(imageDescriptionBoxRefs[i].opacity(100, 2));
      obj.push(imageDescriptionTextBoxRefs[i].text("...", 0));
      obj.push(imageDescriptionTextBoxRefs[i].opacity(100, 3));
      obj.push(imageDescriptionTextBoxRefs[i].text(textObj.text, 1));
    }

    return obj;
  };

  const swapImage = (newImageObject: ImageObject, imgRef: Reference<Img>) => {
    return imgRef().src(newImageObject.src);
  };

  function* animateSingleImage() {
    for (let i = 0; i < allImages.length; i++) {
      const imgData = allImages[i];

      yield* initializeState();

      // Image detections
      for (let j = 0; j < imgData.imageDetections.length; j++) {
        const curImgDetection = imgData.imageDetections[j];
        const boundingBoxRef = imageBoundingBoxRefs[j];
        const descriptionTextRef = imageDescriptionTextBoxRefs[j];
        const descriptionBoxRef = imageDescriptionBoxRefs[j];
        const detectionContainerRef = imageDetectionContainerRefs[j];
        yield* swapImage(imgData, bgImgRef);
        yield* all(
          detectionContainerRef.position([curImgDetection.x, curImgDetection.y], 0),
          detectionContainerRef.minWidth(curImgDetection.width, 0)
        );
        yield* all(boundingBoxRef.opacity(100, 0.5), boundingBoxRef.height(curImgDetection.height, 0.7));
        yield* all(descriptionBoxRef.opacity(100, 0.5), descriptionTextRef.text(curImgDetection.description, 1));
      }
      // Text detections
      for (let j = 0; j < imgData.textDetections.length; j++) {
        const curImgDetection = imgData.textDetections[j];
        const boundingBoxRef = textBoundingBoxRefs[j];
        const descriptionTextRef = textDescriptionTextBoxRefs[j];
        const descriptionBoxRef = textDescriptionBoxRefs[j];
        const detectionContainerRef = textDetectionContainerRefs[j];
        yield* swapImage(imgData, bgImgRef);
        yield* all(
          detectionContainerRef.position([curImgDetection.x, curImgDetection.y], 0),
          detectionContainerRef.minWidth(curImgDetection.width, 0)
        );
        yield* all(boundingBoxRef.opacity(100, 0.5), boundingBoxRef.height(curImgDetection.height, 0.7));
        yield* all(descriptionBoxRef.opacity(100, 0.5), descriptionTextRef.text(curImgDetection.text, 1));
      }
      yield* waitFor(2);
    }
  }

  // for (let i = 0; i < imageDescriptionBoxRefs.length; i++) {
  //   // Refs
  //   const boundingBoxRef = imageBoundingBoxRefs[i];
  //   const descriptionTextRef = imageDescriptionTextBoxRefs[i];
  //   const descriptionBoxRef = imageDescriptionBoxRefs[i];

  //   // Initial states
  //   const boundingBoxState = boundingBoxRef.getState();
  //   const descriptionTextState = descriptionTextRef.getState();
  //   const descriptionBoxState = descriptionBoxRef.getState();

  //   const description = imgNewspaper.imageDetections[i].description;

  //   yield* all(boundingBoxRef.opacity(100, 0.5), boundingBoxRef.height(200, 0.7));
  //   yield* all(descriptionBoxRef.opacity(100, 0.5), descriptionTextRef.text(description, 1));
  // }
  yield* animateSingleImage();
  // yield* swapImage(imgBacklitAngel, bgImgRef);
  // yield* waitFor(4);
});
