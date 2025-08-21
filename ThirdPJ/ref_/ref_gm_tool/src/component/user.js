import React, {Component} from 'react';
import ReactSelect from 'react-select';

import ReactDataGrid from 'react-data-grid';
//import { DataGrid } from 'react-data-grid';
//import DataGrid from 'react-data-grid';
//import ReactDataGrid from 'react-data-grid/dist/react-data-grid';
//import 'react-data-grid/lib/styles.css';
//import '../styles/react-data-grid.css';

import CellActions from '../actions/cellAction'
//import { Edit, Delete, Close } from '@material-ui/icons';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';
import { CSVLink } from "react-csv";
import { range } from 'lodash';

import Popup from "reactjs-popup";

import '../styles/App.css';
import '../styles/base.scss';

import proxy from '../actions/proxy';

import { withTranslation } from 'react-i18next';

class User extends Component{

  constructor(props){
    super(props);
        
    this.state = { 
      topLeft: {},
      botRight: {},

      menu:'',
      command:'',
      page:1,

      searchType:0,

      isPopupEdit:false,
      editRow:[],

 //-------------------------------------------------------------
      // new

      //
      noticeWorlds:[],
      noticeWorld:null,

      userIdxAccount:'',

//-------------------------------------------------------------



      // account
      accountId:'',
      accountIdx:null,
      accountBlock:false,
      accountBlockHours:0,
      accountBlockReason:'',

      // for account searching
      worldIdxs:null,
      characterNick:'',
      gameAccountID:'',
      gameUserId:'',

      // user
      userIdxs:[],
      userIdx:null,
      userChatBlock:false,
      userChatBlockMins:0,
      userChatBlockReason:'',

      // character
      characterIdx:null,
      characterIdxs:[],

      // result
      resultColumns:[],
      resultRows:[],

      // post
      postSender:'',
      postMsg:'',
      postValidDays:0,
      postItem:null,
      postItemValue:0
     
    }

    document.addEventListener('copy', this.handleCopy);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.handleCopy);
  }

  init(){
    this.setState({
      searchType:0,
      accountId:'',
      accountIdx:null,
      worldIdxs:null,
      characterNick:'',
    });
  }

  componentDidMount(){
    let noticeWorlds = [];
    noticeWorlds.push({label:'all',value:0});
    for(let i=0; i<this.props.location.state.worldNames.length; i++){
      noticeWorlds.push(this.props.location.state.worldNames[i]);
    }
    this.setState({noticeWorlds:noticeWorlds}); 
  }
  
  handleNoticeWorldChange = (e) => {
    this.setState({noticeWorld: e});
    console.log('set world value : ' +  e.value);
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
      command:'',
      page:1,

      resultColumns:[],
      resultRows:[],

      // account block
      accountBlock:false,
      accountBlockHours:0,
      accountBlockReason:'',

      // user chat block
      userChatBlock:false,
      userChatBlockMins:0,
      userChatBlockReason:'',

      // post
      postSender:'',
      postMsg:'',
      postValidDays:0,
      postItem:null,
      postItemValue:0,
    });
    console.log('set menu : ' + menu);
  }

  handleInputChange = (e) => {
    if(e.target.type === 'number'){
      this.setState({[e.target.id] : e.target.valueAsNumber });
      console.log('set ' + e.target.id +' input : ' +  e.target.valueAsNumber);
    }
    else {
      this.setState({[e.target.id] : e.target.value });
      console.log('set ' + e.target.id +' input : ' +  e.target.value);
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.select();
    }
  }

  handleWorldIdxChange = (e) => {
    this.setState({worldIdxs: e});
    console.log('set worldIdxs value : ' +  e.value);
  }

  handleSearchTypeChange(event) {
    this.setState({ resultRows: '' });
  }

  handleUserIdxChange = (e) => {
    this.setMenu(this.state.menu);
    this.setState({userIdx:e});
    console.log('set userIdx value : ' + e.value + ' worldIdx : ' + e.worldIdx);
  }

  handleCharacterIdxChange = (e) => {
    this.setMenu(this.state.menu);
    this.setState({characterIdx: e});
    console.log('set characterIdx value : ' +  e.value);
  }

  handlePostItemChange = (e) => {
    this.setState({postItem: e});
    console.log('set postItemId value : ' +  e.value);
  }

  validItem = (itemId,itemValue) => {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    if(itemId === 0 && itemValue === 0) return (true);
    else if (itemId > 0 && itemValue > 0){
      for(let i=0; i<this.props.location.state.itemNames.length; i++){
        if(Number(itemId) === Number(this.props.location.state.itemNames[i].value))
          return (true);
      }
    }
    window.alert(t('You have entered an invalid item!'));
    return (false);
  }

  select = () => { 
    if(this.state.menu==='ACCOUNT'){
      if(this.state.searchType === 0) {
        proxy.getAccount(this.props.location.state.auth.ukey,this.state.accountId).then(response => {
          if(response.result.length > 0){
            this.setState({accountIdx:response.result[0].account_idx,accountBlock:response.result[0].account_status>0});
            let user_idx = [];
            for(let i=0; i<response.result.length; i++){
              user_idx.push({label:response.result[i].game_user_idx + ' (world:'+response.result[i].world_idx+')', value:response.result[i].game_user_idx, worldIdx:response.result[i].world_idx});
            }
            if(user_idx.length > 0)
              this.setState({userIdx:user_idx[0], userIdxs:user_idx});
          }
          setResult(response.result);
        }).catch(err => {
          console.log(err);
        });
      }
      else if(this.state.searchType === 1){
        console.log(this.state.gameAccountID);
        proxy.getAccountByGameAccountID(this.props.location.state.auth.ukey,this.state.gameAccountID).then(response => {
          if(response.result.length > 0){
            this.setState({accountIdx:response.result[0].account_idx,accountBlock:response.result[0].account_status>0});
            let user_idx = [];
            for(let i=0; i<response.result.length; i++){
              user_idx.push({label:response.result[i].game_user_idx + ' (world:'+response.result[i].world_idx+')', value:response.result[i].game_user_idx, worldIdx:response.result[i].world_idx});
            }
            if(user_idx.length > 0)
              this.setState({userIdx:user_idx[0], userIdxs:user_idx});
          }
          setResult(response.result);
        }).catch(err => {
          console.log(err);
        });
      }      
      else if(this.state.searchType === 2){
        proxy.getAccountByGameUserId(this.props.location.state.auth.ukey,this.state.gameUserId).then(response => {
          if(response.result.length > 0){
            this.setState({accountIdx:response.result[0].account_idx,accountBlock:response.result[0].account_status>0});
            let user_idx = [];
            for(let i=0; i<response.result.length; i++){
              user_idx.push({label:response.result[i].game_user_idx + ' (world:'+response.result[i].world_idx+')', value:response.result[i].game_user_idx, worldIdx:response.result[i].world_idx});
            }
            if(user_idx.length > 0)
              this.setState({userIdx:user_idx[0], userIdxs:user_idx});
          }
          setResult(response.result);
        }).catch(err => {
          console.log(err);
        });
      }
      else{
        proxy.getAccountByWorldnNick(this.props.location.state.auth.ukey,this.state.worldIdxs.value,this.state.characterNick).then(response => {
          if(response.result.length > 0){
            this.setState({accountIdx:response.result[0].account_idx,accountBlock:response.result[0].account_status>0});
            let user_idx = [];
            for(let i=0; i<response.result.length; i++){
              user_idx.push({label:response.result[i].game_user_idx + ' (world:'+response.result[i].world_idx+')', value:response.result[i].game_user_idx, worldIdx:response.result[i].world_idx});
            }
            if(user_idx.length > 0)
              this.setState({userIdx:user_idx[0], userIdxs:user_idx});
          }
          setResult(response.result);
        }).catch(err => {
          console.log(err);
        });
      }
    }
    else if(this.state.menu==='USER'){
      //proxy.getUser(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value) //
      console.log('[DEBUG] getUser 파라미터:', {
        ukey: this.props.location.state.auth.ukey,
        noticeWorld: this.state.noticeWorld,
        userIdxAccount: this.state.userIdxAccount
      });
      proxy.getUser(this.props.location.state.auth.ukey,this.state.noticeWorld,this.state.userIdxAccount) //
      .then(response => {
        console.log('[DEBUG] getUser 응답:', response);
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_TITLE'){
      proxy.getUserTitle(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        setResult(response.result); 
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_POST'){
      proxy.getUserPost(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.page).then(response => {
        setResult(response.result); 
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_CHAT_BLOCK'){
      proxy.getUserChatBlock(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        if(response.result.length > 0)
          this.setState({userChatBlock:true});
        else
          this.setState({userChatBlock:false}); 
        setResult(response.result); 
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_IAP'){
      proxy.getUserIAP(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        setResult(response.result); 
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_COMBAT'){
      proxy.geUserCombat(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_COMBAT_RIVALS'){
      proxy.getUserCombatRivals(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_CHARACTER'){
      proxy.getCharacter(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value).then(response => {
        let character_idxs = [];
        for(let i=0; i<response.result.length; i++){
          character_idxs.push({label:response.result[i].char_idx + ' (type:'+response.result[i].char_type+')', value:response.result[i].char_idx});
        }
        this.setState({ characterIdx:character_idxs[0], characterIdxs:character_idxs,});
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_BAG'){
      proxy.getCharacterBag(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_EQUIP'){
      proxy.getCharacterEquip(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_ITEM'){
      proxy.getCharacterItem(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_SKILL'){
      proxy.getCharacterSkill(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_SKILLBOOK'){
      proxy.getCharacterSkillbook(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_BEADS'){
      proxy.getCharacterBeads(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_VEHICLE'){
      proxy.getCharacterVehicle(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_VEHICLE_ACCESSORY'){
      proxy.getCharacterVehicleAccessory(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_QUEST'){
      proxy.getCharacterQuest(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_CLEAR_QUEST'){
      proxy.getCharacterQuestClear(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_SCROLL_QUEST'){
      proxy.getCharacterQuestScroll(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_SEAL_STAGE'){
      proxy.getCharacterStageSeal(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CHARACTER_GROWTH_STAGE'){
      proxy.getCharacterStageGrowth(this.props.location.state.auth.ukey,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value).then(response => {
        setResult(response.result);
      }).catch(err => {
        console.log(err);
      });
    }

    function isExplicitStringByKey(key) {
      if(key === 'product_id'){
        return true;
      }

      return false;
    }    

    //result
    let This = this;
    function setResult(result){

      // set cloumns
      let columns = [];

      if(result.length > 0){
        // USER 메뉴일 때는 모든 key를 columns로 추가
        if(This.state.menu === 'USER') {
          Object.keys(result[0]).forEach(key => {
            columns.push({key: key, name: key, resizable: true});
          });
        } else {
          // 기존 로직 유지
          for(let i=0; i<Object.keys(result[0]).length; i++)
          {
            if(Object.keys(result[0])[i] === 'char_name')
              continue;

            if(Object.keys(result[0])[i] === 'char_level')
              continue;

            if(Object.keys(result[0])[i] === 'item_name')
              continue;
            
            if(Object.keys(result[0])[i] === 'title_name')
              continue;

            if(Object.keys(result[0])[i] === 'skill_name')
              continue;

            columns.push({key:Object.keys(result[0])[i], name:Object.keys(result[0])[i], resizable:true});

            if(Object.keys(result[0])[i] === 'char_type'){
              columns.push({key:'char_name', name:'char_name', resizable:true});
            }
            else if(Object.keys(result[0])[i] === 'char_exp'){
              columns.push({key:'char_level', name:'char_level', resizable:true});
            }
            else if(Object.keys(result[0])[i] === 'item_id'){
              columns.push({key:'item_name', name:'item_name', resizable:true});
            }
            else if(Object.keys(result[0])[i] === 'title_id'){
              columns.push({key:'title_name', name:'title_name', resizable:true});
            }
            else if(Object.keys(result[0])[i] === 'skill_id'){
              columns.push({key:'skill_name', name:'skill_name', resizable:true});
            }
          }
        }

        // delete user post
        if(This.state.menu==='USER_POST'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Delete />,
                  callback: () => {
                    This.commandRow('DELETE_POST',row);
                  }
                }
              ];
              return ( <CellActions actions={actions} /> );
            } 
          });
        }
        // edit character pos 
        else if(This.state.menu ==='USER_CHARACTER'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Edit />,
                  callback: () => {
                    This.commandRow('EDIT_POS',row);
                  }
                }
              ];
              return ( <CellActions actions={actions} /> );
            } 
          });
        }
        // edit purchase item
        else if(This.state.menu ==='USER_IAP'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Edit />,
                  callback: () => {
                    This.commandRow('EDIT_IAP',row);
                  }
                }
              ];
              return ( <CellActions actions={actions} /> );
            } 
          });
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
              else if(isExplicitStringByKey(key)){
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

        This.setState({resultColumns:columns, resultRows:result, isPopupEdit:false }); 
      }
      else{
        columns.push({key:'result', name:'result'});
        This.setState({resultColumns:columns, resultRows:[{result:'no data'}], isPopupEdit:false});
      }
      console.log(This.state.menu + ' execute result :' + JSON.stringify(This.state.resultRows));  
    }
  }

  update = (command) => {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    if(this.state.menu==='ACCOUNT'){
      proxy.setAccount(this.props.location.state.auth.ukey,command,this.state.accountIdx,this.state.accountBlockHours,this.state.accountBlockReason).then(response => {
        /*
        let columns = [];
        columns.push({key:'result', name:'result'});
        this.setState({resultColumns:columns, resultRows:[{result:'success'}] });
        this.init();
        this.setMenu(this.state.menu);
        */
        window.alert(t('Success!'));
        if(command === 'ACCOUNT_LOGOFF'){
          this.init();
          this.setMenu(this.state.menu);
        }
        else this.select();
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_POST'){
      if(command==='SEND_POST'){
        if(this.props.location.state.auth.grade !== 0 && this.props.location.state.auth.grade !== 1){
          let itemId = this.state.postItem ? this.state.postItem.value : 0;
          if(itemId === 50000002)
          {
            window.alert(t('50000002(Blue Ruby) is for admin only!'));  
            return;
          }
        }
        if(window.confirm(t('Are you send post to user?'))){
          let itemId = this.state.postItem ? this.state.postItem.value : 0;
          let itemValue = this.state.postItemValue;
          let isValidItem = this.validItem(itemId,itemValue);
          if(!isValidItem) return;
          proxy.setUserPost(this.props.location.state.auth.ukey,command,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.postSender,this.state.postMsg,this.state.postValidDays,itemId,itemValue).then(response => {
            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }          
      }
    }
    else if(this.state.menu==='USER_IAP'){
      if(command === 'IAP_GIVE_COMPLETE'){
        if(window.confirm(t('Are you give IAP complete?'))){
          proxy.setUserIAPGiveComplete(this.props.location.state.auth.ukey,command,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.editRow.txid,this.state.editRow.give_complete).then(response => {
            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    else if(this.state.menu==='USER_CHAT_BLOCK'){
      proxy.setUserChatBlock(this.props.location.state.auth.ukey,command,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.userChatBlockMins,this.state.userChatBlockReason).then(response => {
        /*
        let columns = [];
        columns.push({key:'result', name:'result'});
        this.setState({resultColumns:columns, resultRows:[{result:'success'}] });
        */
        window.alert(t('Success!'));
        this.select();
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='USER_CHARACTER'){
      if(command === 'CHARACTER_CHANGE_POS'){
        if(window.confirm(t('Are you change character position?'))){
          proxy.setCharacterPos(this.props.location.state.auth.ukey,command,this.state.userIdx.worldIdx,this.state.userIdx.value,this.state.characterIdx.value,this.state.editRow.region_pos_x,this.state.editRow.region_pos_z,this.state.editRow.current_stage).then(response => {
            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
  }

  commandRow = (command,row) => {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    if(this.state.menu==='USER_POST'){
      if(command === 'DELETE_POST'){
        if(window.confirm(t('Are you delete post?'))===true){
          proxy.deleteUserPost(this.props.location.state.auth.ukey,command,this.state.userIdx.worldIdx,row.post_idx,row.user_idx).then(response => {
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    else if(this.state.menu==='USER_CHARACTER'){
      if(command === 'EDIT_POS'){
        this.setState({isPopupEdit:true,editRow:row});
      }
    }
    else if(this.state.menu==='USER_IAP'){
      if(command === 'EDIT_IAP'){
        this.setState({isPopupEdit:true,editRow:row});
      }
    }
  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    return (

      <div className="body"> 
      
        <div className="left-list">
          <div className="title">{"INDEX"}</div>
          <li onClick = {(e) => {this.setMenu('ACCOUNT')}}>{t('ACCOUNT')}</li>
          <ul>
            <li onClick = {(e) => {this.setMenu('USER')}}>{t('USER')}</li>
            <li onClick = {(e) => {this.setMenu('USER_TITLE')}}>{t('TITLE')}</li>
            <li onClick = {(e) => {this.setMenu('USER_POST')}}>{t('POST')}</li>
            <li onClick = {(e) => {this.setMenu('USER_CHAT_BLOCK')}}>{t('CHAT_BLOCK')}</li>
            <li onClick = {(e) => {this.setMenu('USER_IAP')}}>{t('IN_APP_PURCHASE')}</li>
            <li onClick = {(e) => {this.setMenu('USER_COMBAT')}}>{t('COMBAT')}</li>
            <li onClick = {(e) => {this.setMenu('USER_COMBAT_RIVALS')}}>{t('COMBAT_RIVALS')}</li>
            <li onClick = {(e) => {this.setMenu('USER_CHARACTER')}}>{t('CHARACTER')}</li>
              <ul>
                <li onClick = {(e) => {this.setMenu('CHARACTER_BAG')}}>{t('WAREHOUSE')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_EQUIP')}}>{t('EQUIPMENT')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_ITEM')}}>{t('BAG')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_SKILL')}}>{t('SKILL')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_SKILLBOOK')}}>{t('SKILLBOOK')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_BEADS')}}>{t('BEADS')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_VEHICLE')}}>{t('VEHICLE')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_VEHICLE_ACCESSORY')}}>{t('VEHICLE_ACC')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_QUEST')}}>{t('QUEST')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_CLEAR_QUEST')}}>{t('CLEAR_QUEST')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_SCROLL_QUEST')}}>{t('SCROLL_QUEST')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_SEAL_STAGE')}}>{t('SEAL_STAGE')}</li>
                <li onClick = {(e) => {this.setMenu('CHARACTER_GROWTH_STAGE')}}>{t('GROWTH_STAGE')}</li>
              </ul>
          </ul>
        </div>

        <div className="right-top-input">
          <div className="title">{"EDITOR"}</div>
          {
            this.state.menu==='ACCOUNT' ? 
              <React.Fragment>
                <div className="info">{t('[ ACCOUNT ]')}</div> 
                <div className="search">
                  <label htmlFor="switch">{t('# Choose search type')}</label>
                  <div className="searchuser">
                    <label>
                      <input 
                        type="radio" 
                        value="0" 
                        checked={this.state.searchType === 0} 
                        onChange={(e) => {this.setState({searchType:0,resultRows:''});}}
                      /> {t('QuickSDK Account ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="1" 
                        checked={this.state.searchType === 1} 
                        onChange={(e) => {this.setState({searchType:1,resultRows:''});}}
                      /> {t('Game Account ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="2" 
                        checked={this.state.searchType === 2} 
                        onChange={(e) => {this.setState({searchType:2,resultRows:''});}}
                      /> {t('World User ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="3" 
                        checked={this.state.searchType === 3} 
                        onChange= {(e) => {this.setState({searchType:3,resultRows:''});}}
                      /> {t('Nickname')}
                    </label>
                  </div>
                  <br />
                    {this.state.searchType === 0 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="accountId">{t('Platform Account ID')}</label>
                          <input className="input" placeholder={t('input platform account id')} id="accountId" value={this.state.accountId} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      this.state.searchType === 1 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="gameAccountID">{t('Game Account ID')}</label>
                          <input type="text" placeholder={t('input game account id')} id="gameAccountID" value={this.state.gameAccountID} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      this.state.searchType === 2 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="gameUserId">{t('Game User ID')}</label>
                          <input type="text" placeholder={t('input world user id')} id="gameUserId" value={this.state.gameUserId} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <div className="input-group">
                          <div className="input-world">
                            <label htmlFor="worldIdx">{t('select world')}</label>
                            <ReactSelect className="select-world-custom" placeholder={t('select world')} value={this.state.worldIdx} options={this.props.location.state.worldNames} onChange={this.handleWorldIdxChange} />
                          </div>
                          <div className="input-character">
                            <label htmlFor="characterNick">{t('Character Name')}</label>
                            <input type="text" placeholder={t('input character nickname')} id="characterNick" value={this.state.characterNick} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                          </div>
                        </div>
                      </React.Fragment>
                    }                  
                </div>                
              { this.state.resultRows === ''
              ? <button onClick = {this.select}>{t('SEARCH')}</button> 
              : <div className="command">
                  <button onClick = {(e) => {this.update('ACCOUNT_LOGOFF')}}>{t('LOGOFF')}</button>
                  { !this.state.accountBlock 
                    ? <React.Fragment>
                      <br/><br/>
                      <label htmlFor="accountBlockHours">{t('block hours')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input block hours')} id="accountBlockHours" value={this.state.accountBlockHours} onChange={this.handleInputChange}/> 
                      <label htmlFor="sender">{t('reason')}</label>
                      <input className="msg" type="text" placeholder={t('input reason')} id="accountBlockReason" value={this.state.accountBlockReason} onChange={this.handleInputChange}/>
                      <button onClick = {(e) => {this.update('ACCOUNT_BLOCK')}}>{t('BLOCK')}</button>
                      </React.Fragment>
                    : <React.Fragment>
                      <br/><br/>
                      <button onClick = {(e) => {this.update('ACCOUNT_UNBLOCK')}}>{t('UNBLOCK')}</button>
                      </React.Fragment>
                  }
                </div>
              }
              </React.Fragment>
            : 
            this.state.menu==='USER' ? 
              <React.Fragment>
                <div className="info">{t('[ USER INFO ]')}</div> 
                <div className="search">
                <label htmlFor="sender">{t('select world')}</label>
                  <ReactSelect className="select" placeholder={t('select world')} value={this.state.noticeWorld} options={this.state.noticeWorlds} onChange={this.handleNoticeWorldChange} />
                </div>

                <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <input className="msg" type="text" placeholder={t('input message')} id="userIdxAccount" value={this.state.userIdxAccount} onChange={this.handleInputChange}/> 
                </div>
                {/* <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" value={this.state.userIdx} options={this.state.userIdxs} onChange={this.handleUserIdxChange}/>
                </div> */}

                { (this.state.noticeWorld && this.state.userIdxAccount) ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='USER_TITLE' ? 
              <React.Fragment>
                <div className="info">{t('[ USER TITLE ]')}</div> 
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" value={this.state.userIdx} options={this.state.userIdxs} onChange={this.handleUserIdxChange}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='USER_POST' ? 
              <React.Fragment>
                <div className="info">{t('[ USER POST ]')}</div> 
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" value={this.state.userIdx} options={this.state.userIdxs} onChange={this.handleUserIdxChange}/>
                  <label htmlFor="page">{t('page')}</label>
                  <input className="page" type="number" min="1" id="page" value={this.state.page} onChange={this.handleInputChange}/>
                </div>
                <button onClick = {this.select}>{t('SEARCH')}</button> 
                { this.state.userIdx !== null 
                ? <div className="command">
                    <label htmlFor="sender">{t('sender name')}</label>
                    <input type="text" placeholder={t('input sender name')} id="postSender" value={this.state.postSender} onChange={this.handleInputChange}/>
                    <label htmlFor="sender">{t('post message')}</label>
                    <input className="msg" type="text" placeholder={t('input message')} id="postMsg" value={this.state.postMsg} onChange={this.handleInputChange}/>
                    <label htmlFor="sender">{t('expires days')}</label>
                    <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input expires days')} id="postValidDays" value={this.state.postValidDays} onChange={this.handleInputChange}/> 
                    <label htmlFor="sender">{t('attached item')}</label>
                    <ReactSelect className="select" placeholder={t('select item')} value={this.state.postItem} options={this.props.location.state.itemNames} onChange={this.handlePostItemChange}/>
                    <label htmlFor="sender">{t('attached item value')}</label>
                    <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input item value')} id="postItemValue" value={this.state.postItemValue} onChange={this.handleInputChange}/> 
                    <button onClick = {(e) => {this.update('SEND_POST')}}>{t('SEND POST')}</button>
                  </div>
                : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='USER_CHAT_BLOCK' ? 
              <React.Fragment>
                <div className="info">{t('[ USER CHAT BLOCK ]')}</div> 
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" value={this.state.userIdx} options={this.state.userIdxs} onChange={this.handleUserIdxChange}/>
                </div>
                <button onClick = {this.select}>{t('SEARCH')}</button> 
                { this.state.userIdx !== null  
                ? <div className="command">
                  { !this.state.userChatBlock 
                    ? <React.Fragment>
                      <label htmlFor="sender">{t('block mins')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input block mins')} id="userChatBlockMins" value={this.state.userChatBlockMins} onChange={this.handleInputChange}/> 
                      <label htmlFor="sender">{t('reason')}</label>
                      <input className="msg" type="text" placeholder={t('input reason')} id="userChatBlockReason" value={this.state.userChatBlockReason} onChange={this.handleInputChange}/>
                      <button onClick = {(e) => {this.update('USER_CHAT_BLOCK')}}>{t('CHAT BLOCK')}</button>
                      </React.Fragment>
                    : <button onClick = {(e) => {this.update('USER_CHAT_UNBLOCK')}}>{t('v')}</button>
                  }
                </div>
                : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='USER_IAP' ? 
              <React.Fragment>
                <div className="info">{t('[ USER IN-APP PURCHASE ]')}</div> 
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : 
                  <React.Fragment>
                    <Popup open={this.state.isPopupEdit} modal={true} contentStyle={{width:'auto'}} closeOnDocumentClick onClose={() => { this.setState({isPopupEdit:false}); }}>
                      <div className="contents">
                        <Close className="close" onClick={() => { this.setState({isPopupEdit:false}); }}/>
                        <label htmlFor="give_complete">{t('give_complete')}</label>
                        <input className="input" id="give_complete" value={this.state.editRow.give_complete} onChange={(e)=>{let row=this.state.editRow; row['give_complete']=e.target.value; this.setState({editRow:row});} }/> 
                        <button onClick = {(e) => {this.update('IAP_GIVE_COMPLETE')}}>{t('EDIT')}</button>
                      </div>
                    </Popup> 
                  </React.Fragment>
                }
              </React.Fragment>
            :
            this.state.menu==='USER_COMBAT' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER COMBAT ]')}</div> 
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='USER_COMBAT_RIVALS' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER COMBAT RIVALS ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='USER_CHARACTER' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : 
                  <React.Fragment>
                    <Popup open={this.state.isPopupEdit} modal={true} contentStyle={{width:'auto'}} closeOnDocumentClick onClose={() => { this.setState({isPopupEdit:false}); }}>
                      <div className="contents">
                        <Close className="close" onClick={() => { this.setState({isPopupEdit:false}); }}/>
                        <label htmlFor="region_pos_x">{t('region_pos_x')}</label>
                        <input className="input" id="region_pos_x" value={this.state.editRow.region_pos_x} onChange={(e)=>{let row=this.state.editRow; row['region_pos_x']=e.target.value; this.setState({editRow:row});} }/> 
                        <label htmlFor="region_pos_z">{t('region_pos_z')}</label>
                        <input className="input" id="region_pos_z" value={this.state.editRow.region_pos_z} onChange={(e)=>{let row=this.state.editRow; row['region_pos_z']=e.target.value; this.setState({editRow:row});} }/>  
                        <label htmlFor="current_stage">{t('current_stage')}</label>
                        <input className="input" id="current_stage" value={this.state.editRow.current_stage} onChange={(e)=>{let row=this.state.editRow; row['current_stage']=e.target.value; this.setState({editRow:row});} }/> 
                        <button onClick = {(e) => {this.update('CHARACTER_CHANGE_POS')}}>{t('EDIT')}</button>
                      </div>
                    </Popup> 
                  </React.Fragment>
                }
              </React.Fragment>
            : 
            this.state.menu==='CHARACTER_BAG' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER WAREHOUSE ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                  <label htmlFor="characterIdx">{t('select character idx')}</label>
                  <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='CHARACTER_EQUIP' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER EQUIPMENT ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                  <label htmlFor="characterIdx">{t('select character idx')}</label>
                  <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
              : 
              this.state.menu==='CHARACTER_ITEM' ? 
                <React.Fragment>
                  <div className="info">{t('[ CHARACTER BAG ]')}</div>
                  <div className="search">
                    <label htmlFor="userIdx">{t('select user idx')}</label>
                    <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                    <label htmlFor="characterIdx">{t('select character idx')}</label>
                    <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                  </div>
                  { this.state.resultRows === '' ? 
                    <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                  }
                </React.Fragment>
            : 
            this.state.menu==='CHARACTER_SKILL' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER SKILL ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                  <label htmlFor="characterIdx">{t('select character idx')}</label>
                  <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='CHARACTER_SKILLBOOK' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER SKILLBOOK ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                  <label htmlFor="characterIdx">{t('select character idx')}</label>
                  <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            : 
            this.state.menu==='CHARACTER_BEADS' ? 
              <React.Fragment>
                <div className="info">{t('[ CHARACTER BEADS ]')}</div>
                <div className="search">
                  <label htmlFor="userIdx">{t('select user idx')}</label>
                  <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                  <label htmlFor="characterIdx">{t('select character idx')}</label>
                  <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
                </div>
                { this.state.resultRows === '' ? 
                  <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
                }
              </React.Fragment>
            :
            this.state.menu==='CHARACTER_VEHICLE' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER VEHICLE ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            :
            this.state.menu==='CHARACTER_VEHICLE_ACCESSORY' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER VEHICLE ACCESSORY ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            :
            this.state.menu==='CHARACTER_QUEST' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER QUEST ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='CHARACTER_CLEAR_QUEST' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER CLEAR QUEST ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='CHARACTER_SCROLL_QUEST' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER SCROLL QUEST ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='CHARACTER_SEAL_STAGE' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER SEAL STAGE ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            this.state.menu==='CHARACTER_GROWTH_STAGE' ? 
            <React.Fragment>
              <div className="info">{t('[ CHARACTER GROWTH STAGE ]')}</div>
              <div className="search">
                <label htmlFor="userIdx">{t('select user idx')}</label>
                <ReactSelect className="select" onChange={this.handleUserIdxChange} value={this.state.userIdx} options={this.state.userIdxs}/>
                <label htmlFor="characterIdx">{t('select character idx')}</label>
                <ReactSelect className="select" onChange={this.handleCharacterIdxChange} value={this.state.characterIdx} options={this.state.characterIdxs}/>
              </div>
              { this.state.resultRows === '' ? 
                <button onClick = {this.select}>{t('SEARCH')}</button> : '' 
              }
            </React.Fragment>
            : 
            ''
          } 
        </div>

        <div className="right-middle-result">
          <div className="title">{"RESULT"}
            { this.state.resultRows.length > 0 ? 
            <CSVLink className="export" data={this.state.resultRows} filename={'THE_LAGHAIM_USER_'+this.state.menu+'.csv'}>{t('EXPORT')}</CSVLink> : <></> }
          </div>  
          <div className="resultInfo">
          
            {
              Array.isArray(this.state.resultRows) && this.state.resultRows.length > 0 && Array.isArray(this.state.resultColumns) && this.state.resultColumns.length > 0 && (
                <ReactDataGrid
                  columns={this.state.resultColumns}
                  rows={this.state.resultRows}
                  enableCellSelect
                  cellRangeSelection={{
                    onComplete: s => this.onSelectionCell({ topLeft: s, bottomRight: s })
                  }}
                  rowHeight={40}
                  minHeight={400}
                  minWidth={800}
                />
              )
            }
          
          </div>
        </div>
      </div>

    );
  }
}

//export default User;
// withTranslation으로 컴포넌트 래핑
export default withTranslation()(User);