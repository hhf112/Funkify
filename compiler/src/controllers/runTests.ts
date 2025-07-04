import fs from "fs"
import { setDefaultHighWaterMark } from "stream";


export function runTests(output: string,
  expectedOutput: string,
  linesPerTest: number): {
    verdict: string,
    testsPassed: number,
  } {
  if (output.length != expectedOutput.length) {
    return {
      verdict: "Runtime Error",
      testsPassed: -1,
    }
  }

  const n: number = output.length;
  let lines: number = 0;
  let fail: boolean = false;
  let testsPassed: number = 0;

  for (let i = 0; i < n; i++) {
    if (expectedOutput[i] != output[i]) fail = true;
    if (output[i] === '\n') {
      lines++;
      if (lines % linesPerTest == 0) {
        if (fail) break;
        testsPassed++;
      }
    }
    // console.log("\n\nno, of lines seen: ", lines, "\ndid it fail?: ", fail, "\nLines per test: ", linesPerTest, "\nnumber of tests passed: ", testsPassed);
  }

  return {
    verdict: (fail ? "Wrong Answer" : "Accepted"),
    testsPassed: testsPassed,
  }
}
