import React, {Component} from 'react';

import '../styles/base.scss';
import logo from '../imgs/bs_logo.png';

import proxy from '../actions/proxy';

import { withTranslation } from 'react-i18next';

class App extends Component{

  constructor(props){
    super(props);  
  
    let isLogin = window.sessionStorage.getItem('auth_isLogin');
    let id = window.sessionStorage.getItem('auth_id');
    let grade = window.sessionStorage.getItem('auth_grade');
    this.state = { 
      isLogin : isLogin ? isLogin : false,
      grade : grade ? Number(grade) : 0,
      id : id ? id : '',
      pwd : '',
      error : '',      
    }
  }

  componentDidMount(){
    document.body.style.backgroundImage = "";
  }

  handleInputChange = (e) => {
    if(e.target.type === 'number'){
      this.setState({[e.target.id] : e.target.valueAsNumber });
      //console.log('set ' + e.target.id +' input : ' +  e.target.valueAsNumber);
    }
    else {
      this.setState({[e.target.id] : e.target.value });

      //console.log('set ' + e.target.id +' input : ' +  e.target.value);
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  login = () => {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    let This = this;
    proxy.login(this.state.id, this.state.pwd).then(function(response) {
      if(response.result.loginResult === 0) This.setState({ error: t('unknown id')});
      else if(response.result.loginResult === 1) This.setState({ error: t('incorrect password')});
      else if(response.result.loginResult === 2) This.setState({ error: t('blocked')});
      else {
        window.sessionStorage.setItem('auth_id',This.state.id);
        window.sessionStorage.setItem('auth_pwd',This.state.pwd);
        window.sessionStorage.setItem('auth_ukey',response.result.ukey);
        window.sessionStorage.setItem('auth_grade',response.result.grade);
        window.sessionStorage.setItem('auth_isLogin',true);
        window.location.reload(false);
        console.log('login success');
      }
    }).catch(function(error){
      console.log(error);
    });

  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴
    return (
      <div className="modern-login-container">  
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="Logo" className="login-logo"/>
            <h1 className="login-title">{t('Laghaim')}</h1>
            { this.state.isLogin && (
              <div className="user-info">
                <span className="user-id">ID: {this.state.id}</span>
                <span className="user-grade">
                  {this.state.grade === 0 ? 'Admin' : 
                   this.state.grade === 1 ? 'Supervisor' : 'Manager'}
                </span>
              </div>
            )}
          </div>
          
          { !this.state.isLogin ? (
            <div className="login-form"> 
              <div className="input-group">
                <input 
                  className="modern-input" 
                  type="text" 
                  placeholder={t('input your id')} 
                  id="id" 
                  value={this.state.id} 
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="input-group">
                <input 
                  className="modern-input" 
                  type="password" 
                  placeholder={t('input your password')} 
                  id="pwd" 
                  value={this.state.pwd} 
                  onChange={this.handleInputChange} 
                  onKeyPress={this.handleKeyPress} 
                />
              </div>
              { this.state.error.length > 0 && (
                <div className="error-message">{this.state.error}</div>
              )}
              <button className="modern-login-btn" onClick={this.login}>
                {t('LOGIN')}
              </button>
            </div>
          ) : (
            <div className="welcome-message">
              <p>환영합니다!</p>
              <button 
                className="modern-logout-btn" 
                onClick={() => {
                  window.sessionStorage.clear();
                  window.location.reload();
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

//export default App;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(App);