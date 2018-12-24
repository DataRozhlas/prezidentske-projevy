import { h, Component } from "preact";
/** @jsx h */

export function partialPlay(e, timing) {
  function toSeconds(time) {
    return parseInt(time.split(":")[0], 10) * 60 + parseFloat(time.split(":")[1]);
  }

  e.preventDefault();
  const player = document.getElementById("Player");
  const startTime = toSeconds(timing[0]);
  const duration = parseInt((toSeconds(timing[1]) - toSeconds(timing[0])) * 1000, 10);

  player.currentTime = startTime;
  player.play();
  const playerTimeout = setTimeout(() => {
    player.pause();
  },
  duration);

  // timeout so the seeking event doesn't fire immediately
  player.onpause = () => {
    console.log("fired!")
    clearTimeout(playerTimeout);
  };
}

export class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { url: "" };
  }

  componentDidMount() {
    const { speechID } = this.props;
    this.setState({ url: `https://samizdat.blob.core.windows.net/projevy/${speechID.toLowerCase()}.mp3` });
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
    this.setState(
      { url: `https://samizdat.blob.core.windows.net/projevy/${speechID.toLowerCase()}.mp3` },
      () => {
        component.pause();
        component.load();
      },
    );
  }

  render() {
    const { url } = this.state;
    return (
      <audio controls id="Player" ref={(elem) => { this.player = elem; }}>
        <source src={url} type="audio/mpeg" />
      </audio>
    );
  }
}

export default { Player };
