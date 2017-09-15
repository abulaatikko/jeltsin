import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {

    constructor() {
        super()

        this.state = {
            news: []
        }
    }

    componentDidMount() {
        fetch('/api')
            .then(data => data.json())
            .then(json => this.setState({ news: json }))
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.news.map((item) =>
                        <li key={item._id}><a href={item.url}>{item.title} ({item.added})</a></li>
                    )}
                </ul>
            </div>
        )
    }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)

