import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import Form from './Form';
import Flash from '../../lib/Flash.js';

class UsersEdit extends React.Component {
  state = {
    user: null,
    errors: {}
  };

  componentDidMount() {
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then(res => this.setState({user: res.data}));
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [name]: value
      }
    }));
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    axios.put(`/api/users/${id}`, this.state, {
      headers: {Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => {
        Flash.setMessage('welcome', 'you have successfully updated your account.');
        this.props.history.push('/profile');
      })
      .catch((err)=> {
        console.log(err.response.data.errors);
        this.setState({errors: err.response.data.errors});
        this.props.history.replace(`/users/${id}/edit`);
      });
  }

  handleDelete = () => {
    axios.delete(`/api/users/${this.props.match.params.id}`, {
      headers: {Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(Flash.setMessage('denied', 'sayonara.'))
      .then(this.handleLogout);
  }

  handleLogout = () => {
    Auth.logout();
    this.props.history.push('/');
  }


  render() {
    const {user} = this.state;

    if(!user) return null;
    return (
      <section>
        <div className='formbox'>
          <Form
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            errors={this.state.errors}
            user={user}
          />
        </div>
        <div className='dangerzone has-text-centered'>
          <p>i hope you will stay</p>
          <p>but i know all things must pass...</p>
          <p>so: sayonara.</p>
          <p className='subtitle is-6'>&hearts; <span className='italics'>the photohaiku robot</span></p>

          <button className="button is-destroy" onClick= {this.handleDelete}>delete your account</button>
          <p className='subtitle is-6'>deleting your account also deletes all your photohaiku, forever</p>
        </div>
      </section>
    );
  }
}


export default UsersEdit;
