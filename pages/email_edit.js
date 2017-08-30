import React from 'react';
import { render } from 'react-dom'

import Layout from '../components/layout'
import Link from 'next/link'
import 'isomorphic-fetch'

import Editor from '../components/editor'

import {status, commit, push} from '../components/services/git-api'
import { sendEmail } from '../components/services/send-email'
import { saveEmail } from '../components/services/save-email'
import { getEmail } from '../components/services/get-email'

export default class EditEmailPage extends React.Component {
    static async getInitialProps ({ query, req }) {
        const email = await getEmail(query.id)
        return { email, id: query.id }
    }

    onChangeSource(changedSource) {
        saveEmail(this.props.id, changedSource)
            .then(() => document.getElementById('preview').contentWindow.location.reload())
    }

    onStatus() {
        status()
    }

    onCommit() {
        commit()
    }

    onPush() {
        push()
    }

    async onSendEmail() {
        await sendEmail(this.props.id)
    }

    render () {
      return (
        <Layout>
            <div className="absolute top-0 left-0 w-100">
                <div className="cf">
                    <h3 className="fl w-50 ma0 mb3 pa2">
                        <span className="black-20">
                            Edit email
                        </span>
                        &nbsp;
                        {this.props.email.id}
                    </h3>
                    <div className="fl w-50 ma0 mb3 pa2 tr">
                        <button className="f7 link dim br1 ba ph3 pv2 mr1 dib bg-white black"
                            onClick={this.onStatus.bind(this)}
                        >
                            Status
                        </button>
                        <button className="f7 link dim br1 ba ph3 pv2 mr1 dib bg-white black"
                            title="git commit all changes"
                            onClick={this.onCommit.bind(this)}
                        >
                            Commit
                        </button>
                        <button className="f7 link dim br1 ba ph3 pv2 mr1 dib bg-white black"
                            title="git push all changes"
                            onClick={this.onPush.bind(this)}
                        >
                            Push
                        </button>
                        <button className="f7 link dim br1 ba ph3 pv2 mr1 dib bg-white black"
                            title="send a test mail"
                            onClick={this.onSendEmail.bind(this)}
                        >
                            Send Email
                        </button>
                    </div>
            
                </div>

            </div>
            <div className="cf pt5 vh-100">
                <div className="fl h-100 w-20 bg-near-white tc">
                    TODO Show/Create/Edit models
                </div>
            
                <div className="fl h-100 w-40 bg-near-white tc">
                    <Editor
                        width="100%"
                        height="100%"
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
                <div className="fl h-100 w-40 bg-light-gray tc">
                    <iframe
                        style={{height: '99%', width: '100%', border: 'none'}}
                        id="preview" 
                        name="preview" 
                        frameBorder="0" 
                        cellSpacing="0" 
                        src="/api/emails/price-check/preview"
                    />
                </div>
            </div>
        </Layout>
      )
    }
  }