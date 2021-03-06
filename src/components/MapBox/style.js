/* eslint-disable */
import { RENDER_STATE } from 'react-map-gl-draw';
const MAX_ZOOM_LEVEL = 19;

export const poiPolyStyle = {
  id: 'poiPoly',
  type: 'fill',
  'paint': {
    'fill-color': '#fff', // blue color fill
    'fill-opacity': 0.3
  },
};

export const poiPolyBorderStyle = {
  id: 'poiPolyBorder',
  type: 'line',
  'paint': {
    'line-color': '#EB5757',
    'line-width': 2
  },
};

export const poiPolySelectedStyle = {
  id: 'poiPolySelected',
  type: 'fill',
  'paint': {
    'fill-color': '#fff',
    'fill-opacity': 0.6
  },
};

export const poiPolyBorderSelectedStyle = {
  id: 'poiPolyBorderSelected',
  type: 'line',
  'paint': {
    'line-color': '#2e7d32',
    'line-width': 3
  }
};

export const poiStyle = {
  id: 'poi',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 5,
    'circle-color': '#EB5757',
    'circle-opacity': 1,
  },
};
export const poiBorderStyle = {
  id: 'poiBorder',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 10,
    'circle-color': '#fff',
    'circle-opacity': 0.7,
  },
};

export const poiClusterStyle = {
  id: 'poiCluster',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 14,
    'circle-color': '#fff',
    'circle-opacity': 1,
  },
};

export const poiBorderClusterStyle = {
  id: 'poiBorderCluster',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 20,
    'circle-color': '#fff',
    'circle-opacity': 0.7,
  },
};

export const clusterText = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 14,
  },
  paint: {
    'text-color': '#EB5757',
  },
};

export function getEditHandleStyle({ feature, state }) {
  switch (state) {
  case RENDER_STATE.SELECTED:
  case RENDER_STATE.HOVERED:
  case RENDER_STATE.UNCOMMITTED:
    return {
      fill: 'rgb(251, 176, 59)',
      fillOpacity: 1,
      stroke: 'rgb(255, 255, 255)',
      strokeWidth: 2,
      r: 7,
    };

  default:
    return {
      fill: 'rgb(251, 176, 59)',
      fillOpacity: 1,
      stroke: 'rgb(255, 255, 255)',
      strokeWidth: 2,
      r: 5,
    };
  }
}

export function getFeatureStyle({ feature, index, state }) {
  switch (state) {
  case RENDER_STATE.SELECTED:
  case RENDER_STATE.HOVERED:
  case RENDER_STATE.UNCOMMITTED:
  case RENDER_STATE.CLOSING:
    return {
      stroke: 'rgb(251, 176, 59)',
      strokeWidth: 2,
      fill: 'rgb(251, 176, 59)',
      fillOpacity: 0.3,
      strokeDasharray: '4,2',
    };

  default:
    return {
      stroke: 'rgb(60, 178, 208)',
      strokeWidth: 2,
      fill: 'rgb(60, 178, 208)',
      fillOpacity: 0.1,
    };
  }
}

export const heatmapLayer = {
  minzoom: 10,
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.1, MAX_ZOOM_LEVEL, 1],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      0.9,
      'rgb(238,85,35)',
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 1, 13, 10, 13, 60],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.3, MAX_ZOOM_LEVEL, 0.9]
  }
};
