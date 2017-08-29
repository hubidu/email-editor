import React from 'react';
import { render } from 'react-dom'

import Head from 'next/head'
import Link from 'next/link'
import 'isomorphic-fetch'

import Editor from '../components/editor'


export default class EditEmailPage extends React.Component {
    static async getInitialProps ({ query, req }) {
        const res = await fetch(`http://localhost:3000/api/emails/${query.id}`)
        const json = await res.json()
        return { email: json, id: query.id }
    }

    onChangeSource(changedSource) {
        console.log('Saving...')

        fetch(`/api/emails/${this.props.id}/save`, {
            method: "POST",
            headers:{'content-type': 'application/json'},
            body: JSON.stringify({
                emailSource: changedSource
            })
        }).then(() => document.getElementById('preview').contentWindow.location.reload())
    }
  
    render () {
      return (
        <div className="vh-100 pa3 w-100 sans-serif bg-white black-80 helvetica">
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/tachyons@4.8.0/css/tachyons.min.css"/>
            </Head>
            <h3 className="ma0 mv1">
                <span className="black-20">
                    Edit email 
                </span>    
                &nbsp;
                {this.props.email.id}
            </h3>
            <div className="cf">
                <div className="fl w-50 bg-near-white tc">
                    <Editor
                        width="100%"
                        height="800px"
                        mode="html"
                        theme="monokai"
                        onChange={this.onChangeSource.bind(this)}
                        name="emailCode"
                        value={this.props.email.template}
                        highlightActiveLine={true}
                        setOptions={{
                            scrollSpeed: 1,
                            animatedScroll: true,
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableEmmet: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />                    
                </div>
                <div className="fl w-50 bg-light-gray tc">
                    <iframe
                        style={{height: 800 + 'px'}}
                        className="w-100 bn"
                        id="preview" 
                        name="preview" 
                        frameBorder="0" 
                        cellSpacing="0" 
                        src="/api/emails/price-check/preview"
                    />
                </div>
            </div>

        </div>
      )
    }
  }