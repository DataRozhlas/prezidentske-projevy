import { h, Component } from "preact";
/** @jsx h */

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
      <audio controls ref={(elem) => { this.player = elem; }}>
        <source src={url} type="audio/mpeg" />
      </audio>
    );
  }
}

export default { Player };
