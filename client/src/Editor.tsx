//import React, { Component } from 'react';
import { Building } from './buildings';
import React, { Component, ChangeEvent, MouseEvent} from 'react';


type EditorProps = {
  /** Names of all the buildings that are available to choose. */
  buildings: Array<Building>;

  /** Called to note that the selection has changed. */
  onEndPointChange: (endPoints?: [Building, Building] | undefined) => void;
};

type EditorState = {
  // TODO: decide on the state to store
  pathStart: Building
  pathEnd: Building,
};


/** Component that allows the user to edit a marker. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {pathStart: {shortName: "", longName: "", location: {x: 0, y: 0}}, pathEnd: {shortName: "", longName: "", location: {x: 0, y: 0}}};
  }

  render = (): JSX.Element => {
    // TODO: fill this in
    const buildingOptions = [];
    buildingOptions.push(<option key={"stay"}>(Choose a Building)</option>)
    for(let i = 0; i < this.props.buildings.length; i++) {
      buildingOptions.push(<option key = {i}>{this.props.buildings[i].longName}</option>)

    }
    return <div>
      
      From:
      <select onChange={this.doStartBuildingClick}>
        {buildingOptions}
      </select>
      To:
      <select onChange={this.doEndBuildingClick}>
        {buildingOptions}
      </select>
      <button onClick={this.doClearClick}>Clear</button>

    </div>;
  };

  doStartBuildingClick = (evt: ChangeEvent<HTMLSelectElement>) => {
    let name = evt.target.value;
      if(name !== "(Choose a Building)") {
        let bldg = {shortName: "", longName: "", location: {x: 0, y: 0}}
        for(let i = 0; i < this.props.buildings.length; i++) {
          let curr = this.props.buildings[i];
          if(name.toLowerCase() === curr.longName.toLowerCase()) {
            bldg.shortName = curr.shortName;
            bldg.longName = curr.longName;
            bldg.location = curr.location;
            break;
          }
        }
        this.setState({ pathStart: bldg }, () => {
          if (this.state.pathEnd.shortName !== "") {
              this.props.onEndPointChange([this.state.pathStart, this.state.pathEnd]);
          }
        });
    } else {
      this.props.onEndPointChange(undefined)
    }
  }

  doEndBuildingClick = (evt: ChangeEvent<HTMLSelectElement>) => {
    let name = evt.target.value;
    if(name !== "(Choose a Building)") {
      let bldg = {shortName: "", longName: "", location: {x: 0, y: 0}}
      for(let i = 0; i < this.props.buildings.length; i++) {
        let curr = this.props.buildings[i];
        if(name.toLowerCase() === curr.longName.toLowerCase()) {
          bldg.shortName = curr.shortName;
          bldg.longName = curr.longName;
          bldg.location = curr.location;
          break;
        }
      }
      this.setState({ pathEnd: bldg }, () => {
        if (this.state.pathStart.shortName !== "" ) {
            this.props.onEndPointChange([this.state.pathStart, this.state.pathEnd]);
        }
      });
    } else {
      this.props.onEndPointChange(undefined)
    }    
  }

  doClearClick = (_evt: MouseEvent<HTMLButtonElement>) => {
    this.setState({pathStart: {shortName: "", longName: "", location: {x: 0, y: 0}}, pathEnd: {shortName: "", longName: "", location: {x: 0, y: 0}}})
    this.props.onEndPointChange(undefined)
  }

}