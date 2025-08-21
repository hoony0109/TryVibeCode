import React, {Component} from 'react';
import ReactSelect from 'react-select';
//import ReactDataGrid from 'react-data-grid';
import { DataGrid } from 'react-data-grid';
import { Toolbar, Data } from "react-data-grid-addons";
import '../styles/react-data-grid.css';
import { CSVLink } from "react-csv";
import { range } from 'lodash';

import '../styles/App.css';
import '../styles/base.scss';

import proxy from '../actions/proxy';

import { withTranslation } from 'react-i18next';

class Log extends Component{

  constructor(props){
    super(props);

    this.state = { 
        topLeft: {},
        botRight: {},

        menu:'',

        page:1,
        nick:'',

        // user
        logWorlds:[],
        logWorld:null,
        logWorldPostfixs:[],
        logWorldPostfix:null,
        logList:[],
        searchingLog:null,

        searchingStartDays: 1,
        searchingStartHours: 0,
        searchingStartMins: 0,
        searchingEndDays: 2,
        searchingEndHours: 0,
        searchingEndMins: 0,

        // filter
        filters : {},

        // result
        resultColumns:'',
        resultRows:''
    }
    document.addEventListener('copy', this.handleCopy);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.handleCopy);
  }

  componentDidMount(){
    let logWorlds = [];
    for(let i=0; i<this.props.location.state.worldNames.length; i++){
      logWorlds.push(this.props.location.state.worldNames[i]);
    }

    let logWorldPostfixs = [];
    let date = new Date()
    let YYYY = date.getFullYear();
    let MM = date.getMonth()+1;
    for(let i=0; i<12; i++){
      let postfix = YYYY.toString() + (MM<10 ? '0' : '') + MM.toString();
      logWorldPostfixs.push({label:postfix,value:postfix});
      if(MM-1 <= 0 ){
        YYYY -= 1;
        MM = 12;
      }
      else MM -= 1;
    }
    this.setState({logWorlds:logWorlds,logWorldPostfixs:logWorldPostfixs}); 
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

        page:1,
        nick:'',

        // user
        logWorld:null,
        logWorldPostfix:null,
        logList:[],
        searchingLog:null,
        searchingStartDays: 1,
        searchingStartHours: 0,
        searchingStartMins: 0,
        searchingEndDays: 2,
        searchingEndHours: 0,
        searchingEndMins: 0,
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

  handleLogWorldChange = (e) => {
    this.setState({
        logWorld: e,
        logWorldPostfix:null,
        logList:[],
        searchingLog:null,
        searchingStartDays: 1,
        searchingStartHours: 0,
        searchingStartMins: 0,
        searchingEndDays: 2,
        searchingEndHours: 0,
        searchingEndMins: 0,
    });
    console.log('set world value : ' +  e.value);
  }

  handleLogWorldPostfixChange = (e) => {
    this.setState({
        logWorldPostfix: e,
        logList:[],
        searchingLog:null,
        searchingStartDays: 1,
        searchingStartHours: 0,
        searchingStartMins: 0,
        searchingEndDays: 2,
        searchingEndHours: 0,
        searchingEndMins: 0,
    });
    console.log('set world postfix value : ' +  e.value);
  }

  handleSearchingLogChange = (e) => {
    this.setState({searchingLog: e});
    console.log('set searching log : ' +  e.value);
  }

  select = () => { 
    if(this.state.menu==='MANAGER'){
      proxy.getManagerLog(this.props.location.state.auth.ukey,this.state.page).then(response => {
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==="USER"){
      if(!this.state.logWorld || !this.state.logWorldPostfix) 
        return;
      if(this.state.logList.length===0){
        let logList = [];
        proxy.getUserLogList(this.props.location.state.auth.ukey,this.state.logWorld.value,this.state.logWorldPostfix.value,).then(response => {
          for(let i=0; i<response.result.length; i++){
            logList.push({label:response.result[i].name,value:response.result[i].name});
          }
          this.setState({logList:logList});
        }).catch(err => {
          console.log(err);
        });
      }
      else if(this.state.searchingLog){
        let startTime = this.state.logWorldPostfix.value.toString();
        startTime += (this.state.searchingStartDays<10 ? '0' + this.state.searchingStartDays : this.state.searchingStartDays);
        startTime += (this.state.searchingStartHours<10 ? '0' + this.state.searchingStartHours : this.state.searchingStartHours);
        startTime += (this.state.searchingStartMins<10 ? '0' + this.state.searchingStartMins : this.state.searchingStartMins) + '00';

        let endTime = this.state.logWorldPostfix.value.toString();
        endTime += (this.state.searchingEndDays<10 ? '0' + this.state.searchingEndDays : this.state.searchingEndDays);
        endTime += (this.state.searchingEndHours<10 ? '0' + this.state.searchingEndHours : this.state.searchingEndHours);
        endTime += (this.state.searchingEndMins<10 ? '0' + this.state.searchingEndMins : this.state.searchingEndMins) + '00';

        proxy.getUserLog(this.props.location.state.auth.ukey,this.state.logWorld.value,this.state.logWorldPostfix.value,this.state.searchingLog.value,Number(startTime),Number(endTime),this.state.page,this.state.nick).then(response => {
          setResult(response.result);
        }).catch(err => {
          console.log(err);
        });
      }
    }

    //result
    let This = this;
    function setResult(result){

      // set cloumns
      let columns = [];

      if(result.length > 0){
        for(let i=0; i<Object.keys(result[0]).length; i++)
        {
          columns.push({key:Object.keys(result[0])[i], name:Object.keys(result[0])[i], filterable:true, resizable:true});
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
    }
  }

  update = (command) => {
  }

  getRows = () => {
    let newProps = {};
    newProps.filters = this.state.filters;
    newProps.rows = this.state.resultRows;
    return Data.Selectors.getRows(newProps);
  }

  rowGetter = i => {
    let rows = this.getRows();
    return rows[i];
  }

  getSize = () => {
    return this.getRows().length;
  }

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }    
    this.setState({ filters: newFilters });
  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴
    return (

      <div className="body"> 

        <div className="left-list">
          <div className="title">{"INDEX"}</div>
          <li onClick = {(e) => {this.setMenu('MANAGER')}}>{t('MANAGER')}</li>
          <li onClick = {(e) => {this.setMenu('USER')}}>{t('USER')}</li>
        </div>

        <div className="right-top-input">
          <div className="title">{t('EDITOR')}</div>  
          { 
            this.state.menu==='MANAGER' ? 
              <React.Fragment>
                <div className="info">{t('[ MANAGER ]')}</div> 
                <div className="command">
                  <label htmlFor="page">{t('page')}</label>
                  <input className="page" type="number" min="1" id="page" value={this.state.page} onChange={this.handleInputChange}/>
                  <button onClick = {(e) => {this.select()}}>{t('SEARCH')}</button>
                </div>
              </React.Fragment>
            :
            this.state.menu==='USER' ? 
              <React.Fragment>
                <div className="info">{t('[ USER ]')}</div> 
                <div className="command">
                  <label htmlFor="sender">{t('select worldIdx')}</label>
                    <ReactSelect className="select" placeholder={t('select world')} value={this.state.logWorld} options={this.state.logWorlds} onChange={this.handleLogWorldChange} />
                    <label htmlFor="sender">{t('select worldIdx postfix (YYYYMM)')}</label>
                    <ReactSelect className="select" placeholder={t('select world postfix')} value={this.state.logWorldPostfix} options={this.state.logWorldPostfixs} onChange={this.handleLogWorldPostfixChange} />
                  <button onClick = {(e) => {this.select()}}>{t('SELECT LOG LIST')}</button>
                  { this.state.logList.length > 0  
                  ? <React.Fragment>
                        <label htmlFor="sender">{t('select log list')}</label>
                            <ReactSelect className="select" placeholder={t('select log')} value={this.state.searchingLog} options={this.state.logList} onChange={this.handleSearchingLogChange} />
                        <label htmlFor="start">{t('searching time (notice: long terms, so slow.)')}</label>
                        
                        <div className="duration">
                            <br></br>
                            <input className="startdays" type="number" min={1} max={31} step="1" id="searchingStartDays" value={this.state.searchingStartDays} onChange={this.handleInputChange}/>
                            <label className="starthours-label">{t('days')}</label>
                            <input className="starthours" type="number" min={0} max={23} step="1" id="searchingStartHours" value={this.state.searchingStartHours} onChange={this.handleInputChange}/>
                            <label className="starthours-label">{' : ' }</label>
                            <input className="startmins" type="number" min={0} max={59} step="1" id="searchingStartMins" value={this.state.searchingStartMins} onChange={this.handleInputChange}/>
                            
                            <label className="end_label">{' ~ '}</label>
                            
                            <input className="enddays" type="number" min={1} max={31} step="1" id="searchingEndDays" value={this.state.searchingEndDays} onChange={this.handleInputChange}/>
                            <label className="starthours-label">{t('days')}</label>
                            <input className="endhours" type="number" min={0} max={23} step="1" id="searchingEndHours" value={this.state.searchingEndHours} onChange={this.handleInputChange}/>
                            <label className="endhours-label">{' : '}</label>
                            <input className="endmins" type="number" min={0} max={59} step="1" id="searchingEndMins" value={this.state.searchingEndMins} onChange={this.handleInputChange}/>
                            
                            <label className="tab-label">{t(' Page ')}</label>
                            <input className="page" type="number" min="1" id="page" value={this.state.page} onChange={this.handleInputChange}/>
                            
                            <label htmlFor="end-label">{t(' nid ')}</label>
                            <input className="end" id="nick" value={this.state.nick} onChange={this.handleInputChange}/>
                        </div>
                        <button onClick = {(e) => {this.select()}}>{t('SELECT')}</button>
                    </React.Fragment> 
                  : <React.Fragment/>
                  }
                </div>
              </React.Fragment>
            : ''

          }
        </div>

        <div className="right-middle-result">
          <div className="title">{t('RESULT')}
            { this.state.resultRows !== '' ? 
            <React.Fragment>
            <CSVLink className="export" data={this.state.resultRows} filename={'THE_FOUR_GOD_LOG_'+this.state.menu+'.csv'}>{t('EXPORT')}</CSVLink>
            </React.Fragment>
            : <></> }
          </div>   
          <div className="resultInfo">
            { this.state.resultRows === '' ? '' :
              <React.Fragment>
                <DataGrid 
                  columns={this.state.resultColumns}                  
                  rows={this.state.resultRows} 
                  height={20 * (this.state.resultRows.length + 5) }
                  width={this.state.resultRows.length > 0 ? Object.keys(this.state.resultRows[0]).length * 145 : 0} // 필드 개수 * 100
                  rowHeight={20}                  
                  toolbar={<Toolbar enableFilter={true} />}
                  onAddFilter={this.handleFilterChange}
                  onClearFilters={() => this.setState({filters:{}})}
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
                  height={50000} 
                  rowHeight={25}
                  rows={this.state.resultRows} 
                  rowGetter={this.rowGetter}
                  rowsCount={this.getSize()}
                  toolbar={<Toolbar enableFilter={true} />}
                  onAddFilter={this.handleFilterChange}
                  onClearFilters={() => this.setState({filters:{}})}
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

//export default Log;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(Log);