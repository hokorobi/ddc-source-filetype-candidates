import {
  BaseSource,
  Denops,
  Item,
} from "jsr:@shougo/ddc-vim@~7.0.0/types";
import {
  toFileUrl,
} from "jsr:@std/path@~1.0.2/to-file-url";
import * as vars from "jsr:@denops/std@~7.1.0/variable";


type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  _cache: Item[] = [];

  override async onInit(args: {
    denops: Denops,
  }): Promise<void> {
    const candidatesfiles = await vars.g.get(args.denops, "ddc_source_filetype_candidates_files", {}) as {[name: string]: string};
    const filetype = await vars.options.get(args.denops, "filetype") as string;
    const data = Deno.readFileSync(new URL(toFileUrl(candidatesfiles[filetype]), import.meta.url));
    const lines = new TextDecoder().decode(data).split(/\r?\n/);
    this._cache = [...new Set(lines)]
      .filter((line) => line.length != 0)
      .filter((word) => !word.startsWith(";"))
      .map((word: string) => ({ word }));
  }

  override gather(): Promise<Item[]> {
    return Promise.resolve(this._cache);
  }

  override params(): Params {
    return {};
  }
}