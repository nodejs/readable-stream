import {walkSync} from "fs";
import {fromFileUrl} from "path";

const dir = walkSync(fromFileUrl(new URL("./deno", import.meta.url)), {
  includeDirs: false,
});

for (const file of dir) {
  const process = Deno.run({
    cmd: [
      "deno",
      "run",
      "-A",
      "--unstable",
      "--import-map=import-map.json",
      file.path,
    ],
    stderr: "piped",
    stdout: "piped",
  });
  
  const {code} = await process.status();

  if(code !== 0){
    const rawError = await process.stderrOutput();
    const errorString = new TextDecoder().decode(rawError);
    console.log(errorString);

    Deno.exit(code);
  }
}