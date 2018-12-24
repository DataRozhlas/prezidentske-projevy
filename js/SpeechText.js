import { h, Component } from "preact";
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
    this.state = { blurb: "", content: [] };
  }

  componentDidMount() {
    const { year } = this.props;
    getSpeech(`${year}-Zeman.txt`)
      .then(text => this.setState({ blurb: text[0], content: text.slice(1) }));
  }

  render() {
    const { blurb, content } = this.state;
    return (
      <div className="speech">
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
