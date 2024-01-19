import React, { Component } from 'react'
import t from 't-component'

export default class BtnMiArgentina extends Component {
  static defaultProps = {
    action: 'ext/auth/miargentina/login'
  }

  render () {
    const { action } = this.props

    return (
      <form
        className='btn-miargentina-form'
        action={action}
        method='get'
        role='form'>
        <button
          className='btn-miargentina-btn'
          type='submit'>
          <img src='/ext/lib/site/sign-in/miargentina.svg' width='200' />
        </button>
      </form>
    )
  }
}
