import { generateInnerQML } from "./packages/qml/dist/qml-component.js";
import fs from "fs";

const qml = fs.readFileSync("examples/bridge-test/src/App.qml.ts", "utf8");
// We need to simulate what generateQMLSource does, but for now just pass the raw QML string
// Actually App.qml.ts is a TS file, we need to extract the QML string
const match = qml.match(/qml:\s*`([\s\S]*?)`/);
if (match) {
  console.log("Found QML");
  const result = generateInnerQML(match[1]);
  console.log("---INNER QML---");
  console.log(result.innerQML);
} else {
  console.log("No match");
}
