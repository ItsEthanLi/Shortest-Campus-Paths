import { Location, Edge} from './campus';
import {Heap} from './heap'


/**
 * A path from one location on the map to another by following along the given
 * steps in the order they appear in the array. Each edge must start at the
 * place where the previous edge ended. We also cache the total distance of the
 * edges in the path for faster access.
 */
export type Path =
    {start: Location, end: Location, steps: Array<Edge>, dist: number};

/**
 * Returns the shortest path from the given start to the given ending location
 * that can be made by following along the given edges. If no path exists, then
 * this will return undefined. (Note that all distances must be positive or else
 * shortestPath may not work!)
 */


export const shortestPath = (
    _start: Location, _end: Location, _edges: Array<Edge>): Path | undefined => {
      console.log("hi there");
      console.log("hi there #2");
      let adjacent = new Map<string, Array<Edge>>();
      const finished = new Set<Location>();
      let active = new Heap<Path>(compareTo)
      for(let j = 0; j < _edges.length; j++) {
          let currEdge = _edges[j]
          let start = currEdge.start.x + "," + currEdge.start.y;
          if(!adjacent.has(start)) {
              adjacent.set(start, [])
          }
          let curr = adjacent.get(start);
          if(curr  === undefined) {
            console.error('impossible')
          }
          else {
              curr.push(currEdge)
          } 
      }
      active.add({start: _start, end: _start, steps: [], dist: 0 })
      while(!active.isEmpty()) {
        if(_start.x === _end.x) {
          console.log("they are equal! there should be nothing");
        }
        let minPath = active.removeMin()
        if(minPath.end.x === _end.x && minPath.end.y === _end.y) {
          console.log("dijkstra line 60: returned minpath" + minPath.start.x + "," + minPath.start.y +" to "+ minPath.end.x + "," + minPath.end.y);
          console.log("dijkstra line 61: going from " + _start.x + ","+ _start.y + " to " + _end.x + "," + _end.y + "with " + minPath.dist + " dist");
          return minPath;
        }
        if(finished.has(minPath.end)) {
          continue;
        }
        finished.add(minPath.end)
        let end = minPath.end.x + "," + minPath.end.y;
        let arr = adjacent.get(end)
        if(arr !== undefined) {
          
          for(let i = 0; i < arr.length; i++) {
            const currEdge = arr[i]
            if(!finished.has(currEdge.end)) {
              let newPath: Path = {
                start: minPath.start,
                end: currEdge.end,
                steps: minPath.steps.concat([currEdge]),
                dist: minPath.dist + currEdge.dist, 
              };
              active.add(newPath);
            }
          }
            
        }
      }

  // TODO (Task 2): implement this
      console.log("returned undefined")
  return undefined;
};
const compareTo = (a: Path, b: Path): number => {
  return a.dist - b.dist;
}