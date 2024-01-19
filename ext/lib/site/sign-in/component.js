import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import t from 't-component'
import bus from 'bus'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import userConnector from 'lib/site/connectors/user'
import BtnMiargentina from './btn-miargentina'

export class SignIn extends Component {
  constructor (props) {
    super(props)
  }

  // componentWillMount () {
  //   bus.emit('user-form:load', 'signin')
  // }

  // componentWillUnmount () {
  //   bus.emit('user-form:load', '')
  // }

  render () {
    return (
      <div id='sign-in'>
        <div className='title-page'>
          <div className='circle'>
            <i className='icon-login' />
          </div>
            <div className='title-page'>
              <h1>Ingresá a Mi Argentina</h1>
            </div>
        </div>
        <MiArgentinaForm />
      </div>
    )
  }
}

export default userConnector(SignIn)

function MiArgentinaForm () {
  return (
    <div className='miargentina-auth-form'>
      <p style={{ color: '#2A2A2A', fontSize: '12px', textAlign: 'center' }}>Para poder participár en las consultas, iniciá sesión con tu cuenta de <b>Mi Argentina</b>.</p>
      <BtnMiargentina />
      <hr />
      <div className="helptext">
        <p className="" style={{ marginBottom: '10px' }}><b>Si aun no tenes cuenta en Mi Argentina</b></p>
        <p style={{ color: '#2A2A2A', fontSize: '12px' }}>Podés crearla en pocos pasos haciendo clic <a href="https://mi.argentina.gob.ar"><b>AQUÍ</b></a></p>
      </div>
      <hr />
    </div>
  )
}
