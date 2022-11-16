# map-app

[![CI](https://github.com/denivladislav/map-app/workflows/CI/badge.svg)](https://github.com/denivladislav/map-app/actions/workflows/CI.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/60ec0758287835c8b4a6/maintainability)](https://codeclimate.com/github/denivladislav/map-app/maintainability)

A mapboxgl app.

You may place markers and lines on this map.
In order to place a marker, click «Add marker» button and the click on the map. 

In order to place a line, click «Add line» button, then click on the map to place line starting point and then again to place line ending point.

You may hide and remove all markers or lines.

Each marker and line has a popup that contains the date of its creation.

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
