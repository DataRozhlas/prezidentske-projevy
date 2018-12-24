import { h, Component } from "preact";
import { speechMeta } from "./speechMeta";
/** @jsx h */

export class SpeechSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }

  render() {
    const { speechID } = this.props;
    return (
      <fieldset>
        <select onChange={this.handleChange} value={speechID}>
          {speechMeta.speechList.map(el => <option value={el}>{el.replace("-", " – ")}</option>)}
        </select>
      </fieldset>
    );
  }
}

export default { SpeechSelect };
