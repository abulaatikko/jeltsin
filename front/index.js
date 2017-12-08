import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom'

import moment from 'moment'

function Pagination({ match }) {
    const { month } = match.params

    const isCurrentMonthOpened = moment(month, 'YYYY-MM').format('YYYY-MM') === moment().format('YYYY-MM')
    const nextMonth = moment(month, 'YYYY-MM').add(1, 'months').format('YYYY-MM')
    const previousMonth = moment(month, 'YYYY-MM').subtract(1, 'months').format('YYYY-MM')

    return (
        <div className="pagination">
            <p>
                {!isCurrentMonthOpened
                    ? <Link to={`/month/${nextMonth}`}>Uudempia uutisia</Link>
                    : <span>Uudempia uutisia</span>
                }
                &nbsp;&mdash;&nbsp;
                <Link to={`/month/${previousMonth}`}>Vanhempia uutisia</Link>
            </p>
        </div>
    )
}

class NewsList extends Component {

    constructor() {
        super()

        this.state = {
            news: [],
        }
    }

    fetchData() {
        const { month } = this.props.match.params

        fetch('/api?month=' + month)
            .then(data => data.json())
            .then(json => this.setState({ news: json }))
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.fetchData()
        }
    }

    render() {
        const props = this.props

        return (
            <div>
                <Pagination {...props} />
                <table>
                    <thead>
                        <tr><th>Uutinen</th><th>Julkaistu</th></tr>
                    </thead>
                    <tfoot>
                        <tr><th>Uutinen</th><th>Julkaistu</th></tr>
                    </tfoot>
                    <tbody>
                    {this.state.news.map((item) =>
                        <tr key={item._id}><td><a href={item.url}>{item.title}</a></td><td>{moment(item.added).format('YYYY-MM-DD @ HH:mm')}</td></tr>
                    )}
                    </tbody>
                </table>
                <Pagination {...props} />
            </div>
        )
    }
}

class App extends Component {

    render() {
        return (
            <div>
                <Route path="/month/:month" component={NewsList} />
                <Route exact path="/" render={() => (
                    <Redirect to={`/month/${moment().format('YYYY-MM')}`} />
                )} />
            </div>
        )
    }
}

const root = document.querySelector('#root')
ReactDOM.render(<Router><App /></Router>, root)

