import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import moment from 'moment'

function Pagination({ page, openPreviousPage, openNextPage }) {
    return (
        <div className="pagination">
            <p>
                <a className={page <= 1 ? 'disabled' : ''} onClick={openPreviousPage}>Uudempia uutisia</a>
                 &mdash; 
                <a onClick={openNextPage}>Vanhempia uutisia</a>
            </p>
        </div>
    )
}

class App extends Component {

    constructor() {
        super()

        this.state = {
            news: [],
            page: 1
        }

        this.fetchData = this.fetchData.bind(this)
        this.openNextPage = this.openNextPage.bind(this)
        this.openPreviousPage = this.openPreviousPage.bind(this)
    }

    openNextPage() {
        this.setState({ page: this.state.page + 1 })
    }

    openPreviousPage() {
        const { page } = this.state

        if (page <= 1) {
            return false
        }

        this.setState({ page: page - 1 })
    }

    fetchData() {
        const page = this.state.page
        fetch('/api?page=' + page)
            .then(data => data.json())
            .then(json => this.setState({ news: json }))
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.fetchData()
        }
    }

    render() {
        const { page } = this.state

        return (
            <div>
                <Pagination page={page} openPreviousPage={this.openPreviousPage} openNextPage={this.openNextPage} />
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
                <Pagination page={page} openPreviousPage={this.openPreviousPage} openNextPage={this.openNextPage} />
            </div>
        )
    }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)

