import { makeScene2D, Img, Layout, Txt, Rect, Node } from "@motion-canvas/2d";
import { waitFor } from "@motion-canvas/core";
import image1 from "../../images/v1/IMG_3763.png";
import image2 from "../../images/v1/IMG_3765.png";
import image3 from "../../images/v1/IMG_4181.png";
import image4 from "../../images/v1/IMG_7459.png";
import image5 from "../../images/v1/IMG_7459.png";
import image6 from "../../images/v1/IMG_7472.png";
import image7 from "../../images/v1/IMG_8897.png";

const PINK = "#EF33FF";
const PINK_20 = "rgba(239, 51, 255, 0.10)";
const LIME = "#DBFF00";
const LIME_20 = "rgba(219, 255, 0, 0.2)";
const CYAN = "#00E0FF";

const FONT_FAMILY = "'IBM Plex Mono', monospace";

const imagesObject = [
  {
    src: image1,
    textDetections: [{ text: "Elegant hands", x: 0, y: 0, width: 100, height: 100 }],
    imageDetections: [{ description: "Hello", x: 0, y: 0, width: 100, height: 100 }],
    sceneDetections: [{ description: "Ethereal ambiance", x: 0, y: 0, width: 100, height: 100 }],
  },
];

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
  imageDetections: [{ description: "Backlit angel", x: -100, y: 40, width: 200, height: 200 }],
  sceneDetections: [{ description: "Ethereal ambiance" }, { description: "Are we about to make out rn?" }],
};

const imgNewspaper: ImageObject = {
  src: image4,
  textDetections: [{ text: "!@8#*(*@32°?", x: -250, y: -100, width: 500, height: 400 }],
  imageDetections: [{ description: "Tear", x: -700, y: 40, width: 200, height: 200 }],
  sceneDetections: [{ description: "Analog nature" }, { description: "I can't read Chinese" }],
};

export default makeScene2D(function* (view) {
  const { src, textDetections, imageDetections, sceneDetections } = imgNewspaper;
  const numTextDetections = textDetections.length;
  const numImageDetections = imageDetections.length;
  const numSceneDetections = sceneDetections.length;
  view.add(
    <Rect offset={[-1, -1]} x={0} y={0}>
      <Img src={src} scale={0.5} />
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
        {imageDetections.map((detection) => {
          const { description, x, y, width, height } = detection;
          return (
            <Layout layout direction={"column"} x={x} y={y} offset={[-1, -1]}>
              <Rect fill={PINK} x={0} y={0} layout padding={[30, 30, 20, 30]}>
                <Txt text={description} fill={"#FFFFFF"} fontSize={30} fontFamily={FONT_FAMILY} />
              </Rect>
              <Rect width={width} height={height} fill={PINK_20} stroke={PINK} lineWidth={4}></Rect>
            </Layout>
          );
        })}
      </Rect>
      {/* IMAGE DETECT BOXES */}
      <Rect>
        {textDetections.map((detection) => {
          const { text, x, y, width, height } = detection;
          return (
            <Layout layout direction={"column"} x={x} y={y} offset={[-1, -1]}>
              <Rect fill={LIME} x={0} y={0} layout padding={[30, 30, 20, 30]}>
                <Txt text={text} fill={"#000000"} fontSize={30} fontFamily={FONT_FAMILY} />
              </Rect>
              <Rect width={width} height={height} fill={LIME_20} stroke={LIME} lineWidth={4}></Rect>
            </Layout>
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

  yield* waitFor(5);
});
