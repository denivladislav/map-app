# map-app

[![CI](https://github.com/denivladislav/map-app/workflows/CI/badge.svg)](https://github.com/denivladislav/map-app/actions/workflows/CI.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/60ec0758287835c8b4a6/maintainability)](https://codeclimate.com/github/denivladislav/map-app/maintainability)

A mapboxgl app.

You may place markers and lines on this map.
In order to place a marker, click «Add marker» button and the click on the map. 
In order to place a line, click «Add line» button, then click on the map to place line starting point and then again to place line ending point.

![all](https://user-images.githubusercontent.com/71961494/202123917-b0d98399-2cdb-475a-b654-42ec377294b6.png)

You may hide and remove all markers or lines.

![markers_shown](https://user-images.githubusercontent.com/71961494/202121460-14901f67-8a74-42f2-9a02-4f0ebf3435a3.png)

![markers_hidden](https://user-images.githubusercontent.com/71961494/202121476-d56ebc1d-4604-45de-9d59-11ad0a265c77.png)

Each marker and line has a popup that contains the date of its creation.

![line_with_popup](https://user-images.githubusercontent.com/71961494/202120988-9c6eaa84-1b5e-4f94-8387-a75c2902cab4.png)

### Stack
- React with hooks, Typescript, mapboxgl, i18next, lodash
- husky, Prettier

### How To Use Locally:
```bash
# Install Dependencies.
$ make install

# Build Project.
$ make build

# Start Project.
$ make start

# Lint.
$ make lint
