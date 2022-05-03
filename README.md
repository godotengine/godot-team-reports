# Godot Team Reports

This project is provided for Godot engine contributors to monitor stale and old PRs
and help clean up the review backlog. PRs are grouped by the teams assigned to review
them, so that maintainers have a good overview of their area of the engine.

Live website: https://godotengine.github.io/godot-team-reports/

## Contributing

This project is written in JavaScript and built using Node.JS. HTML and CSS are used
for presentation. The end result of the build process is completely static and can
be server from any webserver, no Node.JS required.

Front-end is designed in a reactive manner using industry standard Web Components
(powered by `lit-element`). This provides native browser support, and results in a
small overhead from the build process.

To build the project locally you need to have Node.JS installed (12.x and newer
should work just fine).

1. Clone or download the project.
2. From the project root run `npm install` or `yarn` to install dependencies.
3. Run `npm run build` or `yarn run build` to build the pages.
4. Run `npm run compose-db` or `yarn run compose-db` to fetch the data from GitHub.
5. Serve the `out/` folder with your method of choice (e.g. using Python 3:
   `python -m http.server 8080 -d ./out`).

`rollup` is used for browser packing of scripts and copying of static assets. The
data fetching script is plain JavaScript with `node-fetch` used to polyfill
`fetch()`-like API.

## License

This project is provided under the [MIT License](LICENSE.md).
