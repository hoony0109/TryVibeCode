import React, {Component} from 'react';
import { NavLink } from 'react-router-dom'

import './styles/App.css';
import './styles/base.scss';

import proxy from './actions/proxy';

import { withTranslation } from 'react-i18next';
import i18n from 'i18next';  // i18n을 가져옵니다.


class Header extends Component{

    constructor(props){
        super(props);

        // 브라우저 언어 감지
        const browserLanguage = navigator.language.split('-')[0]; // 'en-US' 같은 언어 코드를 'en'으로 변환
        const supportedLanguages = ['en', 'ko', 'zh']; // 지원하는 언어 목록
        const initialLanguage = supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en'; // 지원하지 않는 언어의 경우 기본값을 'en'으로 설정

        // i18n을 브라우저 언어로 초기화
        i18n.changeLanguage(initialLanguage);     

        let isLogin = window.sessionStorage.getItem('auth_isLogin');
        let id = window.sessionStorage.getItem('auth_id');
        let pwd = window.sessionStorage.getItem('auth_pwd');
        let ukey = window.sessionStorage.getItem('auth_ukey');
        let grade = window.sessionStorage.getItem('auth_grade');   
        this.state = { 
            auth: {
                isLogin : isLogin ? isLogin : false, 
                id : id ? id : '',
                pwd : pwd ? pwd : '',
                ukey : ukey ? ukey : '',
                grade : grade ? Number(grade) : 0
            },
            language: initialLanguage,  // 초기 언어 설정
            worldNames : [],
            itemNames : [],
            selectedFile: null,
        }        
    }

    changeLanguage = (e) => {
        const newLanguage = e.target.value;
        this.setState({ language: newLanguage });
        this.props.i18n.changeLanguage(newLanguage); // 언어 변경
    }    

    checkAdmin()
    {
        return this.state.grade === 0;
    }

    componentDidMount(){
        let This = this;
        if(this.state.auth.isLogin){
            proxy.getWorldName().then(function(response) {
                let worldNames = [];
                for(let i=0; i<response.result.length; i++){
                    /*
                    worldNames.push({                        
                        label: 'idx:'+response.result[i].world_idx, 
                        value: response.result[i].world_idx
                    });
                    */
                   // _SHOW_WORLD_NAME
                   worldNames.push({                        
                    label: `(${response.result[i].world_idx})${response.result[i].world_name}(${response.result[i].sub_world_idx})`,
                    value: response.result[i].world_idx
                });
                }
                This.setState({worldNames:worldNames});
            }).catch(function(error){
                console.log(error);
            });
            
            proxy.getItemName().then(function(response) {
                let itemNames = [];
                for(let i=0; i<response.result.length; i++){
                    itemNames.push({
                        label:'type:'+response.result[i].Type+' name:'+response.result[i].Name + ' ID:'+response.result[i].ID, 
                        value:response.result[i].ID});
                }
                This.setState({itemNames:itemNames});
            }).catch(function(error){
                console.log(error);
            });
        }
    }
   
    render() {
        const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴
        return (

            <div className="header table">
                <div className="table-cell">
                    <div className="left">
                        <div className="language-select">
                        <select value={this.state.language} onChange={this.changeLanguage}>
                            <option value="en">English</option>
                            <option value="ko">한국어</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>                          
                    </div>
                   
                   { this.state.auth.isLogin ?
                    <div className="menu">
                        <NavLink exact className="menu-item" activeClassName="active" to={{pathname:"/", state:this.state}}>{t('Home')}</NavLink>
                        <NavLink className="menu-item" activeClassName="active" to={{pathname:"/user", state:this.state}}>{t('User')}</NavLink>
                        <NavLink className="menu-item" activeClassName="active" to={{pathname:"/cs", state:this.state}}>{t('CS')}</NavLink>
                        <NavLink className="menu-item" activeClassName="active" to={{pathname:"/log", state:this.state}}>{t('Log')}</NavLink>
                        <NavLink className="menu-item" activeClassName="active" to={{pathname:"/stat", state:this.state}}>{t('Stat')}</NavLink>
                        {this.state.auth.grade === 0 ? 
                        <NavLink className="menu-item" activeClassName="active" to={{pathname:"/admin", state:this.state}}>{t('Admin')}</NavLink>
                        : <></>
                        }
                    </div>
                    : ''
                    }
                </div>   
            </div>
        );
    }
}

//export default Header;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(Header);