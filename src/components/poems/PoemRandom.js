import React from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import Form from '../auth/Form';
import Auth from '../../lib/Auth';
import Flash from '../../lib/Flash';
import Poem from './Poem';


class PoemRandom extends React.Component {
  state = {
    poems: [],
    poem: {}
  }

  componentDidMount() {
    axios.get('/api/poems')
      .then(res => {
        this.setState({poems: res.data});
        const length = this.state.poems.length;
        return length;
      })
      .then(length => {
        const random = Math.floor(Math.random()*(length));
        console.log(random);
        return random;
      })
      .then(random => {
        this.setState({poem: this.state.poems[random]});
        console.log(this.state.poem);
        console.log(this.state.poem.poet.username);
      });
  }


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
          Flash.setMessage('denied', 'sorry, either your email address or password is wrong, or you are not registered.');
          this.props.history.replace('/');
        });
    }

    starred = (poem) => {


      // console.log(Auth.getPayload().sub);
      if (!poem.stars.includes(Auth.getPayload().sub)) {
        const newstar =
          poem.stars.push(Auth.getPayload().sub);
        this.setState({...poem, [poem.stars]: newstar});
        // console.log(poem);
        axios.put(`/api/poems/${poem._id}`, poem, {
          headers: {Authorization: `Bearer ${Auth.getToken()}`}
        });
      } else {
        const index = poem.stars.indexOf(Auth.getPayload().sub);
        if (index > -1) {
          const newstar =
            poem.stars.splice(index, 1);
          this.setState({...poem, [poem.stars]: newstar});
          // console.log(poem);
          axios.put(`/api/poems/${poem._id}`, poem, {
            headers: {Authorization: `Bearer ${Auth.getToken()}`}
          });
        }
      }
    }



    render() {
      const poem = this.state.poem;
      if(!poem.poet) return null;

      return (
        <section>
          <div className='columns is-variable is-8'>


            <div className='column'>
              {!Auth.isAuthenticated() &&
                <div className='formbox'>
                  <Form
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit} />
                </div>
              }

              <div className='definitions columns is-multiline'>
                <div className='column is-half-tablet home'>
                  <h4>photo</h4>
                  <p className='subtitle is-5'>/ˈfəʊtəʊ/<br />
                a picture made using a camera.</p>
                </div>
                <div className='column is-half-tablet home'>
                  <h4>haiku</h4>
                  <p className='subtitle is-5'>/ˈhʌɪkuː/<br />
                a japanese poem of 17 syllables, in three lines of five, seven, and five.</p>
                </div>
                <div className='column'>
                  <h3>photohaiku</h3>
                  <p className='subtitle is-4'>/ˈfəʊtəʊˈhʌɪkuː/<br />
                an original haiku based on a submitted photo, created by the photohaiku robot using image content analysis, lexicon-based algorithms, and the poetic muse.</p>
                </div>
              </div>

            </div>
            <div className='column home'>
              <Poem
                poem={poem}
                starred={()=> {
                  this.starred(poem);
                }}
              />
            </div>
          </div>
          <footer className='has-text-centered'><p className='subtitle is-6'>designed by <a href='http://stephanieye.com' target='new'>stephanie ye</a> <span className='subtitle is-7'>&#9733;</span> london 2018</p></footer>
        </section>
      );
    }
}

export default PoemRandom;
