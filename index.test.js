import tape from "@observablehq/tape";
import acorn from "acorn";
import {readdirSync, readFileSync, writeFileSync} from "fs";
import {basename, extname, join} from "path";
import observable from "./index";

observable(acorn);

const options = {
  plugins: {
    observable: true
  }
};

readdirSync(join("test", "input")).forEach(file => {
  tape(`parse(${file})`, test => {
    const infile = join("test", "input", file);
    const outfile = join("test", "output", basename(file, extname(file)) + ".json");
    const actual = acorn.parse(readFileSync(infile, "utf8"), options);
    try {
      const expected = JSON.parse(readFileSync(outfile, "utf8"));
      test.deepEqual(actual, expected);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`generating ${outfile}`);
        writeFileSync(outfile, JSON.stringify(actual, null, 2), "utf8");
      }
    }
  });
});
