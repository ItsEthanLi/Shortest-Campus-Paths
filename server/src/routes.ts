import { Request, Response } from "express";
import { BUILDINGS } from './campus';


/** Returns a list of all known buildings. */
export const getBuildings = (_req: Request, res: Response): void => {
  res.send({buildings: BUILDINGS});
};


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
