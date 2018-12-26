import { h, Component } from "preact";
import { speechMeta } from "./speechMeta";
/** @jsx h */

export function partialPlay(e, timing) {
  function toSeconds(time) {
    return parseInt(time.split(":")[0], 10) * 60 + parseFloat(time.split(":")[1]);
  }

  e.preventDefault();
  const player = document.getElementById("player");
  const startTime = toSeconds(timing[0]);
  const duration = parseInt((toSeconds(timing[1]) - toSeconds(timing[0])) * 1000, 10);

  player.currentTime = startTime;
  player.play();
  const playerTimeout = setTimeout(() => {
    player.pause();
  },
  duration);

  // timeout so the seeking event doesn't fire immediately
  // required for IE which doesn't pause when seeking, screw you IE
  setTimeout(() => {
    player.onseeking = () => {
      clearTimeout(playerTimeout);
    };
  },
  500);

  player.onpause = () => {
    clearTimeout(playerTimeout);
  };
}

function handlePlayerButton(e, playing) {
  const player = document.getElementById("player");
  if (playing) {
    player.pause();
  } else {
    player.play();
  }
}

export function PlayerButton(props) {
  const { playing } = props;
  const symbol = playing
    ? <span className="button-pause">▌▌</span>
    : <span className="button-play" />;
  return (
    <div className="button" onClick={e => handlePlayerButton(e, playing)}>
      {symbol}
    </div>
  );
}

export class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { url: "" };
    this.handlePlayState = this.handlePlayState.bind(this);
  }

  componentDidMount() {
    const { speechID } = this.props;
    const component = this.player;
    this.setState({ url: `https://s3.eu-central-1.amazonaws.com/datarozhlas/projevy-zvuky/${speechID.toLowerCase()}.mp3` });
    component.addEventListener("play", () => {
      this.handlePlayState(1);
    });
    component.addEventListener("pause", () => {
      this.handlePlayState(0);
    });
  }

  componentDidUpdate(prevProps) {
    const { speechID } = this.props;
    if (speechID !== prevProps.speechID) {
      this.updatePlayer();
    }
  }

  updatePlayer() {
    const { speechID } = this.props;
    const component = this.player;
    if (!speechMeta.notAvailable.includes(speechID)) {
      this.setState(
        { url: `https://samizdat.blob.core.windows.net/projevy/${speechID.toLowerCase()}.mp3` },
        () => {
          component.pause();
          component.load();
        },
      );
    } else {
      component.pause();
    }
  }

  handlePlayState(isPlaying) {
    const { playing } = this.props;
    playing(isPlaying);
  }

  render() {
    const { url } = this.state;
    return (
      <audio playing={this.handlePlayState} controls id="player" ref={(elem) => { this.player = elem; }}>
        <source src={url} type="audio/mpeg" />
      </audio>
    );
  }
}

export default { Player };
