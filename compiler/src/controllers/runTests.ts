import fs from "fs"
import { setDefaultHighWaterMark } from "stream";


export function runTests(output: string,
  expectedOutput: string,
  linesPerTest: number): {
    verdict: string,
    testsPassed: number,
  } {
  console.log("testing:" , output, " ", expectedOutput);
  if (output.length != expectedOutput.length)
    return {
      verdict: "Runtime Error",
      testsPassed: -1,
    }

  const n: number = output.length;
  let lines: number = 0;
  let fail: Boolean = false;
  let testsPassed: number = 0;

  for (let i = 0; i < n; i++) {
    if (expectedOutput[i] == '\n') lines += 1;
    if (lines % linesPerTest) if (!fail) testsPassed++;
    if (expectedOutput[i] != output[i]) fail = true;
  }
  return {
    verdict: (fail ? "Wrong Answer" : "Accepted"),
    testsPassed: testsPassed,
  }
}
