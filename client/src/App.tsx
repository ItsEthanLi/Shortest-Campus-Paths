import React, { Component } from 'react';
import { Building, Edge } from './buildings';
import { Editor } from './Editor';
import campusMap from './img/campus_map.jpg';


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

    this.state = {};
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
    } else {
      console.log('show no path');
    }
  };
}