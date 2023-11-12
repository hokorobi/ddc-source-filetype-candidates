import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddc_vim@v4.1.0/types.ts";
import {
  Denops,
  vars,
} from "https://deno.land/x/ddc_vim@v4.1.0/deps.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  _cache: Item[] = [];

  override async onInit(args: {
    denops: Denops,
  }): Promise<void> {
    const filetype = await vars.options.get(args.denops, "filetype") as string;
    const candidatesfile = await vars.g.get(args.denops, "ddc_source_filetype_list") as string{};
    console.log(candidatesfile);
    const data = Deno.readFileSync(new URL(candidatesfile[filetype], import.meta.url));
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