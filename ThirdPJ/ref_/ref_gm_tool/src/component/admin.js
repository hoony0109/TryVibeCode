import React, {Component} from 'react';
//import ReactSelect from 'react-select';
//import ReactDataGrid from 'react-data-grid';
import { DataGrid } from 'react-data-grid';

import '../styles/react-data-grid.css';
import { CSVLink } from "react-csv";
import { range } from 'lodash';

import '../styles/App.css';
import '../styles/base.scss';

import proxy from '../actions/proxy';

import { withTranslation } from 'react-i18next';

class Admin extends Component{

  constructor(props){
    super(props);

    this.state = { 
      topLeft: {},
      botRight: {},

      menu:'',
  
      // manager
      managerId:'',
      managerPwd:'',
      managerGrade:2,

      // result
      resultColumns:'',
      resultRows:''

    }
    document.addEventListener('copy', this.handleCopy);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.handleCopy);
  }

  onSelectionCell = (args) => {
    console.log('set selection args : ',args);
    this.setState({
      topLeft: {
        rowIdx: args.topLeft.rowIdx,
        colIdx: args.topLeft.idx,
      },
      botRight: {
        rowIdx: args.bottomRight.rowIdx,
        colIdx: args.bottomRight.idx,
      },
    });
  };

  handleCopy = (e) => {
    console.log('handleCopy Called');
    e.preventDefault();
    const { topLeft, botRight } = this.state;

    // Loop through each row
    const text = range(topLeft.rowIdx, botRight.rowIdx + 1).map(
        // Loop through each column
        
        rowIdx => this.state.resultColumns.slice(topLeft.colIdx, botRight.colIdx + 1).map(
        // Grab the row values and make a text string
        col => this.state.resultRows[rowIdx][col.key],
      ).join('\t'),
      ).join('\n');
    console.log('text', text);
    e.clipboardData.setData('text/plain', text);
  }

  setMenu(menu){
    this.setState({
      menu:menu,

      resultColumns:'',
      resultRows:'',
   
      // user
      accountId:'',
      accountIdx:0,
      userIdx:0,
    });
    console.log('set menu : ' + menu);
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

  select = () => { 
    const { t } = this.props; // t 함수를 this.props에서 가져옵니다.

    if(this.state.menu==='MANAGER'){
      proxy.getManager(this.props.location.state.auth.ukey).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }

    //result
    let This = this;
    function setResult(result){

      // set cloumns
      let columns = [];

      if(result.length > 0){
        for(let i=0; i<Object.keys(result[0]).length; i++)
        {
          columns.push({key:Object.keys(result[0])[i], name:Object.keys(result[0])[i], resizable:true});
        }

        // translate data
        for(let i=0; i<result.length; i++){
          for(let key in result[i]) {
            if(isNaN(result[i][key])){ 
              if(result[i][key].constructor.name==='Object'){
                result[i][key] = JSON.stringify(result[i][key]);
              }
              else if(result[i][key].constructor.name==='Array'){
                result[i][key] = JSON.stringify(result[i][key]);
              }
              else{
                var dt=new Date(result[i][key]);
                if(!isNaN(dt.getTime())){
                  let offsetMs = dt.getTimezoneOffset() * 60 * 1000;
                  let dateLocal = new Date(dt.getTime() - offsetMs);
                  result[i][key] = dateLocal.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
                }
              }
            }
          }
        }

        This.setState({resultColumns:columns, resultRows:result }); 
      }
      else{
        columns.push({key:'result', name:'result'});
        This.setState({resultColumns:columns, resultRows:[{result:'no data'}] });
      }
      console.log(This.state.menu + ' execute result :' + JSON.stringify(This.state.resultRows));  
    }
  }

  update = (command) => {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    if(this.state.menu==='MANAGER'){
      proxy.setManager(this.props.location.state.auth.ukey,command,this.state.managerId,this.state.managerPwd,this.state.managerGrade).then(response => {
        /*
        let columns = [];
        columns.push({key:'result', name:'result'});
        this.setState({resultColumns:columns, resultRows:[{result:'success'}] });
        */
        //window.alert(JSON.stringify(response));
        if(typeof response.result !== 'undefined' && response.result > 0){
          let msg;
          switch(response.result){
            case 1:
              msg = t('(id or passwd is empty)');
              break;
            case 2:
              msg = t('(id or passwd is empty)');
              break;
            case 3:
              msg = t('(passwd can\'t be the same as id)');
              break;              
            default:
              msg = t('code') + `(${response.result})`;
          }
          window.alert(`Error, ${msg}`);
        }
        else{
          window.alert(t('Success!'));
          this.select();
        }
        
      }).catch(err => {
        window.alert(`Fail! ${err}`);
        console.log(err);
      });
    }
  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴
    return (

      <div className="body"> 

        <div className="left-list">
          <div className="title">{t('INDEX')}</div>
          <li onClick = {(e) => {this.setMenu('MANAGER')}}>{t('MANAGER')}</li>
        </div>

        <div className="right-top-input">
          <div className="title">{t('EDITOR')}</div>  
          { 
            this.state.menu==='MANAGER' ? 
              <React.Fragment>
                <div className="info">{t('[ MANAGER ]')}</div> 
                <button onClick = {this.select}>{t('LOOKUP')}</button> 
                <div className="command">
                  <label htmlFor="managerId">{t('manager id')}</label>
                  <input type="text" placeholder={t('input manager id')} id="managerId" value={this.state.managerId} onChange={this.handleInputChange}/>
                  <label htmlFor="managerPwd">{t('manager password')}</label>
                  <input type="text" placeholder={t('input manager password')} id="managerPwd" value={this.state.managerPwd} onChange={this.handleInputChange}/>
                  <label htmlFor="managerGrade">{t('manager grade (0:Admin 1:Supervisor 2:manager)')}</label>
                  <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input manager grade')} id="managerGrade" value={this.state.managerGrade} onChange={this.handleInputChange}/>
                  <button onClick = {(e) => {this.update('MANAGER_CREATE')}}>{t('CREATE')}</button>
                </div>
              </React.Fragment>
            : ''
          }
        </div>

        <div className="right-middle-result">
          <div className="title">{t('RESULT')}
            { this.state.resultRows.length > 0 ? 
            <CSVLink className="export" data={this.state.resultRows} filename={'THE_FOUR_GOD_ADMIN_'+this.state.menu+'.csv'}>EXPORT</CSVLink> : <></> }
          </div>  
          <div className="resultInfo">
          { this.state.resultRows === '' ? '' :
              <React.Fragment>
                <DataGrid 
                  columns={this.state.resultColumns} 
                  rows={this.state.resultRows} 
                  height={20 * (this.state.resultRows.length + 5) } // 50000
                  width={this.state.resultRows.length > 0 ? Object.keys(this.state.resultRows[0]).length * 145 : 0} // 필드 개수 * 100
                  rowHeight={20}                    
                  enableCellSelect={true}
                  onSelectedCellChange={s => this.onSelectionCell({topLeft: s, bottomRight: s})}
                />
              </React.Fragment>
            }            
{/*            
            { this.state.resultRows === '' ? '' :
              <React.Fragment>
                <ReactDataGrid 
                  columns={this.state.resultColumns} 
                  rows={this.state.resultRows} 
                  height={30000} 
                  rowHeight={30}
                  enableCellSelect={true}
                  onSelectedCellChange={s => this.onSelectionCell({topLeft: s, bottomRight: s})}
                />
              </React.Fragment>
            }
*/}
          </div>
        </div>

      </div>

    );
  }
}

//export default Admin;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(Admin);
