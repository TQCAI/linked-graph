import { getRandomNumber } from "src/helpers/random";
import {
  GraphObject,
  GraphConnection,
  GraphModel
} from "src/services/graph-model";
import { getAmsterdamMetroGraphData } from "./sample-data-amsterdam-metro";
import { getCircleGraphData } from "./sample-data-circle";
import { getDefaultGraphData } from "./sample-default-graph";

export interface GraphSample {
  name: string;
  getGraph(): GraphModel;
}

function getRandomCoordinates() {
  return {
    x: getRandomNumber(10, 590),
    y: getRandomNumber(10, 590)
  };
}

function buildGraphFromData(points: string[], links: string[]) {
  const objects = points.map(s => {
    const object: GraphObject = {
      id: s,
      ...getRandomCoordinates()
    };
    return object;
  });

  const connections = links.map(r => {
    const pair = r.split(":");
    const source = objects.find(x => x.id === pair[0]);
    const target = objects.find(x => x.id === pair[1]);
    if (!source) {
      throw new Error("Source is not found for relation: " + r);
    }
    if (!target) {
      throw new Error("Target is not found for relation: " + r);
    }
    const connection: GraphConnection = {
      source,
      target
    };
    return connection;
  });

  return { objects, connections };
}

export function getSamples(): GraphSample[] {
  return [
    {
      name: "Default graph",
      getGraph: () => {
        const data = getDefaultGraphData();
        return buildGraphFromData(data.points, data.links);
      }
    },
    {
      name: "Circle graph",
      getGraph: () => {
        const data = getCircleGraphData();
        return buildGraphFromData(data.points, data.links);
      }
    },
    {
      name: "Amsterdam metro",
      getGraph: () => {
        const data = getAmsterdamMetroGraphData();
        return buildGraphFromData(data.points, data.links);
      }
    }
  ];
}
