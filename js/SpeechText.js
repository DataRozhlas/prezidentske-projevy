import { h, Component } from "preact";
import { speechMeta } from "./speechMeta";
import { partialPlay, PlayerButton } from "./Player";
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
  const speech = await xhrSpeech(name);
  return speech.split("\n").filter(paragraph => paragraph.length > 0);
}

function processParagraph(paragraph) {
  // IE polyfill
  if (!String.prototype.startsWith) {
    // eslint-disable-next-line no-extend-native
    String.prototype.startsWith = function Polyfill(searchString, position) {
      const newPosition = position || 0;
      return this.indexOf(searchString, position) === newPosition;
    };
  }

  const paragraphArray = [];
  let isNextSpan = 0;
  let start;
  let end;
  paragraph
    .split(/(<span.+?>|<\/span>)+/g)
    .filter(snippet => snippet.trim().length > 0)
    .forEach((snippet) => {
      if (!isNextSpan) {
        if (snippet.startsWith("<span")) {
          const spanRegex = /".*?"/g;
          start = spanRegex.exec(snippet)[0].replace(/"/g, "");
          end = spanRegex.exec(snippet)[0].replace(/"/g, "");
          isNextSpan = 1;
        } else {
          paragraphArray.push({ content: snippet, isSpan: false });
        }
      } else if (isNextSpan) {
        if (snippet.startsWith("</span")) {
          isNextSpan = 0;
        } else {
          paragraphArray.push({ content: snippet, isSpan: true, timing: [start, end] });
        }
      }
    });
  return paragraphArray;
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
    const { playing, speechID } = this.props;
    const imgLink = `https://data.irozhlas.cz/prezidentske-projevy/data/${speechID.split("-")[1].toLowerCase()}.jpg`;
    return (
      <div className="speech">
        <div className="sidebar">
          <img className="speech-img" alt="" src={imgLink} />
          <PlayerButton playing={playing} />
        </div>
        <h1 className="speech-header">
          {header}
        </h1>
        <div className="speech-blurb">
          {`„${blurb}“`}
        </div>
        <div className="speech-content">
          {content.map(paragraph => (
            <p className="speech-paragraph">
              {processParagraph(paragraph).map((snippet) => {
                if (!snippet.isSpan) {
                  return snippet.content;
                }
                return (
                  <a href="#" onClick={e => partialPlay(e, snippet.timing)}>
                    {snippet.content}
                  </a>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default { SpeechText };
