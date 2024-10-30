import React, { Component } from 'react';
import { Building, Edge, getSteps } from './buildings';
import { Editor } from './Editor';
import campusMap from './img/campus_map.jpg';
import {isRecord} from './record'
//note: add the function from https://docs.google.com/document/d/1haGCPx7Wk5c63LUoTSfCu5Jnf2se-gSrl2VxCClPDl8/edit?tab=t.0 into buildings.ts 
//to make program work! I hit the 8 hr debug mark but in case you want to see if my code actually works that must be implemented into buildings.ts


// Radius of the circles drawn for each marker.
const RADIUS: number = 30;


type AppProps = {};  // no props

type AppState = {
  buildings?: Array<Building>;       // list of known buildings
  endPoints?: [Building, Building];  // end for path
  path?: Array<Edge>;                // shortest path between end points
};


/** Top-level component that displays the entire UI. */
export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state={};
  }

  componentDidMount = (): void => {
    fetch('/api/buildings')
      .then((res) => {
        if (res.status !== 200) {
          res.text().then((msg) => console.error(res.status, msg));
        } else {
          res.json().then((data) => {
            const buildings = data.buildings;  // unchecked type cast!
            this.setState({buildings});
          });
        }
      });
  }

  render = (): JSX.Element => {
    if (!this.state.buildings) {
      return <p>Loading building information...</p>;
    } else {
      return <div>
          <svg id="svg" width="866" height="593" viewBox="0 0 4330 2964">
            <image href={campusMap} width="4330" height="2964"/>
            {this.renderPath()}
            {this.renderEndPoints()}
          </svg>
          <Editor buildings={this.state.buildings}
              onEndPointChange={this.doEndPointChange}/>
        </div>;
    }
  };

  /** Returns SVG elements for the two end points. */
  renderEndPoints = (): Array<JSX.Element> => {
    if (!this.state.endPoints) {
      return [];
    } else {
      const [start, end] = this.state.endPoints;
      return [
          <circle cx={start.location.x} cy={start.location.y} fill={'red'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'start'}/>,
          <circle cx={end.location.x} cy={end.location.y} fill={'blue'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'end'}/>
        ];
    }
  };

  /** Returns SVG elements for the edges on the path. */
  renderPath = (): Array<JSX.Element> => {
    if (!this.state.path) {
      return [];
    } else {
      const elems: Array<JSX.Element> = [];
      for (let i = 0; i < this.state.path.length; i++) {
        const e = this.state.path[i];
        elems.push(<line x1={e.start.x} y1={e.start.y} key={i}
            x2={e.end.x} y2={e.end.y} stroke={'green'} strokeWidth={10}/>)
      }
      return elems;
    }
  };

  doEndPointChange = (endPoints?: [Building, Building]): void => {
    this.setState({endPoints, path: undefined});
    if (endPoints) {
      const [start, end] = endPoints;
      console.log(`show path from ${start.shortName} to ${end.shortName}`);
      // TODO (Task 4): fetch the shortest path and parse the response
      fetch("/api/shortestPath?" + 
         "start="+encodeURIComponent(start.shortName) + "&end="+encodeURIComponent(end.shortName))
      .then(this.doPathResp).catch(this.doPathError)
    } else {
      console.log('show no path');
    }
  };

  doPathResp = (res: Response):void => {
    //check for errors
    if(res.status === 200) {
      const  p = res.json()
      p.then(this.doPathJson).catch(()=>this.doPathError("200 response not valid JSON"))
    } else if(res.status === 400) {
      res.text().then(this.doPathError).catch(()=>this.doPathError("400 response is not text"))
    } else {
      this.doPathError(`bad status code ${res.status}`)
    }
  }

  doPathJson = (data: unknown): void => {
    if(!isRecord(data)) {

      this.doPathError(`bad type for data: ${typeof data}`)
      return;
    } 
    
    const path = data.path;
    if(path === undefined || path === null) {
      this.doPathError(`data is undefined`)
      return;
    } 
    if(!isRecord(path)) {
      this.doPathError(`path is not a record`)
      return;
    }
    if(!isRecord(path.end)) {
      this.doPathError(`path.end is not a record`)
      return;
    }
    if(!isRecord(path.start)) {
      this.doPathError(`path.start is not a record`)
      return;
    }
    if(typeof path.start.x !=="number" || typeof path.end.y !== "number") {
      this.doPathError(`end x and y aren't numbers${typeof path.end.x + "," + typeof path.end.y}`);
    }
    if(typeof path.end.x !=="number" || typeof path.end.y !== "number") {
      this.doPathError(`end x and y aren't numbers${typeof path.end.x + "," + typeof path.end.y}`);
    }
    if(!Array.isArray(path.steps)) {
      this.doPathError(`path.steps isn't an array ${typeof path.steps}`)
    }
    if(typeof path.dist !== "number") {
      this.doPathError(`dist is not type number${typeof path.dist}`);
    }
    if(isRecord(path)) {
      this.setState({path: getSteps(path.steps)})
    } 
  }

  doPathError = (msg: string): void => {
    //console.error('Error fetching /api/my-route: ${msg}');
    console.error(`Error fetching /api/shortestPath: ${msg}`);
    
  };

  
    
  
}