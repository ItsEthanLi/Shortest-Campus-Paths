/** Represents a location on the map. */
export type Location = {x: number, y: number};


/** Information about a building on campus. */
export type Building = {shortName: string, longName: string, location: Location};


/** A straight-line walkway between two points on the campus map. */
export type Edge = {start: Location, end: Location};