import { Request, Response } from "express";
import { BUILDINGS } from './campus';
import {shortestPath} from './dijkstra'
import { EDGES} from './campus'


/** Returns a list of all known buildings. */
export const getBuildings = (_req: Request, res: Response): void => {
  res.send({buildings: BUILDINGS});
};

export const getShortestPath = (req: Request, res: Response): void => {
  
  if(typeof req.query.start !== "string" || typeof req.query.end !== "string") {
    console.error(`not type of string`)
    return;
  }
  
  const start = req.query.start;
  const end = req.query.end;
  
  let startLoc = {x: 0, y: 0};
  console.log("hi");
  let endLoc = {x: 0, y: 0};
  if(start === end) {
    res.send({start: start, end: start, steps: EDGES, dist:0})
  } else {
    for(let i = 0; i < BUILDINGS.length; i++) {
      if(BUILDINGS[i].shortName === start) {
        startLoc = BUILDINGS[i].location
        console.log("routes.ts line 22: start building name " + BUILDINGS[i].longName);       
      } else if(BUILDINGS[i].shortName == end) {
        console.log("routes.ts line 28: end building name " + BUILDINGS[i].longName);
        endLoc = BUILDINGS[i].location
      }
    }
    const path = shortestPath(startLoc, endLoc, EDGES)
    console.log("ROUTES.ts- here is the path: " + path);
    console.log("routes.ts: returned path " + startLoc.x + "," + startLoc.y +" to "+ endLoc.x + "," + endLoc.y);
    if (path === undefined) {
      res.status(404).send({ error: "No path found" });
    }
    
    res.send({path: path});
  }



}

// TODO (Task 3): add a route to get the shortest path


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
