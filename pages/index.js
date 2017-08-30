import Head from 'next/head'
import Link from 'next/link'
import 'isomorphic-fetch'

export default class MyPage extends React.Component {
    static async getInitialProps () {
      const res = await fetch('http://localhost:3000/api/emails')
      const json = await res.json()
      return { emails: json.data }
    }
  
    render () {
      return (
        <div className="vh-100 w-100 sans-serif bg-white black-80 helvetica">
            <Head>
            <link rel="stylesheet" href="https://unpkg.com/tachyons@4.8.0/css/tachyons.min.css"/>
            </Head>
            <h1>
                Available Emails
            </h1>
            <ul className="list pl0 ml0 center mw7 ba b--light-silver br2">
            {
                this.props.emails.map((email, i) => 
                    <li key={i}
                        className="ph3 pv3 bb b--light-silver"
                    >
                        <Link href={`/emails/${encodeURIComponent(email.id)}`}>
                            <a className="blue link hover-dark-blue" >
                                {email.id}
                            </a>
                        </Link>
                    </li>
                )
            }
            </ul>
        </div>
      )
    }
  }