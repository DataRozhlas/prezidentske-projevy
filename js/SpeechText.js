import { h, Component } from "preact";
import { speechMeta } from "./speechMeta";
/** @jsx h */

function xhrSpeech(name) {
  return new Promise(((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://data.irozhlas.cz/prezidentske-projevy/data/${name}`);
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.send();
  }));
}

async function getSpeech(name) {
  let speech = await xhrSpeech(name);
  speech = speech.replace(/<span data(.*?)<\/span/g, "<a href='#' data$1</a");

  return speech.split("\n").filter(paragraph => paragraph.length > 0);
}

export class SpeechText extends Component {
  constructor(props) {
    super(props);
    this.state = { blurb: "", content: [], header: "" };
  }

  componentDidMount() {
    const { speechID } = this.props;
    getSpeech(`${speechID}.txt`)
      .then(text => this.setState({
        blurb: text[0],
        content: text.slice(1),
        header: this.generateHeaderText(),
      }));
  }

  componentDidUpdate(prevProps) {
    const { speechID } = this.props;
    if (speechID !== prevProps.speechID) {
      getSpeech(`${speechID}.txt`)
        .then(text => this.setState({
          blurb: text[0],
          content: text.slice(1),
          header: this.generateHeaderText(),
        }));
    }
  }

  generateHeaderText() {
    const { speechID } = this.props;
    const year = speechID.split("-")[0];
    const { name } = speechMeta.presidents[speechID.split("-")[1]];
    return `${year}: ${name}`;
  }

  render() {
    const { blurb, content, header } = this.state;
    return (
      <div className="speech">
        <h1 className="speech-header">
          {header}
        </h1>
        <div className="speech-blurb">
          {blurb}
        </div>
        <div className="speech-content">
          {content.map(paragraph => (
            // eslint-disable-next-line react/no-danger
            <p className="speech-paragraph" dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
    );
  }
}

export default { SpeechText };
