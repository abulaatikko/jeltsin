import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import moment from 'moment'

function Pagination({ month, openPreviousMonth, openNextMonth }) {
    const isCurrentMonthOpened = moment(month, 'YYYY-MM').format('YYYY-MM') === moment().format('YYYY-MM')

    return (
        <div className="pagination">
            <p>
                <a className={isCurrentMonthOpened ? 'disabled' : ''} onClick={openNextMonth}>Uudempia uutisia</a> &mdash; <a onClick={openPreviousMonth}>Vanhempia uutisia</a>
            </p>
        </div>
    )
}

class App extends Component {

    constructor() {
        super()

        this.state = {
            news: [],
            month: moment().format('YYYY-MM')
        }

        this.fetchData = this.fetchData.bind(this)
        this.openNextMonth = this.openNextMonth.bind(this)
        this.openPreviousMonth = this.openPreviousMonth.bind(this)
    }

    openNextMonth() {
        const { month } = this.state
        const nextMonth = moment(month, 'YYYY-MM').add(1, 'months').format('YYYY-MM')

        this.setState({ month: nextMonth })
    }

    openPreviousMonth() {
        const { month } = this.state
        const previousMonth = moment(month, 'YYYY-MM').subtract(1, 'months').format('YYYY-MM')

        this.setState({ month: previousMonth })
    }

    fetchData() {
        const { month } = this.state

        fetch('/api?month=' + month)
            .then(data => data.json())
            .then(json => this.setState({ news: json }))
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.month !== this.state.month) {
            this.fetchData()
        }
    }

    render() {
        const { month } = this.state

        return (
            <div>
                <Pagination month={month} openPreviousMonth={this.openPreviousMonth} openNextMonth={this.openNextMonth} />
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
                <Pagination month={month} openPreviousMonth={this.openPreviousMonth} openNextMonth={this.openNextMonth} />
            </div>
        )
    }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)

