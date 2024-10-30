/** Represents a location on the map. */
import {isRecord} from './record'

export type Location = {x: number, y: number};


/** Information about a building on campus. */
export type Building = {shortName: string, longName: string, location: Location};


/** A straight-line walkway between two points on the campus map. */
export type Edge = {start: Location, end: Location};

export const getSteps = (data: unknown) => {
   
    if(!Array.isArray(data)) {
        throw new Error(`steps is not an array${typeof data}`);
    }
    const arr = [];
    for(let i = 0; i < data.length; i++) {
        if(!isRecord(data[i])) {
            throw new Error(`data isn't a record${data}`)
        }
        arr.push({start: getLoc(data[i].start), end: getLoc(data[i].end)});
    }
    return arr;
}

export const getLoc = (data: unknown) => {
    if(!isRecord(data)) {
        throw new Error(`data is not a record${data}`)
    }
    if(typeof data.x !== "number") {
        throw new Error(`x is not a number ${data}`)
    }
    if(typeof data.y !== "number") {
        throw new Error(`y is not a number ${data}`)
    }
    return {x: data.x, y: data.y}
}