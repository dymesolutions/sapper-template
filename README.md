# sapper-template (with TypeScript and SASS)

This is an experimental fork of the the default [Sapper](https://github.com/sveltejs/sapper) template. It thrives to enable TypeScript and SASS (or scss) in your Svelte/Sapper components. At the time of writing the SASS integration is working quite nicely but you may encounter some bumps in the road with TypeScript.

# usage

```bash
npx degit dymesolutions/sapper-template my-sapper-ts-sass-app
cd my-sapper-ts-sass-app
npm install # or yarn!
npm run dev
```

Then browse to [localhost:3000](http://localhost:3000) and observe the remarks about Bootstrap SASS and TypeScript.

After that you'll probably want to have a look at [Banner.svelte](src/components/Banner/Banner.svelte), [Banner.ts](src/components/Banner/Banner.ts), and the script-tag in [Nav.html](src/components/Nav.html). If feeling particularly adventurous, have a look at [webpack.config.js](webpack.config.js) and [webpack.preprocessors.js](webpack.preprocessors.js).

The original Sapper template README is [here](SAPPER_TEMPLATE_README.md).

If using VS Code, you might want to consider installing the Svelte plugin by James Birtles.

# known issues

## ts files and hot reloading

Modifying TypeScript (.ts) files can sometimes mess up the devserver hot reloading (or the other way around). Errors appear in the console, and your changes won't show up. Hard refresh can be used to solve the immediate problem. We have yet to see how often this comes up in everyday development work and whether the devserver should/could be configured to do a hard refresh whenever a .ts file change to avoid this issue.
