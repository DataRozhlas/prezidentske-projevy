import "./targetblank"; // pro otvírání odkazů v novém okně
import "promise-polyfill/src/polyfill";
import { h, render, Component } from "preact";
import { SpeechText } from "./SpeechText";
import { SpeechSelect } from "./SpeechSelect";
import { Player } from "./Player";
import { speechMeta } from "./speechMeta";
/** @jsx h */

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      speechID: speechMeta.speechList[speechMeta.speechList.length - 1],
    };
  }

  handleChange(speechID) {
    this.setState({ speechID });
  }

  render() {
    const { speechID } = this.state;
    return (
      <div>
        <Player speechID={speechID} />
        <SpeechSelect speechID={speechID} onChange={this.handleChange} />
        <SpeechText speechID={speechID} />
      </div>
    );
  }
}
// ========================================

render(<Calendar />, document.getElementById("projevy-app"));
