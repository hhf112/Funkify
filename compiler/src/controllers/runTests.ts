import fs from "fs"
import { setDefaultHighWaterMark } from "stream";


export function runTests(output: string,
  expectedOutput: string,
  linesPerTest: number): string {
  let verdict: string;
  if (output.length != expectedOutput.length)
    return "Runtime Error";

  const n: number = output.length;
  let lines: number = 0;
  let fail: Boolean = false;
  let testsPassed: number = 0;

  for (let i = 0; i < n; i++) {
    if (expectedOutput[i] == '\n') lines += 1;
    if (lines % linesPerTest) if (!fail) testsPassed++;
    if (expectedOutput[i] != output[i]) fail = true;
  }
  return (fail ? "Wrong Answer" : "Accepted");
}
