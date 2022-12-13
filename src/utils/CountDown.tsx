import React from 'react';
import produce from 'immer';

import Timer from './Timer.tsx'

type CountDownProps = {
  count: number,
  text: string
}

type CountDownState = {
  count: number
}

console.log('CountDown.tsx');


class CountDown extends React.Component<CountDownProps, CountDownState> {
  state: CountDownState;

  constructor(props: CountDownProps) {
    super(props);

    this.state = {
      count: props.count
    };

    this.timer = null;
  }

  componentDidMount() {
    if (this.timer == null) {
      // console.log("componentDidMount normal bei this.timer == null");

      this.timer = Timer.repeating(this.updateCount, 1000, this.props.count);
    // } else {
    //   console.warn("componentDidMount anormal bei this.timer != null");
    }
  }

  updateCount = () => {
    this.setState(produce(this.state, (draft) => {
      --draft.count;
    }));
  }

  render(): void {
    return (
      <span>{this.state.count === 0 ? this.props.text : "" + this.state.count} </span>
    );
  }
}

export default CountDown;
