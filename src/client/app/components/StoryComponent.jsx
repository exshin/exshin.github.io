import React from 'react'
import BoardComponent from './BoardComponent.jsx'

class StoryComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      storyState: 0,
      currentText: "Once there was a little recruiter, who talked and talked to many a stranger",
      currentImage: "1",
      end: false
    }
    this.story = this.story.bind(this)
  }

  story() {
    let story = {
      0: { text: "Once there was a little recruiter, who talked and talked to many a stranger.", image: "1" },
      1: { text: "But then he discovered he liked to uncover, metrics that happened to be a game changer.", image: "2" },
      2: { text: "His employers were glad. They gave him a pat. They gave him a shiny new analyst hat.", image: "3" },
      3: { text: "And so for a year he toiled on stats. He made many tools and dashboards to look at.", image: "4" },
      4: { text: "Another year passed through, his interest in building tools grew.", image: "5" },
      5: { text: "Cleaner and better, his coding skills grew too.", image: "6" },
      6: { text: "The little recruiter (turned analyst) thought: 'Maybe I'll give engineering a shot.'", image: "7" },
      7: { text: "And with a small team, he built many things...", image: "8" },
      8: { text: "Which are used every day by the whole recruiting team!", image: "9" },
      9: { text: "The little recruiter had never imagined, that in software development he'd find his true passion.", image: "10" },
      10: { text: "THE END", image: "11" }
    }
    let currentStoryState = this.state.storyState < 10 ? this.state.storyState + 1 : 0
    this.setState({
      storyState: currentStoryState,
      currentText: story[currentStoryState].text,
      currentImage: story[currentStoryState].image
    })

  }

  render() {
    return (
      <div>
        <div className="story-image">
          <BoardComponent storyState={ this.state.storyState } />
        </div>
        <div className="story-text">
          { this.state.currentText }
        </div>

        <button className="btn btn-primary" onClick={ this.story }><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    )
  }

}

export default StoryComponent
