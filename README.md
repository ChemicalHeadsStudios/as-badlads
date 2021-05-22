# as-badlads
![GitHub](https://img.shields.io/github/license/chemicalheadsstudios/as-badlads)
[![npm version](https://badge.fury.io/js/%40chemicalheads%2Fas-badlads.svg)](https://badge.fury.io/js/%40chemicalheads%2Fas-badlads)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/chemicalheadsstudios/as-badlads/dev/assemblyscript)
[![Discord](https://img.shields.io/discord/597143319314694144.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/hqZVQmm)
===
BadLads server plugin host API implementation in AssemblyScript. Proper documentation coming soon! 

## What is `as-badlads`?
> `as-badlads` is a BadLads WebAssembly host implementation, used for BadLads server plugins. The `as` prefix stands for [AssemblyScript](assemblyscript.org/), which is what the API is written in.

## What isn't `as-badlads`?
> `as-badlads` is not Javascript! There is no Javascript here. 

## Prerequisites
> [Node](https://nodejs.org/en/). While we don't use Javascript in any way whatsoever, we require the npm package manager which is bundled with node.

## Example plugins:
* https://github.com/ChemicalHeadsStudios/as-badlads-template

## Creating a BadLads plugin from scratch with `as-badlads`
1. Find your BadLads plugins folder, named `BadLadsPlugins`, under Windows clients it'll be located under `C:\Users\yourusername\AppData\Local\BadLads\Saved` or `YourServerDirectory\BadLads\Saved\`. 
2. Create a new directory in `BadLadsPlugins`, this will be the root directory of your plugin. Go inside your new plugin directory.
3. Create a **workspace** with `npm init`
4. Install **AssemblyScript** with: `npm install --save-dev assemblyscript`
5. Install the **BadLads API** with `npm install @chemicalheads/as-badlads`
6. Setup your AssemblyScript workspace with `npx asinit .`
7. Create a `plugin.json` file. **Must be all lowercase!** Here's a [template.](https://gist.githubusercontent.com/MarkJGx/a67a1b400aa998086e08d9acf17c12ef/raw/35e5d2475ff153b3e7db31783be5b42c28fe6cb1/plugin.json)
8. Add `exportRuntime: true` to the `release` and `debug` targets in `asconfig.json`. That might sound confusing, so here's a [copyable example.](https://gist.githubusercontent.com/MarkJGx/f0e8f0aa12aef48f1dfb74a8dce34472/raw/3e8fca7853f8a65a00eedb92a7acc641e7503247/asconfig.json).
9. You are done with the setup process. Congrats. Let's move on to the fun part!
10. Open your favorite TypeScript compatible IDE (mine being [VSCode](https://code.visualstudio.com/)), and add the plugin directory as a workspace/folder/whatever.
11. Open up the `assembly/index.ts` file and start cracking. [Here's an example `index.ts`](https://gist.githubusercontent.com/MarkJGx/b13603d892ba6dfc3d372745f7092082/raw/ba378e511ab4bdb09f49f8db94a782f24197e7f2/index.ts). 
> If you want to explore the plugin API's functionality, middle click on one of the imports at the top. That will take you the plugin definitions, filled with documentation and goodies. Make sure to scroll down to skip the rough stuff.
13. Compile, run `npm run asbuild`. You can open the Sandbox mode in BadLads and start working, by default the game has hot reload enabled.
> If you want to check for new plugins while the game is open, run the `/reloadplugins` command in chat. The game will tell you when you have hot reloaded, or if you have any weird errors.

## Listening for events. Check out the top in the `as-badlads/assembly/badlads.ts` file for all the available event functions. 
```typescript
// BadLads searches for matching functions on plugin load, when listening for a specific event your function event has to match it's name/param types/return types.
export function onPluginStop(pluginId: i32): void {} 
```

## Decoding string buffers. Certain event functions have an ArrayBuffer as a param, most of the time that's a string buffer. You can convert an ArrayBuffer to a string with.
```typescript
const myString: string = decodeString(stringBuffer);
```

## What are the `__host` functions?
`__host` are linked with the the BadLads API. They aren't very convenient to work with, that's why there's a wrapper for almost each one. If you know what you are doing, go ahead and touch them.
