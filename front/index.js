import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import moment from 'moment'

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
            <table>
                <thead>
                    <tr><th>Uutinen</th><th>Julkaistu</th></tr>
                </thead>
                <tbody>
                {this.state.news.map((item) =>
                    <tr key={item._id}><td><a href={item.url}>{item.title}</a></td><td>{moment(item.added).format('YYYY-MM-DD @ HH:mm')}</td></tr>
                )}
                </tbody>
            </table>
        )
    }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)

