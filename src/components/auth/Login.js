import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import Flash from '../../lib/Flash';

class AuthLogin extends React.Component {
  state ={};

  handleChange = ({target: {name, value}}) => {
    this.setState({[name]: value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/login', this.state)
      .then(res => {
        Auth.setToken(res.data.token);
        Flash.setMessage('welcome', res.data.message);
      })
      .then(()=>
        this.props.history.push('/createpoem'))
      .catch(()=> {
        console.log(this.state);
        Flash.setMessage('denied', 'sorry, either your email address or password is wrong, or you are not registered.');
        this.props.history.replace('/login');
      });
  }


  render() {
    return (
      <div className='formbox'>
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="email">email address</label>
            <input
              className="input"
              name="email"
              placeholder="please enter your email address"
              onChange={this.handleChange}/>
          </div>
          <div className="field">
            <label htmlFor="password">password</label>
            <input
              type="password"
              className="input"
              name="password"
              placeholder="please enter your password"
              onChange={this.handleChange}/>
          </div>
          <div className='has-text-centered-mobile'>
            <button className ="button is-create">log in</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AuthLogin;
