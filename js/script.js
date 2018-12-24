import "./targetblank"; // pro otvírání odkazů v novém okně
import { h, render, Component } from "preact";
import { SpeechText } from "./SpeechText";
/** @jsx h */

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2018,
    };
  }

  render() {
    const { year } = this.state;
    return (
      <div>
        <SpeechText year={year} />
      </div>
    );
  }
}
// ========================================

render(<Calendar />, document.getElementById("projevyapp"));
