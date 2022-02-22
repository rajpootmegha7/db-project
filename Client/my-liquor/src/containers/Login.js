import React, { Component } from 'react';
import './login.css';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';


export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      msg: '',
    };

    this.submitForm = this.submitForm.bind(this);
    this.showError = this.showError.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
  }

  showSuccess(message) {
    this.toast.show({severity:'success', summary: 'Success Message', detail:message, life: 3000});
  }
  showError(message) {
    this.toast.show({severity:'error', summary: 'Error Message', detail:message, life: 3000});
  }

  verifyLogin(data) {
    console.log('In Submit Login');
    var request = new Request('http://localhost:4000/login/api/get_userid', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });

    var that = this;
    fetch(request)
      .then(function (response) {
        if (response.status === 400) throw new Error();
        response.json().then(function (data) {
            localStorage.setItem('username', that.state.username);
            localStorage.setItem('isLogged', 'true');
            that.showSuccess('Sucessfully Logged In.');
            that.props.history.push('/my-liquorstore/dashboard');
        });
      })
      .catch(function (err) {
        that.showError('BAD Request');
      });
  }

  submitForm(event){
    event.preventDefault();

    var data = {
      _username: this.state.username,
      _msg: this.state.msg
    };
    console.log(data);
    this.verifyLogin(data);

  };

  render() {
    localStorage.setItem('isLogged', 'false');
    return (
      <div className="Login">
         <Toast ref={(el) => this.toast = el} />

        <div id="contianerLogin" className="p-formgroup-inline">
          <span className="p-float-label">
            <InputText
              id="username"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            />
            <label htmlFor="username">Username</label>
          </span>
          <Button className='btnlogin'
            type="button"
            label="Sign In"
            onClick={this.submitForm}
          />
         
        </div>

        <div className="footer_login">
          <span className="label_statement">
            <i> “Lets have a drink!!"</i>
          </span>
        </div>
      </div>
    );
  }
}
