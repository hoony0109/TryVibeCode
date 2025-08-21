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

class Purchase extends Component{

  constructor(props){
    super(props);

    this.state = { 
      topLeft: {},
      botRight: {},

      menu:'',

      // page
      page:1,

      // days
      days:1,
   
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
    //console.log('set selection args : ',args);
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

      // page
      page:1,

      // days
      days:1,
   
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

  handleFileInput = (e) => {
    this.props.location.state.selectedFile = e.target.files[0];
    // this.props.location.setState({
    //   selectedFile : e.target.files[0],
    // })
  }

  select = () => { 
    const { t } = this.props; // t 함수를 this.props에서 가져옵니다.
    if(this.state.menu==='NRU'){
      proxy.getNru(this.props.location.state.auth.ukey,this.state.days).then(response => {
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='DAU'){
      proxy.getDau(this.props.location.state.auth.ukey,this.state.days).then(response => {
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='IN-APP'){
      proxy.getInApp(this.props.location.state.auth.ukey,this.state.days).then(response => {
        //console.log(`before get iapdb info : ${JSON.stringify(response.result)} length : ${response.result.length}`);  
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CONCURRENT-USERS'){
      proxy.getConcurrentUsers(this.props.location.state.auth.ukey).then(response => {
        if(0 === response.result){
          setJsonResult(response.concurrentUsers);
        }
        else{
          setResultError(response.result); 
        }   
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='UPLOAD-DATA'){
      if(this.props.location.state.auth.grade !== 0){
        window.alert(t('upload-data is for admin only!'));
        return; 
      }

      const formData = new FormData();
      formData.append('file', this.props.location.state.selectedFile);
      proxy.uploadDataFile(formData).then(response => {
        window.alert(`file(${response.filename})` + t('upload success!'));
        setResult(response.result);
      }).catch(err => {
        window.alert("Fail!");
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
                if (key === 'date' || key === 'day'){
                  var dt=new Date(result[i][key]);
                  if(!isNaN(dt.getTime())){
                    let offsetMs = dt.getTimezoneOffset() * 60 * 1000;
                    let dateLocal = new Date(dt.getTime() - offsetMs);
                    result[i][key] = dateLocal.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
                    if (key === 'date'){
                      result[i][key] = result[i][key].replace(' 00:00:00', '');
                      result[i][key] = result[i][key].replace(' 09:00:00', '');
                    } 
                  }
                }
              }
            }
          }
        }

        This.setState({resultColumns:columns, resultRows:result}); 
      }
      else{
        columns.push({key:'result', name:'result'});
        This.setState({resultColumns:columns, resultRows:[{result:'no data'}] });
      }
      console.log(This.state.menu + ' execute result :' + JSON.stringify(This.state.resultRows));  
    }

    function setJsonResult(result){
      // set cloumns
      let columns = [];
      let strJsonResult = result.replace(/\0/g, '');

      if(0 < strJsonResult.length){
        
        let json_array = JSON.parse(strJsonResult);
        for(let i=0; i<Object.keys(json_array[0]).length; i++)
        {
          columns.push({key:Object.keys(json_array[0])[i], name:Object.keys(json_array[0])[i], resizable:true});
        }

        This.setState({resultColumns:columns, resultRows:json_array});
      }
      else{
        columns.push({key:'result', name:'result'});
        This.setState({resultColumns:columns, resultRows:[{result:'no data'}] });        
      }
      console.log(This.state.menu + ' execute result :' + JSON.stringify(This.state.resultRows));  
    }

    function setResultError(result){
      // set cloumns
      let columns = [];
      columns.push({key:'result', name:'result'});
      This.setState({resultColumns:columns, resultRows:[{result:result}] }); 
    }    
  }

  update = (command) => {
  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴
    return (

      <div className="body"> 

        <div className="left-list">
          <div className="title">{t('INDEX')}</div>
          <li onClick = {(e) => {this.setMenu('NRU')}}>{t('NRU')}</li>
          <li onClick = {(e) => {this.setMenu('DAU')}}>{t('DAU')}</li>
          <li onClick = {(e) => {this.setMenu('IN-APP')}}>{t('IN-APP')}</li>
          <li onClick = {(e) => {this.setMenu('CONCURRENT-USERS')}}>{t('CONCURRENT-USERS')}</li>
          <li onClick = {(e) => {this.setMenu('UPLOAD-DATA')}}>{t('UPLOAD-DATA')}</li>
        </div>

        <div className="right-top-input">
          <div className="title">{t('EDITOR')}</div>
          {  
            this.state.menu==='NRU' ? 
              <React.Fragment>
                <div className="info">{t('[ NRU ]')}</div> 
                <div className="command">
                  <label htmlFor="days">{t('days')}</label>
                  <input className="days" type="number" min="1" id="days" value={this.state.days} onChange={this.handleInputChange}/>
                  <button onClick = {(e) => {this.select()}}>{t('SEARCH')}</button>
                </div>
            </React.Fragment>
            :
            this.state.menu==='DAU' ? 
              <React.Fragment>
                <div className="info">{t('[ DAU ]')}</div> 
                <div className="command">
                  <label htmlFor="days">{t('days')}</label>
                  <input className="days" type="number" min="1" id="days" value={this.state.days} onChange={this.handleInputChange}/>
                  <button onClick = {(e) => {this.select()}}>{t('SEARCH')}</button>
                </div>
            </React.Fragment>
            : 
            this.state.menu==='IN-APP' ? 
              <React.Fragment>
                <div className="info">{t('[ IN-APP ]')}</div> 
                <div className="command">
                  <label htmlFor="days">{t('days')}</label>
                  <input className="days" type="number" min="1" id="days" value={this.state.days} onChange={this.handleInputChange}/>
                  <button onClick = {(e) => {this.select()}}>{t('SEARCH')}</button>
                </div>
            </React.Fragment>
            :
            this.state.menu==='CONCURRENT-USERS' ? 
              <React.Fragment>
                <div className="info">{t(' CONCURRENT-USERS ]')}</div> 
                <div className="command">
                  <button onClick = {(e) => {this.select()}}>{t('SEARCH')}</button>
                </div>
            </React.Fragment>
            :            
            this.state.menu==='UPLOAD-DATA' ? 
              <React.Fragment>
                <div className="info">{t('[ UPLOAD-DATA ]')}</div> 
                <div className="file">
                  <input type="file" name="file" onChange={e => this.handleFileInput(e)}/>
                </div>
                <div className="command">
                  <button onClick = {(e) => {this.select()}}>UPLOAD</button>
                </div>
            </React.Fragment>   
            :              
            <></>
          }
        </div>

        <div className="right-middle-result">
          <div className="title">{t('RESULT')}
            { this.state.resultRows.length > 0 ? 
            <CSVLink className="export" data={this.state.resultRows} filename={'THE_FOUR_GOD_STAT_'+this.state.menu+'.csv'}>{t('EXPORT')}</CSVLink> : <></> }
          </div>  
          <div className="resultInfo">
          { this.state.resultRows === '' ? '' :
              <React.Fragment>
                <DataGrid 
                  columns={this.state.resultColumns} 
                  rows={this.state.resultRows} 
                  height={20 * (this.state.resultRows.length + 5) } // 50000
                  width={this.state.resultRows.length > 0 ? Object.keys(this.state.resultRows[0]).length * 100 : 0} // 필드 개수 * 100
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
                  //width={1000}
                  //height={this.state.resultRows.length*30} 
                  height={50000}
                  //rowHeight={30} 
                  enableCellSelect={true}
                  //suppressSizeToFit={true}
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

//export default Purchase;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(Purchase);