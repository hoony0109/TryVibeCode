import React, {Component} from 'react';
import ReactSelect from 'react-select';
import Switch from "react-switch";
//import ReactDataGrid from 'react-data-grid';
import { DataGrid } from 'react-data-grid';
import Modal from 'react-modal';  // 모달 추가

import ReactDatetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import '../styles/react-data-grid.css';
import CellActions from '../actions/cellAction'
//import { Delete } from '@material-ui/icons';
//import { Edit } from '@material-ui/icons';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { CSVLink } from "react-csv";
import { range } from 'lodash';
import { ExcelRenderer } from 'react-excel-renderer';

import { withTranslation } from 'react-i18next';


import '../styles/App.css';
import '../styles/base.scss';
import "../styles/custom.css";

import proxy from '../actions/proxy';
import datetime from '../actions/datetime';


class CS extends Component{
  
  constructor(props){
    super(props);

    this.state = { 
      topLeft: {},
      botRight: {},

      menu:'',
      command:'',
 
      // post
      postSender:'',
      postMsg:'',
      postValidDays:0,
      postItem:null,
      postItemValue:0,

      // notice
      noticeWorlds:[],
      noticeWorld:null,
      noticeMsg:'',
      noticeReservation:false,
      noticeStartime:0,
      noticeTerm:1,
      noticeCount:1,

      // 기존 상태 유지
      couponMakeShowModal : false,      // 모달 상태 추가
      couponMakeQty : 1,  // 생성할 쿠폰 개수

      // coupon
      couponID:0,         // 쿠폰 정의 정보 ID
      couponDesc:'',
      couponCode:'',      // 실제 쿠폰 번호
      couponType:0,
      couponStartTime:0,
      couponEndTime:0,
      couponStartDatetime: new Date(),
      couponEndDatetime: new Date(),
      couponPostKeepDay:7,
      couponPostSender:'GM',
      couponPostMsg:'',
      couponPostTextID:0,
      couponRewardGold:0,   // 금전
      couponRewardCashA:0,  // 푸른수정
      couponRewardCashB:0,  // 붉은수정
      couponRewardItem_1:null,
      couponRewardItem_1_Value:0,
      couponRewardItem_2:null,
      couponRewardItem_2_Value:0,
      couponRewardItem_3:null,
      couponRewardItem_3_Value:0,
      couponRewardItem_4:null,
      couponRewardItem_4_Value:0,
      couponRewardItem_5:null,
      couponRewardItem_5_Value:0,
      couponRewardItem_6:null,
      couponRewardItem_6_Value:0,
      couponRewardItem_7:null,
      couponRewardItem_7_Value:0,
      couponRewardItem_8:null,
      couponRewardItem_8_Value:0,
      couponRewardItem_9:null,
      couponRewardItem_9_Value:0,
      couponRewardItem_10:null,
      couponRewardItem_10_Value:0,
      couponRewardItem_11:null,
      couponRewardItem_11_Value:0,
      couponRewardItem_12:null,
      couponRewardItem_12_Value:0,
      couponRewardItem_13:null,
      couponRewardItem_13_Value:0,
      couponRewardItem_14:null,
      couponRewardItem_14_Value:0,
      couponRewardItem_15:null,
      couponRewardItem_15_Value:0,
      couponRewardItem_16:null,
      couponRewardItem_16_Value:0,
      couponRewardItem_17:null,
      couponRewardItem_17_Value:0,
      couponRewardItem_18:null,
      couponRewardItem_18_Value:0,
      couponRewardItem_19:null,
      couponRewardItem_19_Value:0,
      couponRewardItem_20:null,
      couponRewardItem_20_Value:0,
      
      // 쿠폰 use 검색
      searchUsedCouponType: 0,                // 사용된 쿠폰 조회 타입
      searchUsedCouponCode: '',               // 사용된 쿠폰 번호
      searchUsedCouponPlatformAccountID: '',  // 사용한 유저 플랫폼 계정 고유 번호
      searchUsedCouponAccountID: '',          // 사용한 유저 계정 고유 번호
      searchUsedCouponUserID: '',             // 사용한 유저 월드 고유 번호
      searchUsedCouponWorldID: null,             // 월드 번호
      searchUsedCouponCharacterName: '',      // 캐릭명

      // _QIANHUAN_MAIL
      qianhuanMailID:0,
      qianhuanMailRewardItem_1:null,
      qianhuanMailRewardItem_1_Value:0,
      qianhuanMailRewardItem_2:null,
      qianhuanMailRewardItem_2_Value:0,
      qianhuanMailRewardItem_3:null,
      qianhuanMailRewardItem_3_Value:0,
      qianhuanMailRewardItem_4:null,
      qianhuanMailRewardItem_4_Value:0,
      qianhuanMailRewardItem_5:null,
      qianhuanMailRewardItem_5_Value:0,
      qianhuanMailRewardItem_6:null,
      qianhuanMailRewardItem_6_Value:0,
      qianhuanMailRewardItem_7:null,
      qianhuanMailRewardItem_7_Value:0,
      qianhuanMailRewardItem_8:null,
      qianhuanMailRewardItem_8_Value:0,
      qianhuanMailRewardItem_9:null,
      qianhuanMailRewardItem_9_Value:0,
      qianhuanMailRewardItem_10:null,
      qianhuanMailRewardItem_10_Value:0,

      // _COMPLAINT
      complaint_selectedRow: {
        complaintID: '',
        complaintDate: '',
        worldID: 0,
        userID: 0,
        nickname: '',
        targetUserID: 0,
        targetNickname: '',
        complaintMsg: '',
        complaintChat: ''        
      },
      snackbarOpen: false,
      snackbarMessage: '',

      // block ip
      ipBlock:'',
      ipUnBlock:'',
      ipBlockHours:0,
      ipBlockReason:'',

      // server state (-1:no check 0:ok 0>:block)
      serverState:-1,
      serverBlockStarttime:0,
      serverBlockEndtime:0,

      clientVersion:'',

      // result
      resultColumns:'',
      resultRows:'',

      rightMiddleResultHeight: window.innerHeight * 0.54 // 초기값 설정 (예시로 창의 높이의 60%로 설정)

    }

    // 창 크기가 변경될 때 이벤트 핸들러 등록
    window.addEventListener('resize', this.handleResize);

    document.addEventListener('copy', this.handleCopy);

    this.handleRowDoubleClick  = this.handleRowDoubleClick.bind(this);

    // 메서드 바인딩 추가
    this.handleSaveCouponData = this.handleSaveCouponData.bind(this);  
    
    this.handleCouponMakeOpenModal = this.handleCouponMakeOpenModal.bind(this);
    this.handleCouponMakeCloseModal = this.handleCouponMakeCloseModal.bind(this);
    this.handleCouponMakeQtyChange = this.handleCouponMakeQtyChange.bind(this);  // 추가
    this.handleCouponMake = this.handleCouponMake.bind(this);     
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);

    document.removeEventListener('copy', this.handleCopy);
  }

    // 창 크기 변경 시 실행되는 함수
    handleResize = () => {
      this.setState({
        rightMiddleResultHeight: window.innerHeight * 0.54 // 창의 높이의 60%로 설정 (원하는 비율로 조절 가능)
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

  handleRowDoubleClick = (rowIdx, row) => {
    //console.log('double click = set selection args : ',args);
    console.log('double click = rows : ', row);

    if(this.state.menu==='COUPON'){
      // 쿠폰      
      const selectedOption1 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_1_id.toString()
      );    
      const selectedOption2 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_2_id.toString()
      );    
      const selectedOption3 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_3_id.toString()
      );    
      const selectedOption4 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_4_id.toString()
      );    
      const selectedOption5 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_5_id.toString()
      );    
      const selectedOption6 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_6_id.toString()
      );    
      const selectedOption7 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_7_id.toString()
      );    
      const selectedOption8 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_8_id.toString()
      );    
      const selectedOption9 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_9_id.toString()
      );    
      const selectedOption10 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_10_id.toString()
      );
      const selectedOption11 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_11_id.toString()
      );    
      const selectedOption12 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_12_id.toString()
      );    
      const selectedOption13 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_13_id.toString()
      );    
      const selectedOption14 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_14_id.toString()
      );    
      const selectedOption15 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_15_id.toString()
      );    
      const selectedOption16 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_16_id.toString()
      );    
      const selectedOption17 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_17_id.toString()
      );    
      const selectedOption18 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_18_id.toString()
      );    
      const selectedOption19 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_19_id.toString()
      );    
      const selectedOption20 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_20_id.toString()
      );

      const startDateTime = new Date(row.start_time);  // row.start_time에서 시작 시간 가져오기
      const endDateTime = new Date(row.expire_time);  // row.end_time에서 종료 시간 가져오기
  

      this.setState({
        couponID: row.type_id,
        couponDesc: row.desc,
        couponCode: row.coupon_code,
        couponType: row.use_type,
        couponStartTime: Math.floor(Number(datetime.DateToYYYYMMddHHmmss(startDateTime))/100)*100,  // 시작 시간을 timestamp로 변환
        couponEndTime: Math.floor(Number(datetime.DateToYYYYMMddHHmmss(endDateTime))/100)*100,    // 종료 시간을 timestamp로 변환
        couponStartDatetime: startDateTime,
        couponEndDatetime: endDateTime,
        couponPostKeepDay: row.post_keep_day,
        couponPostSender: row.post_sender_name,
        couponPostMsg: row.post_content,
        couponPostTextID: row.post_text_id,
        couponRewardGold: row.reward_gold,
        couponRewardCashA: row.reward_greenruby,
        couponRewardCashB: row.reward_redruby,
        couponRewardItem_1: selectedOption1 || null,
        couponRewardItem_1_Value: row.reward_item_1_qty,
        couponRewardItem_2: selectedOption2 || null,
        couponRewardItem_2_Value: row.reward_item_2_qty,
        couponRewardItem_3: selectedOption3 || null,
        couponRewardItem_3_Value: row.reward_item_3_qty,
        couponRewardItem_4: selectedOption4 || null,
        couponRewardItem_4_Value: row.reward_item_4_qty,
        couponRewardItem_5: selectedOption5 || null,
        couponRewardItem_5_Value: row.reward_item_5_qty,
        couponRewardItem_6: selectedOption6 || null,
        couponRewardItem_6_Value: row.reward_item_6_qty,
        couponRewardItem_7: selectedOption7 || null,
        couponRewardItem_7_Value: row.reward_item_7_qty,
        couponRewardItem_8: selectedOption8 || null,
        couponRewardItem_8_Value: row.reward_item_8_qty,
        couponRewardItem_9: selectedOption9 || null,
        couponRewardItem_9_Value: row.reward_item_9_qty,
        couponRewardItem_10: selectedOption10 || null,
        couponRewardItem_10_Value: row.reward_item_10_qty,
        couponRewardItem_11: selectedOption11 || null,
        couponRewardItem_11_Value: row.reward_item_11_qty,
        couponRewardItem_12: selectedOption12 || null,
        couponRewardItem_12_Value: row.reward_item_12_qty,
        couponRewardItem_13: selectedOption13 || null,
        couponRewardItem_13_Value: row.reward_item_13_qty,
        couponRewardItem_14: selectedOption14 || null,
        couponRewardItem_14_Value: row.reward_item_14_qty,
        couponRewardItem_15: selectedOption15 || null,
        couponRewardItem_15_Value: row.reward_item_15_qty,
        couponRewardItem_16: selectedOption16 || null,
        couponRewardItem_16_Value: row.reward_item_16_qty,
        couponRewardItem_17: selectedOption17 || null,
        couponRewardItem_17_Value: row.reward_item_17_qty,
        couponRewardItem_18: selectedOption18 || null,
        couponRewardItem_18_Value: row.reward_item_18_qty,
        couponRewardItem_19: selectedOption19 || null,
        couponRewardItem_19_Value: row.reward_item_19_qty,
        couponRewardItem_20: selectedOption20 || null,
        couponRewardItem_20_Value: row.reward_item_20_qty,
      });      
    }
    else if(this.state.menu==='COMPLAINT'){
      this.setState({
        complaint_selectedRow: {
          complaintID: row.complaint_id,
          complaintDate: row.reg_date,
          worldID: row.world_id,
          userID: row.user_idx,
          nickname: row.nickname,
          targetUserID: row.target_user_idx,
          targetNickname: row.target_nickname,
          complaintMsg: row.msg,
          complaintChat: row.chat
        }
      });
    }
    // _QIANHUAN_MAIL
    else if(this.state.menu==='QIANHUAN_API_MAIL'){

      const selectedOption1 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_1_id.toString()
      );
    
      const selectedOption2 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_2_id.toString()
      );
    
      const selectedOption3 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_3_id.toString()
      );
    
      const selectedOption4 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_4_id.toString()
      );
    
      const selectedOption5 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_5_id.toString()
      );
    
      const selectedOption6 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_6_id.toString()
      );
    
      const selectedOption7 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_7_id.toString()
      );
    
      const selectedOption8 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_8_id.toString()
      );
    
      const selectedOption9 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_9_id.toString()
      );
    
      const selectedOption10 = this.props.location.state.itemNames.find(
        option => option.value === row.reward_item_10_id.toString()
      );
 
      this.setState({
        qianhuanMailID: row.mail_id,
        qianhuanMailRewardItem_1: selectedOption1 || null,
        qianhuanMailRewardItem_1_Value: row.reward_item_1_qty,
        qianhuanMailRewardItem_2: selectedOption2 || null,
        qianhuanMailRewardItem_2_Value: row.reward_item_2_qty,
        qianhuanMailRewardItem_3: selectedOption3 || null,
        qianhuanMailRewardItem_3_Value: row.reward_item_3_qty,
        qianhuanMailRewardItem_4: selectedOption4 || null,
        qianhuanMailRewardItem_4_Value: row.reward_item_4_qty,
        qianhuanMailRewardItem_5: selectedOption5 || null,
        qianhuanMailRewardItem_5_Value: row.reward_item_5_qty,
        qianhuanMailRewardItem_6: selectedOption6 || null,
        qianhuanMailRewardItem_6_Value: row.reward_item_6_qty,
        qianhuanMailRewardItem_7: selectedOption7 || null,
        qianhuanMailRewardItem_7_Value: row.reward_item_7_qty,
        qianhuanMailRewardItem_8: selectedOption8 || null,
        qianhuanMailRewardItem_8_Value: row.reward_item_8_qty,
        qianhuanMailRewardItem_9: selectedOption9 || null,
        qianhuanMailRewardItem_9_Value: row.reward_item_9_qty,
        qianhuanMailRewardItem_10: selectedOption10 || null,
        qianhuanMailRewardItem_10_Value: row.reward_item_10_qty,        
      });

      console.log(this.state.qianhuanMailRewardItem_1);
    }
  }

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

  couponInit() {
    this.setState({
      couponID:0,
      couponDesc:'',
      couponCode:'',
      couponType:0,
      couponStartTime:Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100,
      couponEndTime:Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100,
      couponStartDatetime: new Date(),
      couponEndDatetime: new Date(),
      couponPostKeepDay:7,
      couponPostSender:'GM',
      couponPostMsg:'',
      couponPostTextID:0,
      couponRewardGold:0,   // 금전
      couponRewardCashA:0,  // 푸른수정
      couponRewardCashB:0,  // 붉은수정      
      couponRewardItem_1:null,
      couponRewardItem_1_Value:0,
      couponRewardItem_2:null,
      couponRewardItem_2_Value:0,
      couponRewardItem_3:null,
      couponRewardItem_3_Value:0,
      couponRewardItem_4:null,
      couponRewardItem_4_Value:0,
      couponRewardItem_5:null,
      couponRewardItem_5_Value:0,
      couponRewardItem_6:null,
      couponRewardItem_6_Value:0,
      couponRewardItem_7:null,
      couponRewardItem_7_Value:0,
      couponRewardItem_8:null,
      couponRewardItem_8_Value:0,
      couponRewardItem_9:null,
      couponRewardItem_9_Value:0,
      couponRewardItem_10:null,
      couponRewardItem_10_Value:0,
      couponRewardItem_11:null,
      couponRewardItem_11_Value:0,
      couponRewardItem_12:null,
      couponRewardItem_12_Value:0,
      couponRewardItem_13:null,
      couponRewardItem_13_Value:0,
      couponRewardItem_14:null,
      couponRewardItem_14_Value:0,
      couponRewardItem_15:null,
      couponRewardItem_15_Value:0,
      couponRewardItem_16:null,
      couponRewardItem_16_Value:0,
      couponRewardItem_17:null,
      couponRewardItem_17_Value:0,
      couponRewardItem_18:null,
      couponRewardItem_18_Value:0,
      couponRewardItem_19:null,
      couponRewardItem_19_Value:0,
      couponRewardItem_20:null,
      couponRewardItem_20_Value:0      
    });
  }

  searchUsedCouponInit() {
    this.setState({
      searchUsedCouponType: 0,
      searchUsedCouponCode: '',
      searchUsedCouponPlatformAccountID: '',
      searchUsedCouponAccountID: '',
      searchUsedCouponUserID: '',
      searchUsedCouponWorldID: null,
      searchUsedCouponCharacterName: '',
    });
  }

  searchUsedCouponInit2() {
    this.setState({
      searchUsedCouponCode: '',
      searchUsedCouponPlatformAccountID: '',
      searchUsedCouponAccountID: '',
      searchUsedCouponUserID: '',
      searchUsedCouponWorldID: null,
      searchUsedCouponCharacterName: '',
    });
  }  

  // _QIANHUAN_MAIL
  qianhuanMailInit() {
    this.setState({
      qianhuanMailID:0,
      qianhuanMailRewardItem_1:null,
      qianhuanMailRewardItem_1_Value:0,
      qianhuanMailRewardItem_2:null,
      qianhuanMailRewardItem_2_Value:0,
      qianhuanMailRewardItem_3:null,
      qianhuanMailRewardItem_3_Value:0,
      qianhuanMailRewardItem_4:null,
      qianhuanMailRewardItem_4_Value:0,
      qianhuanMailRewardItem_5:null,
      qianhuanMailRewardItem_5_Value:0,
      qianhuanMailRewardItem_6:null,
      qianhuanMailRewardItem_6_Value:0,
      qianhuanMailRewardItem_7:null,
      qianhuanMailRewardItem_7_Value:0,
      qianhuanMailRewardItem_8:null,
      qianhuanMailRewardItem_8_Value:0,
      qianhuanMailRewardItem_9:null,
      qianhuanMailRewardItem_9_Value:0,
      qianhuanMailRewardItem_10:null,
      qianhuanMailRewardItem_10_Value:0
    });    
  }

  // _COMPLAINT
  complaintInit() {
    this.setState({
      complaint_selectedRow: {
        complaintID: '',
        complaintDate: '',
        worldID: 0,
        userID: 0,
        nickname: '',
        targetUserID: 0,
        targetNickname: '',
        complaintMsg: '',
        complaintChat: ''
      }
    });
  }


  setMenu(menu){
    this.setState({
      menu:menu,
      command:'',

      resultColumns:'',
      resultRows:'',

      // post
      postSender:'',
      postMsg:'',
      postValidDays:0,
      postItem:null,
      postItemValue:0,

      // notice
      noticeWorld:null,
      noticeMsg:'',
      noticeReservation:false,
      noticeStartime:Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100,
      noticeTerm:1,
      noticeCount:1,

      // block ip
      ipBlock:'',
      ipUnBlock:'',
      ipBlockHours:0,

      // server state (-1:no check 0:ok 0>:block)
      serverState:-1,
      serverBlockStarttime:(Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100),
      serverBlockEndtime:(Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100),

      clientVersion:'',

      sendItemBatchFileName: ''
    });
    
    // coupon
    this.couponInit();

    // search used coupon
    this.searchUsedCouponInit();

    // _QIANHUAN_MAIL
    this.qianhuanMailInit();
    //#endif _QIANHUAN_MAIL

    // _COMPLAINT
    this.complaintInit();

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

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.select();
    }
  }  

  handleWorldIdxChange = (e) => {
    this.setState({ searchUsedCouponWorldID: e }, () => {
      console.log('World ID updated to:', this.state.searchUsedCouponWorldID);
    });    
  }  

  handleUserIdxChange = (e) => {
    this.setMenu(this.state.menu);
    this.setState({userIdx: e});
    console.log('set userIdx value : ' +  e.value);
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

  handleNoticeWorldChange = (e) => {
    this.setState({noticeWorld: e});
    console.log('set world value : ' +  e.value);
  }

  handleNoticeReservationChange = (e) => {
    this.setState({ noticeReservation:e });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.menu==='COUPON'){
      // couponType이 바뀌었을 때 처리
      if (prevState.couponType !== this.state.couponType) {
        // 쿠폰 타입이 1 또는 11이 아닐 때 쿠폰 이름을 초기화
        if (!(this.state.couponType === 1 || this.state.couponType === 11)) {
          this.setState({ couponCode: '' });
        }
      }
    }
  }

  // 팝업창에서 coupon_id 입력 후 데이터를 저장하는 함수
  handleSaveCouponData() {
    const { couponID } = this.state;

    if (couponID <= 0) {
      alert('Please enter a valid coupon Info ID.');
      return;
    }

    // couponID로 쿠폰 데이터를 받아옴
    proxy.getCouponListByID(this.props.location.state.auth.ukey, couponID).then(response => {
      const couponData = response.result;

      // 쿠폰 데이터를 상태에 저장
      this.setState({ couponData });

      // 자동으로 CSV 파일을 다운로드하는 로직
      const csvLink = document.createElement('a');
      csvLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent(this.convertToCSV(couponData))}`;
      csvLink.download = `coupon_data_${couponID}.csv`;
      csvLink.click();
    }).catch(err => {
      console.error(err);
    });
  }

  // 데이터를 CSV로 변환하는 함수
  convertToCSV(data) {
    const header = Object.keys(data[0]).join(','); // CSV 헤더 생성
    const rows = data.map(row => Object.values(row).join(',')); // CSV 내용 생성
    return [header, ...rows].join('\n');
  }

  // 팝업 열기
  handleCouponMakeOpenModal() {
    const { couponType } = this.state;

    // couponType이 1 또는 11인 경우 오류 메시지 출력
    if (couponType === 1 || couponType === 11) {
      alert('Error: Coupon type 1 or 11 is not allowed.');
    } else {
      this.setState({ couponMakeShowModal: true });
    }  
  }

  // 팝업 닫기
  handleCouponMakeCloseModal() {
    this.setState({ couponMakeShowModal: false });
  }

  // couponMakeQty 입력 값 변경 핸들러
  handleCouponMakeQtyChange(e) {
    const value = e.target.value;
    if (value > 10000) {
      this.setState({ couponMakeQty: 10000 });
    } else {
      this.setState({ couponMakeQty: value });
    }    
  }

  // 쿠폰 번호 생성 함수
  handleCouponMake() {
    const { couponID, couponMakeQty } = this.state;
    
    if (couponID <= 0 || couponMakeQty <= 0) {
      alert('Please enter a valid coupon Info ID and quantity.');
      return;
    }

    // 쿠폰 번호 생성 API 호출
    proxy.makeCoupon(this.props.location.state.auth.ukey, 'MAKE_COUPON_CODE', couponID, couponMakeQty)
      .then(response => {
        // 성공 시 쿠폰 생성 결과를 출력
        //alert('Coupon codes generated successfully:\n' + JSON.stringify(response));
        const { t } = this.props; // t 함수를 this.props에서 가져옵니다.
        window.alert(t('Success!'));

        this.handleCouponMakeCloseModal();
      })
      .catch(err => {
        console.error(err);
        window.alert('Failed to generate coupon codes.');
      });
  }



  handleCouponStartTimeChange = moment =>  {
    const date = moment.toDate();
    // 초를 항상 0으로 설정
    date.setSeconds(0);
    this.setState({ couponStartDatetime: date });
    this.setState({ couponStartTime: Math.floor(Number(datetime.DateToYYYYMMddHHmmss(date)))});
  }

  handleCouponEndTimeChange = moment => {
    let date = moment.toDate();
    // 초를 항상 0으로 설정
    date.setSeconds(0);
    this.setState({ couponEndDatetime: date });
    this.setState({ couponEndTime: Math.floor(Number(datetime.DateToYYYYMMddHHmmss(date)))});
  }

  handleCouponItem1Change = (e) => {
    this.setState({couponRewardItem_1: e});
    console.log('set couponRewardItem_1 value : ' +  e.value);
  }
  handleCouponItem2Change = (e) => {
    this.setState({couponRewardItem_2: e});
    console.log('set couponRewardItem_2 value : ' +  e.value);
  }
  handleCouponItem3Change = (e) => {
    this.setState({couponRewardItem_3: e});
    console.log('set couponRewardItem_3 value : ' +  e.value);
  }
  handleCouponItem4Change = (e) => {
    this.setState({couponRewardItem_4: e});
    console.log('set couponRewardItem_4 value : ' +  e.value);
  }
  handleCouponItem5Change = (e) => {
    this.setState({couponRewardItem_5: e});
    console.log('set couponRewardItem_5 value : ' +  e.value);
  }  
  handleCouponItem6Change = (e) => {
    this.setState({couponRewardItem_6: e});
    console.log('set couponRewardItem_6 value : ' +  e.value);
  }  
  handleCouponItem7Change = (e) => {
    this.setState({couponRewardItem_7: e});
    console.log('set couponRewardItem_7 value : ' +  e.value);
  }
  handleCouponItem8Change = (e) => {
    this.setState({couponRewardItem_8: e});
    console.log('set couponRewardItem_8 value : ' +  e.value);
  }
  handleCouponItem9Change = (e) => {
    this.setState({couponRewardItem_9: e});
    console.log('set couponRewardItem_9 value : ' +  e.value);
  }
  handleCouponItem10Change = (e) => {
    this.setState({couponRewardItem_10: e});
    console.log('set couponRewardItem_10 value : ' +  e.value);
  }
  handleCouponItem11Change = (e) => {
    this.setState({couponRewardItem_11: e});
    console.log('set couponRewardItem_11 value : ' +  e.value);
  }
  handleCouponItem12Change = (e) => {
    this.setState({couponRewardItem_12: e});
    console.log('set couponRewardItem_12 value : ' +  e.value);
  }
  handleCouponItem13Change = (e) => {
    this.setState({couponRewardItem_13: e});
    console.log('set couponRewardItem_13 value : ' +  e.value);
  }
  handleCouponItem14Change = (e) => {
    this.setState({couponRewardItem_14: e});
    console.log('set couponRewardItem_14 value : ' +  e.value);
  }
  handleCouponItem15Change = (e) => {
    this.setState({couponRewardItem_15: e});
    console.log('set couponRewardItem_15 value : ' +  e.value);
  }  
  handleCouponItem16Change = (e) => {
    this.setState({couponRewardItem_16: e});
    console.log('set couponRewardItem_16 value : ' +  e.value);
  }  
  handleCouponItem17Change = (e) => {
    this.setState({couponRewardItem_17: e});
    console.log('set couponRewardItem_17 value : ' +  e.value);
  }
  handleCouponItem18Change = (e) => {
    this.setState({couponRewardItem_18: e});
    console.log('set couponRewardItem_18 value : ' +  e.value);
  }
  handleCouponItem19Change = (e) => {
    this.setState({couponRewardItem_19: e});
    console.log('set couponRewardItem_19 value : ' +  e.value);
  }
  handleCouponItem20Change = (e) => {
    this.setState({couponRewardItem_20: e});
    console.log('set couponRewardItem_20 value : ' +  e.value);
  }  


  // _QIANHUAN_MAIL
  handleQianhuanMailItem1Change = (e) => {
    this.setState({qianhuanMailRewardItem_1: e});
    console.log('set qianhuanMailRewardItem_1 value : ' +  e.value);
  }
  handleQianhuanMailItem2Change = (e) => {
    this.setState({qianhuanMailRewardItem_2: e});
    console.log('set qianhuanMailRewardItem_2 value : ' +  e.value);
  }
  handleQianhuanMailItem3Change = (e) => {
    this.setState({qianhuanMailRewardItem_3: e});
    console.log('set qianhuanMailRewardItem_3 value : ' +  e.value);
  }
  handleQianhuanMailItem4Change = (e) => {
    this.setState({qianhuanMailRewardItem_4: e});
    console.log('set qianhuanMailRewardItem_4 value : ' +  e.value);
  }
  handleQianhuanMailItem5Change = (e) => {
    this.setState({qianhuanMailRewardItem_5: e});
    console.log('set qianhuanMailRewardItem_5 value : ' +  e.value);
  }  
  handleQianhuanMailItem6Change = (e) => {
    this.setState({qianhuanMailRewardItem_6: e});
    console.log('set qianhuanMailRewardItem_6 value : ' +  e.value);
  }  
  handleQianhuanMailItem7Change = (e) => {
    this.setState({qianhuanMailRewardItem_7: e});
    console.log('set qianhuanMailRewardItem_7 value : ' +  e.value);
  }
  handleQianhuanMailItem8Change = (e) => {
    this.setState({qianhuanMailRewardItem_8: e});
    console.log('set qianhuanMailRewardItem_8 value : ' +  e.value);
  }
  handleQianhuanMailItem9Change = (e) => {
    this.setState({qianhuanMailRewardItem_9: e});
    console.log('set qianhuanMailRewardItem_9 value : ' +  e.value);
  }
  handleQianhuanMailItem10Change = (e) => {
    this.setState({qianhuanMailRewardItem_10: e});
    console.log('set qianhuanMailRewardItem_10 value : ' +  e.value);
  }
  //#end _QIANHUAN_MAIL

  // _COMPLAINT
  copyToClipboard = (text) => {

    // if (!navigator.clipboard) {
    if (true) {
      //console.error('Clipboard API is not available.');
      //alert('Clipboard API is not supported on this browser.');
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.setState({
          snackbarOpen: true,
          snackbarMessage: `'${text}' copied to clipboard`
        });
        setTimeout(() => {
          this.setState({ snackbarOpen: false });
        }, 1500);
      } catch (err) {
        console.error('Could not copy text: ', err);
      }
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => {
          //console.log('Text copied to clipboard');
          this.setState({
            snackbarOpen: true,
            snackbarMessage: `'${text}' copied to clipboard`
          });
          setTimeout(() => {
            this.setState({ snackbarOpen: false });
          }, 1500);  // Show message for 2 seconds
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };  



  handleGetExcelFileChange = (e) => {
    this.setState({sendItemBatchFileName: e.target.files[0]});
    ExcelRenderer(e.target.files[0], (err, result) => {
        if (err) console.log(err);
        else {
            let columns = [];
            let rows = [];
            if(result.rows.length > 0){
                for(let i=0; i<Object.keys(result.rows[0]).length; i++){
                    columns.push({key:Object.keys(result.rows[0])[i], name:result.rows[0][i], resizable:true});
                }
                for(let i=1; i<result.rows.length; i++){
                    rows.push(result.rows[i]);
                }
            }
            this.setState({resultColumns:columns, resultRows:rows}); 
            console.log(this.state);
        }
    });
  }

  validateIpAddress = (ipaddress) => {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true);
    }  
    window.alert("You have entered an invalid IP address!");  
    return (false); 
  }
  
  validItem = (itemId,itemValue) => {
    if(itemId === 0 && itemValue === 0) return (true);
    else if (itemId > 0 && itemValue > 0){
      for(let i=0; i<this.props.location.state.itemNames.length; i++){
        if(Number(itemId) === Number(this.props.location.state.itemNames[i].value))
          return (true);
      }
    }
    window.alert("You have entered an invalid item!");
    return (false);
  }

  select = () => { 
    const { t } = this.props; // t 함수를 this.props에서 가져옵니다.
    if(this.state.menu==='NOTICE'){
      proxy.getNotice(this.props.location.state.auth.ukey).then(response => {
        this.setState({noticeDeletedIdx:-1});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='IP_BLOCK'){
      proxy.getIpBlock(this.props.location.state.auth.ukey).then(response => {
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='SERVER_STATE'){
      let servertime = Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100;
      proxy.getServerState(this.props.location.state.auth.ukey).then(response => { 
        let state = 0;
        let starttime = 0;
        let endtime = 0;
        if(response.starttime)
          starttime = Number(datetime.DateToYYYYMMddHHmmss( new Date(Number(response.starttime) * 1000)));
        if(response.endtime)
          endtime = Number(datetime.DateToYYYYMMddHHmmss( new Date(Number(response.endtime) * 1000)));   
        if(starttime <= servertime && endtime > servertime) 
          state = 1;  
        this.setState({serverState:state,serverBlockStarttime:starttime,serverBlockEndtime:endtime});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='CLIENT_VERSION'){
      proxy.getClientVersion(this.props.location.state.auth.ukey).then(response => { 
        this.setState({clientVersion:response.clientVersion});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    // coupon
    else if(this.state.menu==='COUPON'){
      proxy.getCouponInfo(this.props.location.state.auth.ukey).then(response => {
        this.setState({noticeDeletedIdx:-1});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    // used coupon
    else if(this.state.menu==='SEARCH_USED_COUPON'){
      const search_type = this.state.searchUsedCouponType;
      let strParam1 = '';
      let intParam1 = 0;
      switch(search_type) {
        case 0: // 쿠폰코드
          strParam1 = this.state.searchUsedCouponCode;
          break;
        case 1: // 플랫폼 유저 고유번호
          strParam1 = this.state.searchUsedCouponPlatformAccountID;
          break;
        case 2: // 게임 계정 고유 번호
          intParam1 = this.state.searchUsedCouponAccountID;
          break;
        case 3: // 월드 계정 고유 번호
          intParam1 = this.state.searchUsedCouponUserID;
          break;
        case 4: // 캐릭터
          if (null === this.state.searchUsedCouponWorldID) {
            window.alert(t('Please select a world'));
            return;
          }
          intParam1 = this.state.searchUsedCouponWorldID.value;
          strParam1 = this.state.searchUsedCouponCharacterName;
          break;
        default:
      }

      this.searchUsedCouponInit2();

      proxy.getUsedCouponInfo(this.props.location.state.auth.ukey, search_type, strParam1, intParam1).then(response => {
        this.setState({noticeDeletedIdx:-1});

        // 서버에서 'Not found' 메시지가 왔을 때 처리
        if (response.message) {
          console.warn(response.message);
          let columns = [{ key: 'result', name: 'Result' }];
          this.setState({resultColumns:columns, resultRows:[{result:response.message}] });
        } else if (response.result && Array.isArray(response.result)) {
          // 결과가 배열인 경우 데이터 표시
          setResult(response.result);
        } else {
          // 예상치 못한 응답 처리
          console.warn('Unexpected response:', response);
          let columns = [{ key: 'result', name: 'Result' }];
          this.setState({resultColumns:columns, resultRows:[{result:'Unexpected response format'}] });
        }
      }).catch(err => {
        console.log(err);
      });
    }
    // _COMPLAINT
    else if(this.state.menu==='COMPLAINT'){
      proxy.getComplaint(this.props.location.state.auth.ukey).then(response => {
        this.setState({noticeDeletedIdx:-1});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });      
    }
    // _QIANHUAN_MAIL
    else if(this.state.menu==='QIANHUAN_API_MAIL'){
      proxy.getQianhuanMail(this.props.location.state.auth.ukey).then(response => {
        this.setState({noticeDeletedIdx:-1});
        setResult(response.result);  
      }).catch(err => {
        console.log(err);
      });
    }
    //#end _QIANHUAN_MAIL

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

        // update, delete action
        if(This.state.menu==='NOTICE'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Delete />,
                  callback: () => {
                    This.commandRow('DELETE_NOTICE',row);
                  }
                }
              ];
              return ( <CellActions actions={actions} /> );
            } 
          });
        }
/*
        // COUPON update,delete action
        if(This.state.menu==='COUPON'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Delete />,
                  callback: () => {
                    This.commandRow('DELETE_COUPON',row);
                  }
                }
              ];
              return ( <CellActions actions={actions} /> );
            } 
          });
        }
*/
        // _COMPLAINT
        if(This.state.menu==='COMPLAINT'){
          columns.push({key:'action', name:'action', cellClass: 'rdg-cell-action',
            formatter({row}) {
              const actions = [
                {
                  icon: <Edit />,
                  callback: () => {
                    This.commandRow('UPDATE_COMPLETE',row);
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

        This.setState({resultColumns:columns, resultRows:result}); 
      }
      else{
        columns.push({key:'result', name:'result'});
        This.setState({resultColumns:columns, resultRows:[{result:'no data'}] });
      }
      console.log(This.state.menu + ' execute result :' + JSON.stringify(This.state.resultRows));  
    }
  }

  update = (command) => {
    const { t } = this.props; // t 함수를 this.props에서 가져옵니다.
    if(this.state.menu==='POST'){
      if(this.props.location.state.auth.grade !== 0 && this.props.location.state.auth.grade !== 1){
        let itemId = this.state.postItem ? this.state.postItem.value : 0;
        if(itemId === 50000002)
        {
          window.alert(t('50000002(Blue Ruby) is for admin only!'));
          return;
        }
      }
      if(window.confirm(t('Are you send post to all user?'))===true){
        let itemId = this.state.postItem ? this.state.postItem.value : 0;
        let itemValue = this.state.postItemValue;
        let isValidItem = this.validItem(itemId,itemValue);
        if(!isValidItem) return;
        proxy.setPost(this.props.location.state.auth.ukey,command,this.state.postSender,this.state.postMsg,this.state.postValidDays,itemId,itemValue).then(response => {
          /*
          let columns = [];
          columns.push({key:'result', name:'result'});
          this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
          */
          window.alert(t('Success!'));
          //this.setMenu(this.state.menu);
        }).catch(err => {
          console.log(err);
        });
      }
    }
    else if(this.state.menu==='NOTICE'){
      if(command === 'SEND_NOTICE'){
        if(window.confirm(t('Are you send notice?'))===true){
          let starttime = this.state.noticeReservation ? this.state.noticeStartime.toString() : '0';
          proxy.setNotice(this.props.location.state.auth.ukey,command,this.state.noticeWorld.value,this.state.noticeMsg,starttime,this.state.noticeTerm,this.state.noticeCount).then(response => {
            /*
            let columns = [];
            columns.push({key:'result', name:'result'});
            this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
            */
            window.alert(t('Success!'));
            //this.setMenu(this.state.menu);
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    else if(this.state.menu==='IP_BLOCK'){
      let isValidIpAdress = this.validateIpAddress(this.state.ipBlock);
      if(!isValidIpAdress) return;
      proxy.setIpBlock(this.props.location.state.auth.ukey,command,this.state.ipBlock,this.state.ipBlockHours,this.state.ipBlockReason).then(response => {
        /*
        let columns = [];
        columns.push({key:'result', name:'result'});
        this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
        */
        window.alert(t('Success!'));
        this.select();
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='IP_UNBLOCK'){
      let isValidIpAdress = this.validateIpAddress(this.state.ipUnBlock);
      if(!isValidIpAdress) return;
      proxy.setIpBlock(this.props.location.state.auth.ukey,command,this.state.ipUnBlock,0,'').then(response => {
        /*
        let columns = [];
        columns.push({key:'result', name:'result'});
        this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
        */
        window.alert(t('Success!'));
        this.select();
      }).catch(err => {
        console.log(err);
      });
    }
    else if(this.state.menu==='SERVER_STATE'){
      if(command === 'SERVER_BLOCK' || command === 'SERVER_UNBLOCK'){
        let servertime = Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100;
        let blockStarttime = command === 'SERVER_BLOCK' ? this.state.serverBlockStarttime : servertime;
        let blockEndtime = command === 'SERVER_BLOCK' ? this.state.serverBlockEndtime : servertime; 
        let starttime = datetime.YYYYMMddHHmmssToDate(blockStarttime.toString()).getTime()/1000;
        let endtime = datetime.YYYYMMddHHmmssToDate(blockEndtime.toString()).getTime()/1000;
        proxy.setServerState(this.props.location.state.auth.ukey,command,starttime.toString(),endtime.toString()).then(response => {
          let state = 0;
          if(response.starttime)
            starttime = Number(datetime.DateToYYYYMMddHHmmss( new Date(Number(response.starttime) * 1000)));
          if(response.endtime)
            endtime = Number(datetime.DateToYYYYMMddHHmmss( new Date(Number(response.endtime) * 1000)));   
          if(starttime <= servertime && endtime > servertime) 
            state = 1;  
          this.setState({serverState:state,serverBlockStarttime:starttime,serverBlockEndtime:endtime});
          /*
          let columns = [];
          columns.push({key:'result', name:'result'});
          this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
          */
          window.alert(t('Success!'));
        }).catch(err => {
          console.log(err);
        });
      }
    }
    else if(this.state.menu==='CLIENT_VERSION'){
        proxy.setClientVersion(this.props.location.state.auth.ukey,command,this.state.clientVersion).then(response => {
            this.setState({clientVersion:response.result.clientVersion});
            /*
            let columns = [];
            columns.push({key:'result', name:'result'});
            this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
            */
            window.alert(t('Success!'));
        }).catch(err => {
            console.log(err);
        });
    }
    else if(this.state.menu==='SEND_ITEMS_BATCH'){

      let batchData = this.state.resultRows;
      for(let i = 0; i < batchData.length; i++){
        if(batchData[i].length !== 6)
        {
          window.alert(t('The number of fields is not correct!'));
          return;
        }

        if(this.props.location.state.auth.grade !== 0 && this.props.location.state.auth.grade !== 1){
          let item_id = Number(batchData[i][1]);
          if(item_id === 50000002)
          {
            window.alert(t('50000002(Blue Ruby) is for admin only!'));  
            return;
          }
        }
      }
      

      if(window.confirm(t('Are you send items for specify users?'))===true){
          proxy.sendItems(this.props.location.state.auth.ukey,command,this.state.resultRows).then(response => {  
              this.setState({sendItemBatchFileName:''});
              let columns = [];
              columns.push({key:'result', name:'result'});
              this.setState({ resultColumns:columns, resultRows:[{result:'success'}] });
              window.alert(t('Success!'));
          }).catch(err => {
              console.log(err);
          });
      }
    }
    // coupon
    else if(this.state.menu==='COUPON'){
      if(command === 'INSERT_COUPON'){

        if(this.state.couponID <= 0){
          window.alert(t('Invalid coupon id =') + `${this.state.couponID}`);
          return;
        }

        if(window.confirm(t('Would you like to add the coupon?'))===true){
          let itemID1 = this.state.couponRewardItem_1 ? this.state.couponRewardItem_1.value : 0;
          let itemID2 = this.state.couponRewardItem_2 ? this.state.couponRewardItem_2.value : 0;
          let itemID3 = this.state.couponRewardItem_3 ? this.state.couponRewardItem_3.value : 0;
          let itemID4 = this.state.couponRewardItem_4 ? this.state.couponRewardItem_4.value : 0;
          let itemID5 = this.state.couponRewardItem_5 ? this.state.couponRewardItem_5.value : 0;
          let itemID6 = this.state.couponRewardItem_6 ? this.state.couponRewardItem_6.value : 0;
          let itemID7 = this.state.couponRewardItem_7 ? this.state.couponRewardItem_7.value : 0;
          let itemID8 = this.state.couponRewardItem_8 ? this.state.couponRewardItem_8.value : 0;
          let itemID9 = this.state.couponRewardItem_9 ? this.state.couponRewardItem_9.value : 0;
          let itemID10 = this.state.couponRewardItem_10 ? this.state.couponRewardItem_10.value : 0;
          let itemID11 = this.state.couponRewardItem_11 ? this.state.couponRewardItem_11.value : 0;
          let itemID12 = this.state.couponRewardItem_12 ? this.state.couponRewardItem_12.value : 0;
          let itemID13 = this.state.couponRewardItem_13 ? this.state.couponRewardItem_13.value : 0;
          let itemID14 = this.state.couponRewardItem_14 ? this.state.couponRewardItem_14.value : 0;
          let itemID15 = this.state.couponRewardItem_15 ? this.state.couponRewardItem_15.value : 0;
          let itemID16 = this.state.couponRewardItem_16 ? this.state.couponRewardItem_16.value : 0;
          let itemID17 = this.state.couponRewardItem_17 ? this.state.couponRewardItem_17.value : 0;
          let itemID18 = this.state.couponRewardItem_18 ? this.state.couponRewardItem_18.value : 0;
          let itemID19 = this.state.couponRewardItem_19 ? this.state.couponRewardItem_19.value : 0;
          let itemID20 = this.state.couponRewardItem_20 ? this.state.couponRewardItem_20.value : 0;          

          if(!this.validItem(itemID1,this.state.couponRewardItem_1_Value)) return;
          if(!this.validItem(itemID2,this.state.couponRewardItem_2_Value)) return;
          if(!this.validItem(itemID3,this.state.couponRewardItem_3_Value)) return;
          if(!this.validItem(itemID4,this.state.couponRewardItem_4_Value)) return;
          if(!this.validItem(itemID5,this.state.couponRewardItem_5_Value)) return;
          if(!this.validItem(itemID6,this.state.couponRewardItem_6_Value)) return;
          if(!this.validItem(itemID7,this.state.couponRewardItem_7_Value)) return;
          if(!this.validItem(itemID8,this.state.couponRewardItem_8_Value)) return;
          if(!this.validItem(itemID9,this.state.couponRewardItem_9_Value)) return;
          if(!this.validItem(itemID10,this.state.couponRewardItem_10_Value)) return;
          if(!this.validItem(itemID11,this.state.couponRewardItem_11_Value)) return;
          if(!this.validItem(itemID12,this.state.couponRewardItem_12_Value)) return;
          if(!this.validItem(itemID13,this.state.couponRewardItem_13_Value)) return;
          if(!this.validItem(itemID14,this.state.couponRewardItem_14_Value)) return;
          if(!this.validItem(itemID15,this.state.couponRewardItem_15_Value)) return;
          if(!this.validItem(itemID16,this.state.couponRewardItem_16_Value)) return;
          if(!this.validItem(itemID17,this.state.couponRewardItem_17_Value)) return;
          if(!this.validItem(itemID18,this.state.couponRewardItem_18_Value)) return;
          if(!this.validItem(itemID19,this.state.couponRewardItem_19_Value)) return;
          if(!this.validItem(itemID20,this.state.couponRewardItem_20_Value)) return;          


          proxy.insertCouponInfo(this.props.location.state.auth.ukey,command,this.state.couponID,this.state.couponDesc,this.state.couponCode,this.state.couponType
                        ,this.state.couponStartTime,this.state.couponEndTime,this.state.couponPostKeepDay
                        ,this.state.couponPostSender,this.state.couponPostMsg,this.state.couponPostTextID
                        ,this.state.couponRewardGold, this.state.couponRewardCashA, this.state.couponRewardCashB
                        ,itemID1,this.state.couponRewardItem_1_Value
                        ,itemID2,this.state.couponRewardItem_2_Value
                        ,itemID3,this.state.couponRewardItem_3_Value
                        ,itemID4,this.state.couponRewardItem_4_Value
                        ,itemID5,this.state.couponRewardItem_5_Value
                        ,itemID6,this.state.couponRewardItem_6_Value
                        ,itemID7,this.state.couponRewardItem_7_Value
                        ,itemID8,this.state.couponRewardItem_8_Value
                        ,itemID9,this.state.couponRewardItem_9_Value
                        ,itemID10,this.state.couponRewardItem_10_Value
                        ,itemID11,this.state.couponRewardItem_11_Value
                        ,itemID12,this.state.couponRewardItem_12_Value
                        ,itemID13,this.state.couponRewardItem_13_Value
                        ,itemID14,this.state.couponRewardItem_14_Value
                        ,itemID15,this.state.couponRewardItem_15_Value
                        ,itemID16,this.state.couponRewardItem_16_Value
                        ,itemID17,this.state.couponRewardItem_17_Value
                        ,itemID18,this.state.couponRewardItem_18_Value
                        ,itemID19,this.state.couponRewardItem_19_Value
                        ,itemID20,this.state.couponRewardItem_20_Value).then(response => {

            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });

          this.couponInit();
        }
      }
      else if(command === 'UPDATE_COUPON'){
        if(this.state.couponID <= 0){
          window.alert(t('Invalid coupon id =') + `${this.state.couponID}`);
          return;
        }

        if(window.confirm(t('Would you like to update the coupon?'))===true){
          let itemID1 = this.state.couponRewardItem_1 ? this.state.couponRewardItem_1.value : 0;
          let itemID2 = this.state.couponRewardItem_2 ? this.state.couponRewardItem_2.value : 0;
          let itemID3 = this.state.couponRewardItem_3 ? this.state.couponRewardItem_3.value : 0;
          let itemID4 = this.state.couponRewardItem_4 ? this.state.couponRewardItem_4.value : 0;
          let itemID5 = this.state.couponRewardItem_5 ? this.state.couponRewardItem_5.value : 0;
          let itemID6 = this.state.couponRewardItem_6 ? this.state.couponRewardItem_6.value : 0;
          let itemID7 = this.state.couponRewardItem_7 ? this.state.couponRewardItem_7.value : 0;
          let itemID8 = this.state.couponRewardItem_8 ? this.state.couponRewardItem_8.value : 0;
          let itemID9 = this.state.couponRewardItem_9 ? this.state.couponRewardItem_9.value : 0;
          let itemID10 = this.state.couponRewardItem_10 ? this.state.couponRewardItem_10.value : 0;
          let itemID11 = this.state.couponRewardItem_11 ? this.state.couponRewardItem_11.value : 0;
          let itemID12 = this.state.couponRewardItem_12 ? this.state.couponRewardItem_12.value : 0;
          let itemID13 = this.state.couponRewardItem_13 ? this.state.couponRewardItem_13.value : 0;
          let itemID14 = this.state.couponRewardItem_14 ? this.state.couponRewardItem_14.value : 0;
          let itemID15 = this.state.couponRewardItem_15 ? this.state.couponRewardItem_15.value : 0;
          let itemID16 = this.state.couponRewardItem_16 ? this.state.couponRewardItem_16.value : 0;
          let itemID17 = this.state.couponRewardItem_17 ? this.state.couponRewardItem_17.value : 0;
          let itemID18 = this.state.couponRewardItem_18 ? this.state.couponRewardItem_18.value : 0;
          let itemID19 = this.state.couponRewardItem_19 ? this.state.couponRewardItem_19.value : 0;
          let itemID20 = this.state.couponRewardItem_20 ? this.state.couponRewardItem_20.value : 0;          

          if(!this.validItem(itemID1,this.state.couponRewardItem_1_Value)) return;
          if(!this.validItem(itemID2,this.state.couponRewardItem_2_Value)) return;
          if(!this.validItem(itemID3,this.state.couponRewardItem_3_Value)) return;
          if(!this.validItem(itemID4,this.state.couponRewardItem_4_Value)) return;
          if(!this.validItem(itemID5,this.state.couponRewardItem_5_Value)) return;
          if(!this.validItem(itemID6,this.state.couponRewardItem_6_Value)) return;
          if(!this.validItem(itemID7,this.state.couponRewardItem_7_Value)) return;
          if(!this.validItem(itemID8,this.state.couponRewardItem_8_Value)) return;
          if(!this.validItem(itemID9,this.state.couponRewardItem_9_Value)) return;
          if(!this.validItem(itemID10,this.state.couponRewardItem_10_Value)) return;
          if(!this.validItem(itemID11,this.state.couponRewardItem_11_Value)) return;
          if(!this.validItem(itemID12,this.state.couponRewardItem_12_Value)) return;
          if(!this.validItem(itemID13,this.state.couponRewardItem_13_Value)) return;
          if(!this.validItem(itemID14,this.state.couponRewardItem_14_Value)) return;
          if(!this.validItem(itemID15,this.state.couponRewardItem_15_Value)) return;
          if(!this.validItem(itemID16,this.state.couponRewardItem_16_Value)) return;
          if(!this.validItem(itemID17,this.state.couponRewardItem_17_Value)) return;
          if(!this.validItem(itemID18,this.state.couponRewardItem_18_Value)) return;
          if(!this.validItem(itemID19,this.state.couponRewardItem_19_Value)) return;
          if(!this.validItem(itemID20,this.state.couponRewardItem_20_Value)) return;          


          proxy.updateCouponInfo(this.props.location.state.auth.ukey,command,this.state.couponID,this.state.couponDesc,this.state.couponCode,this.state.couponType
                        ,this.state.couponStartTime,this.state.couponEndTime,this.state.couponPostKeepDay
                        ,this.state.couponPostSender,this.state.couponPostMsg,this.state.couponPostTextID
                        ,this.state.couponRewardGold, this.state.couponRewardCashA, this.state.couponRewardCashB
                        ,itemID1,this.state.couponRewardItem_1_Value
                        ,itemID2,this.state.couponRewardItem_2_Value
                        ,itemID3,this.state.couponRewardItem_3_Value
                        ,itemID4,this.state.couponRewardItem_4_Value
                        ,itemID5,this.state.couponRewardItem_5_Value
                        ,itemID6,this.state.couponRewardItem_6_Value
                        ,itemID7,this.state.couponRewardItem_7_Value
                        ,itemID8,this.state.couponRewardItem_8_Value
                        ,itemID9,this.state.couponRewardItem_9_Value
                        ,itemID10,this.state.couponRewardItem_10_Value
                        ,itemID11,this.state.couponRewardItem_11_Value
                        ,itemID12,this.state.couponRewardItem_12_Value
                        ,itemID13,this.state.couponRewardItem_13_Value
                        ,itemID14,this.state.couponRewardItem_14_Value
                        ,itemID15,this.state.couponRewardItem_15_Value
                        ,itemID16,this.state.couponRewardItem_16_Value
                        ,itemID17,this.state.couponRewardItem_17_Value
                        ,itemID18,this.state.couponRewardItem_18_Value
                        ,itemID19,this.state.couponRewardItem_19_Value
                        ,itemID20,this.state.couponRewardItem_20_Value).then(response => {

            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });

        }        
      }
      else if(command === 'DELETE_COUPON'){
        if(this.state.couponID <= 0){
          window.alert(t('Invalid coupon id =') + `${this.state.couponID}`);
          return;
        }

        if(window.confirm(t('Are you delete coupon?'))===true){
          proxy.deleteCouponInfo(this.props.location.state.auth.ukey,command,this.state.couponID).then(response => {
            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    // _QIANHUAN_MAIL
    else if(this.state.menu==='QIANHUAN_API_MAIL'){
      if(command === 'QIANHUAN_INSERT_MAIL'){
        if(this.state.qianhuanMailID <= 0){
          window.alert(t('Invalid Mail id = ') + `${this.state.qianhuanMailID}`);
          return;
        }

        if(window.confirm(t('Do you wanna insert?'))===true){
          let itemID1 = this.state.qianhuanMailRewardItem_1 ? this.state.qianhuanMailRewardItem_1.value : 0;
          let itemID2 = this.state.qianhuanMailRewardItem_2 ? this.state.qianhuanMailRewardItem_2.value : 0;
          let itemID3 = this.state.qianhuanMailRewardItem_3 ? this.state.qianhuanMailRewardItem_3.value : 0;
          let itemID4 = this.state.qianhuanMailRewardItem_4 ? this.state.qianhuanMailRewardItem_4.value : 0;
          let itemID5 = this.state.qianhuanMailRewardItem_5 ? this.state.qianhuanMailRewardItem_5.value : 0;
          let itemID6 = this.state.qianhuanMailRewardItem_6 ? this.state.qianhuanMailRewardItem_6.value : 0;
          let itemID7 = this.state.qianhuanMailRewardItem_7 ? this.state.qianhuanMailRewardItem_7.value : 0;
          let itemID8 = this.state.qianhuanMailRewardItem_8 ? this.state.qianhuanMailRewardItem_8.value : 0;
          let itemID9 = this.state.qianhuanMailRewardItem_9 ? this.state.qianhuanMailRewardItem_9.value : 0;
          let itemID10 = this.state.qianhuanMailRewardItem_10 ? this.state.qianhuanMailRewardItem_10.value : 0;

          if(!this.validItem(itemID1,this.state.qianhuanMailRewardItem_1_Value)) return;
          if(!this.validItem(itemID2,this.state.qianhuanMailRewardItem_2_Value)) return;
          if(!this.validItem(itemID3,this.state.qianhuanMailRewardItem_3_Value)) return;
          if(!this.validItem(itemID4,this.state.qianhuanMailRewardItem_4_Value)) return;
          if(!this.validItem(itemID5,this.state.qianhuanMailRewardItem_5_Value)) return;
          if(!this.validItem(itemID6,this.state.qianhuanMailRewardItem_6_Value)) return;
          if(!this.validItem(itemID7,this.state.qianhuanMailRewardItem_7_Value)) return;
          if(!this.validItem(itemID8,this.state.qianhuanMailRewardItem_8_Value)) return;
          if(!this.validItem(itemID9,this.state.qianhuanMailRewardItem_9_Value)) return;
          if(!this.validItem(itemID10,this.state.qianhuanMailRewardItem_10_Value)) return;


          proxy.setQianhuanMail(this.props.location.state.auth.ukey,command,this.state.qianhuanMailID
                        ,itemID1,this.state.qianhuanMailRewardItem_1_Value
                        ,itemID2,this.state.qianhuanMailRewardItem_2_Value
                        ,itemID3,this.state.qianhuanMailRewardItem_3_Value
                        ,itemID4,this.state.qianhuanMailRewardItem_4_Value
                        ,itemID5,this.state.qianhuanMailRewardItem_5_Value
                        ,itemID6,this.state.qianhuanMailRewardItem_6_Value
                        ,itemID7,this.state.qianhuanMailRewardItem_7_Value
                        ,itemID8,this.state.qianhuanMailRewardItem_8_Value
                        ,itemID9,this.state.qianhuanMailRewardItem_9_Value
                        ,itemID10,this.state.qianhuanMailRewardItem_10_Value).then(response => {

            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });

          this.qianhuanMailInit();
        }
      } else if(command === 'QIANHUAN_UPDATE_MAIL'){
        if(this.state.qianhuanMailID <= 0){
          window.alert(t('Invalid Mail id = ') + `${this.state.qianhuanMailID}`);
          return;
        }

        if(window.confirm(t('Do you wanna update?'))===true){
          let itemID1 = this.state.qianhuanMailRewardItem_1 ? this.state.qianhuanMailRewardItem_1.value : 0;
          let itemID2 = this.state.qianhuanMailRewardItem_2 ? this.state.qianhuanMailRewardItem_2.value : 0;
          let itemID3 = this.state.qianhuanMailRewardItem_3 ? this.state.qianhuanMailRewardItem_3.value : 0;
          let itemID4 = this.state.qianhuanMailRewardItem_4 ? this.state.qianhuanMailRewardItem_4.value : 0;
          let itemID5 = this.state.qianhuanMailRewardItem_5 ? this.state.qianhuanMailRewardItem_5.value : 0;
          let itemID6 = this.state.qianhuanMailRewardItem_6 ? this.state.qianhuanMailRewardItem_6.value : 0;
          let itemID7 = this.state.qianhuanMailRewardItem_7 ? this.state.qianhuanMailRewardItem_7.value : 0;
          let itemID8 = this.state.qianhuanMailRewardItem_8 ? this.state.qianhuanMailRewardItem_8.value : 0;
          let itemID9 = this.state.qianhuanMailRewardItem_9 ? this.state.qianhuanMailRewardItem_9.value : 0;
          let itemID10 = this.state.qianhuanMailRewardItem_10 ? this.state.qianhuanMailRewardItem_10.value : 0;

          if(!this.validItem(itemID1,this.state.qianhuanMailRewardItem_1_Value)) return;
          if(!this.validItem(itemID2,this.state.qianhuanMailRewardItem_2_Value)) return;
          if(!this.validItem(itemID3,this.state.qianhuanMailRewardItem_3_Value)) return;
          if(!this.validItem(itemID4,this.state.qianhuanMailRewardItem_4_Value)) return;
          if(!this.validItem(itemID5,this.state.qianhuanMailRewardItem_5_Value)) return;
          if(!this.validItem(itemID6,this.state.qianhuanMailRewardItem_6_Value)) return;
          if(!this.validItem(itemID7,this.state.qianhuanMailRewardItem_7_Value)) return;
          if(!this.validItem(itemID8,this.state.qianhuanMailRewardItem_8_Value)) return;
          if(!this.validItem(itemID9,this.state.qianhuanMailRewardItem_9_Value)) return;
          if(!this.validItem(itemID10,this.state.qianhuanMailRewardItem_10_Value)) return;


          proxy.updateQianhuanMail(this.props.location.state.auth.ukey,command,this.state.qianhuanMailID
                        ,itemID1,this.state.qianhuanMailRewardItem_1_Value
                        ,itemID2,this.state.qianhuanMailRewardItem_2_Value
                        ,itemID3,this.state.qianhuanMailRewardItem_3_Value
                        ,itemID4,this.state.qianhuanMailRewardItem_4_Value
                        ,itemID5,this.state.qianhuanMailRewardItem_5_Value
                        ,itemID6,this.state.qianhuanMailRewardItem_6_Value
                        ,itemID7,this.state.qianhuanMailRewardItem_7_Value
                        ,itemID8,this.state.qianhuanMailRewardItem_8_Value
                        ,itemID9,this.state.qianhuanMailRewardItem_9_Value
                        ,itemID10,this.state.qianhuanMailRewardItem_10_Value).then(response => {

            window.alert(t('Success!'));
            this.select();
          }).catch(err => {
            console.log(err);
          });

          //this.qianhuanMailInit();
        }
      } else if(command === 'QIANHUAN_DELETE_MAIL'){
        if(this.state.qianhuanMailID <= 0){
          window.alert(t('Invalid Mail id = ') + `${this.state.qianhuanMailID}`);
          return;
        }

        if(window.confirm(t('Do you wanna delete this info?'))===true){
          proxy.deleteQianhuanMail(this.props.location.state.auth.ukey,command,this.state.qianhuanMailID).then(response => {
            this.select();
            this.qianhuanMailInit();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    //#endif _QIANHUAN_MAIL
    // _COMPLAINT
    else if(this.state.menu==='COMPLAINT'){

    }
  }

  commandRow = (command,row) => {
    const { t } = this.props; // t 함수를 this.props에서 가져옵니다.
    if(this.state.menu==='NOTICE'){
      if(command === 'DELETE_NOTICE'){
        if(window.confirm(t('Are you delete notice?'))===true){
          proxy.deleteNotice(this.props.location.state.auth.ukey,command,row.senderUkey,row.idx).then(response => {
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
    /*
    // coupon
    else if(this.state.menu==='COUPON'){
      if(command === 'DELETE_COUPON'){
        if(window.confirm(t('Are you delete coupon?'))===true){
          proxy.deleteCouponInfo(this.props.location.state.auth.ukey,command,row.type_id).then(response => {
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    } */
    // _COMPLAINT
    else if(this.state.menu==='COMPLAINT'){
      if(command === 'UPDATE_COMPLETE'){
        if(window.confirm(t('Do you swap complete status?'))===true){

          proxy.updateComplaintComplete(this.props.location.state.auth.ukey,command,row.complaint_id).then(response => {
            this.select();
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
  }

  render() {
    const { t } = this.props; // useTranslation 훅에서 t 함수를 가져옴

    // 콤보박스용 옵션 데이터 추가 (레이블에 설명 포함)
    const couponTypeOptions = [
      { value: 0, label: t('type_0') },  // 설명 추가
      { value: 1, label: t('type_1') },
      { value: 11, label: t('type_11') },
      { value: 2, label: t('type_2') },
      { value: 21, label: t('type_21') },
    ];

    let servertime = Math.floor(Number(datetime.DateToYYYYMMddHHmmss( new Date()))/100)*100;
    return (

      <div className="body"> 

        <div className="left-list">
          <div className="title">{t('INDEX')}</div>
          <li onClick = {(e) => {this.setMenu('POST')}}>{t('POST')}</li>
          <li onClick = {(e) => {this.setMenu('NOTICE')}}>{t('NOTICE')}</li>
          <li onClick = {(e) => {this.setMenu('IP_BLOCK')}}>{t('IP_BLOCK')}</li>
          <li onClick = {(e) => {this.setMenu('SERVER_STATE')}}>{t('SERVER_MAINTENANCE')}</li>
          <li onClick = {(e) => {this.setMenu('CLIENT_VERSION')}}>{t('CLIENT_VERSION')}</li>
          <li onClick = {(e) => {this.setMenu('SEND_ITEMS_BATCH')}}>{t('SEND_ITEMS_BATCH')}</li>
          <li onClick = {(e) => {this.setMenu('COUPON')}}>{t('COUPON')}</li>
          <li onClick = {(e) => {this.setMenu('SEARCH_USED_COUPON')}}>{t('SEARCH_USED_COUPON')}</li>
          <li onClick = {(e) => {this.setMenu('COMPLAINT')}}>{t('COMPLAINT')}</li>
          <li onClick = {(e) => {this.setMenu('QIANHUAN_API_MAIL')}}>{t('QIANHUAN_API_MAIL')}</li>
        </div>

        <div className="right-top-input">
          <div className="title">{"EDITOR"}</div>  
          { 
            this.state.menu==='POST' ? 
              <React.Fragment>
                <div className="info">{t('[ POST ]')}</div> 
                <div className="command">
                  <label htmlFor="sender">{t('sender name')}</label>
                  <input type="text" placeholder={t('input sender name')} id="postSender" value={this.state.postSender} onChange={this.handleInputChange}/>
                  <label htmlFor="sender">{t('post message')}</label>
                  <input className="msg" type="text" placeholder={t('input post message')} id="postMsg" value={this.state.postMsg} onChange={this.handleInputChange}/>
                  <label htmlFor="sender">{t('expires days')}</label>
                  <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input expires days')} id="postValidDays" value={this.state.postValidDays} onChange={this.handleInputChange}/> 
                  <label htmlFor="sender">{t('attached item')}</label>
                  <ReactSelect className="select" placeholder={t('select item')} value={this.state.postItem} options={this.props.location.state.itemNames} onChange={this.handlePostItemChange}  height={24}/>
                  <label htmlFor="sender">{t('attached item value')}</label>
                  <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input item value')} id="postItemValue" value={this.state.postItemValue} onChange={this.handleInputChange}/> 
                  <button onClick = {(e) => {this.update('SEND_POST')}}>{t('ALL USER SEND POST')}</button>
                </div>
              </React.Fragment>
            :
            this.state.menu==='NOTICE' ? 
              <React.Fragment>
                <div className="info">{t('[ NOTICE ]')}</div> 
                <div className="search"></div>
                <button onClick = {this.select}>{t('LOOKUP RECENT LIST')}</button>
                <div className="command">
                  <br/>
                  <label htmlFor="sender">{t('select world')}</label>
                  <ReactSelect className="select" placeholder={t('select world')} value={this.state.noticeWorld} options={this.state.noticeWorlds} onChange={this.handleNoticeWorldChange} />
                  <label htmlFor="sender">{t('message')}</label>
                  <input className="msg" type="text" placeholder={t('input message')} id="noticeMsg" value={this.state.noticeMsg} onChange={this.handleInputChange}/> 
                  <label htmlFor="switch">{t('Would you like to make a reservation?')}</label>
                  <Switch onChange={this.handleNoticeReservationChange} checked={this.state.noticeReservation} />
                  { this.state.noticeReservation 
                  ? <div className="duration">
                    <label className="start-label" htmlFor="noticeStartime">{t('time')}</label>
                    <input className="end" type="number" min={this.state.noticeStartime.toString()} step="100" id="noticeStartime" value={this.state.noticeStartime} onChange={this.handleInputChange}/>
                    <label className="end-label" htmlFor="noticeTerm">{t('term mins')}</label>
                    <input className="end"  type="number" placeholder={t('input term')} id="noticeTerm" value={this.state.noticeTerm} onChange={this.handleInputChange}/>
                    <label className="end-label" htmlFor="noticeCount">{t('count')}</label>
                    <input className="end" type="number" placeholder={t('input count')} id="noticeCount" value={this.state.noticeCount} onChange={this.handleInputChange}/> 
                    </div>
                  : <br/>
                  }
                  <button onClick = {(e) => {this.update('SEND_NOTICE')}}>{t('SEND NOTICE')}</button>
                </div>
              </React.Fragment>
            :
            this.state.menu==='IP_BLOCK' ? 
              <React.Fragment>
                <div className="info">{t('[ IP BLOCK ]')}</div> 
                <div className="search"></div>
                <button onClick = {this.select}>{t('SEARCH BLOCK IP')}</button>
                <div className="command">
                  <label htmlFor="ipAddress">{t('ip address for block')}</label>
                  <input className="input" placeholder={t('input ip address for block')} id="ipBlock" value={this.state.ipBlock} onChange={this.handleInputChange}/> 
                  <label htmlFor="sender">{t('block hours')}</label>
                  <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder={t('input block hours')} id="ipBlockHours" value={this.state.ipBlockHours} onChange={this.handleInputChange}/> 
                  <label htmlFor="sender">{t('reason')}</label>
                  <input className="msg" type="text" placeholder={t('input reason')} id="ipBlockReason" value={this.state.ipBlockReason} onChange={this.handleInputChange}/> 
                  <button onClick = {(e) => {this.update('IP_BLOCK')}}>{t('IP BLOCK')}</button>
                  <br/><br/>
                  <label htmlFor="ipAddress">{t('ip address for unblock')}</label>
                  <input className="input" placeholder={t('input ip address for unblock')} id="ipUnBlock" value={this.state.ipUnBlock} onChange={this.handleInputChange}/> 
                  <button onClick = {(e) => {this.update('IP_UNBLOCK')}}>{t('IP UNBLOCK')}</button>
                </div>
              </React.Fragment>
            :
            this.state.menu==='SERVER_STATE' ? 
              <React.Fragment>
                <div className="info">{t('[ Server Maintenance ]')}</div> 
                <div className="search"></div>
                  <button onClick = {this.select}>{t('Check Server Maintenance')}</button>
                <div className="command">
                  { this.state.serverState >= 0
                    ? this.state.serverState === 0 
                      ? <React.Fragment>
                          <br/>
                          <div>{t('Server\'s Not Under Maintenance')}</div>
                          <br/>
                          <label htmlFor="start">{t('maintenance time')}</label>
                          <div className="duration">
                            <input className="start" type="number" min={servertime.toString()} step="100" id="serverBlockStarttime" value={this.state.serverBlockStarttime} onChange={this.handleInputChange}/>
                            <label className="end-label">~</label>
                            <input className="end" type="number" min={servertime.toString()} step="100" id="serverBlockEndtime" value={this.state.serverBlockEndtime} onChange={this.handleInputChange}/>
                          </div>
                          <button className="duration-button" onClick = {(e) => {this.update('SERVER_BLOCK')}}>{t('Update Maintenance Time')}</button>
                        </React.Fragment>
                      : <React.Fragment>
                          <br/>
                          <div>{t('Server\'s Under Maintenance')}</div> 
                          <br/>
                          <label htmlFor="start">{t('maintenance time')}</label>
                          <div className="duration">
                            <input className="start" type="number" value={this.state.serverBlockStarttime} readOnly/>
                            <label className="end-label">~</label>
                            <input className="end" type="number" value={this.state.serverBlockEndtime} readOnly/>
                          </div>
                          <button className="duration-button" onClick = {(e) => {this.update('SERVER_UNBLOCK')}}>{t('Update Maintenance Time')}</button>
                        </React.Fragment>
                    : ''
                  }
                </div>
              </React.Fragment>
            :
            this.state.menu==='CLIENT_VERSION' ? 
              <React.Fragment>
                <div className="info">{t('[ CLIENT VERSION ]')}</div> 
                <div className="search"></div>
                  <button onClick = {this.select}>{t('CHECK CLIENT VERSION')}</button>
                { this.state.clientVersion !== ''
                ? <div className="command">
                    <br/>
                    <label htmlFor="clientVersion">{t('client version')}</label>
                    <input placeholder={t('input client version')} id="clientVersion" value={this.state.clientVersion} onChange={this.handleInputChange}/>
                    <button onClick = {(e) => {this.update('CLIENT_VERSION')}}>{t('CHANGE CLIENT VERSION')}</button>
                  </div>
                : '' }
              </React.Fragment>
            :
            this.state.menu==='SEND_ITEMS_BATCH' ? 
              <React.Fragment>
                <div className="info">{t('[ SEND ITEMS BATCH ]')}</div> 
                <div className="search">
                    <label>{t('get excel file')}</label>
                    <input type="file" onChange={this.handleGetExcelFileChange} style={{ padding: "10px" }}/>
                </div>
                { this.state.sendItemBatchFileName !== ''
                ? <div className="command">
                    <br/>
                    <button onClick = {(e) => {this.update('SEND_ITEMS_BATCH')}}>{t('SEND ITEMS')}</button>
                 </div>
                : '' }
              </React.Fragment>
//            : ''
            :
            this.state.menu==='COUPON' ? 
              <React.Fragment>
                <div className="coupon_info">{t('[ COUPON ]')}</div> 
                <div className="coupon_search">
                  <button onClick = {this.select}>{t('Show COUPON LIST')}</button>
                </div>
                <div className="coupon_command">
                  <div className="basic" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponID" style={{fontSize: '12px', width: '100px', marginRight: '10px' }}>{t('coupon id')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="couponID" value={this.state.couponID} onChange={this.handleInputChange} style={{width: '80px'}}/>

                      {/* 새로 추가된 버튼으로 팝업창을 엽니다 */}
                      <button onClick={this.handleSaveCouponData} style={{marginLeft: '20px'}}>{t('Save Coupon Codes')}</button>                      
                      <button 
                        onClick={this.handleCouponMakeOpenModal} 
                        style={{marginLeft: '10px'}} 
                        disabled={(this.state.couponType === 1 || this.state.couponType === 11)} // 쿠폰 타입이 1 또는 11이 아닐 때 비활성화
                      >
                        {t('Generate Coupon Codes')}
                      </button>
                      {/* 팝업창 내용 */}
                      <Modal isOpen={this.state.couponMakeShowModal} onRequestClose={this.handleCouponMakeCloseModal}
                        style={{
                          content: {
                            width: '500px',  // 너비 설정
                            height: '300px', // 높이 설정
                            margin: 'auto',  // 화면 가운데에 정렬
                            padding: '20px'  // 내부 패딩 설정
                          },
                          overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'  // 배경 오버레이 설정
                          }
                        }}                      
                      >
                        <h2>{t('Generate Coupon Codes')}</h2>
                        <input
                          type="number"
                          placeholder={t('Enter quantity to generate')}
                          value={this.state.couponMakeQty}
                          onChange={this.handleCouponMakeQtyChange}
                          min="1"
                          max="10000"
                        />
                        <button onClick={this.handleCouponMake}>{t('Generate')}</button>
                        <button onClick={this.handleCouponMakeCloseModal}>{t('Close')}</button>
                      </Modal>                      
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponDesc" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('desc')}   </label>
                      <input type="text" placeholder={t('desc')}  id="couponDesc" value={this.state.couponDesc} onChange={this.handleInputChange} style={{width: '400px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponCode" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('coupon name')}</label>
                      {/*<input type="text" placeholder={t('coupon name')} id="couponCode" value={this.state.couponCode} onChange={this.handleInputChange} style={{width: '200px'}}/>*/}
                      <input type="text" placeholder={t('coupon name')} id="couponCode" value={this.state.couponCode} onChange={this.handleInputChange} 
                        style={{width: '200px'}}
                        disabled={!(this.state.couponType === 1 || this.state.couponType === 11)} // 쿠폰 타입이 1 또는 11이 아닐 때 비활성화
                      />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponType" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('coupon type')}</label>
                      {/*<input type="number" min="0" max="2" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="1" id="couponType" value={this.state.couponType} onChange={this.handleInputChange} style={{width: '50px'}} disabled/>*/}
                      {/* 콤보박스 추가 */}
                      <ReactSelect
                        ClassName="coupon-type-custom"
                        value={couponTypeOptions.find(option => option.value === this.state.couponType)} // 현재 선택된 값을 설정
                        options={couponTypeOptions} // 옵션 리스트
                        onChange={(selectedOption) => this.setState({ couponType: selectedOption.value })} // 선택 시 상태 변경
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: '300px', // 너비 설정
                            height: '30px', // 높이 설정
                            fontSize: '12px', // 폰트 크기 설정
                          }),
                          control: (provided) => ({
                            ...provided,
                            width: '300px', // 너비 설정
                            height: '20px', // 높이 설정
                            fontSize: '12px', // 폰트 크기 설정
                            backgroundColor: '#fff', // 드롭다운 배경색 설정 (불투명)
                          }),
                          menu: (provided) => ({
                            ...provided,
                            width: '300px', // 메뉴 너비 설정
                            height: '20px', // 높이 설정
                            fontSize: '12px', // 폰트 크기 설정
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            padding: '0', // 기본 패딩 제거
                            backgroundColor: '#fff', // 배경색 설정
                          }),                          
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#0052CC' : state.isFocused ? '#E0E0E0' : undefined,
                            color: state.isSelected ? '#fff' : '#000', // 선택된 항목 색상 설정
                          }),                          
                        }}                        
                      />                      
                    </div>
            
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                      <label htmlFor="couponStartTime" style={{ fontSize: '12px', width: '100px', marginRight: '10px' }}>{t('start time')}</label>
                      <ReactDatetime
                        inputProps={{ id: 'couponStartTime' }}
                        value={this.state.couponStartDatetime}
                        onChange={this.handleCouponStartTimeChange}
                        dateFormat="YYYY-MM-DD" // 원하는 형식으로 설정 가능
                        timeFormat="HH:mm:ss" // 시간 형식 설정
                        closeOnSelect={true} // 날짜 선택 후 자동으로 닫히도록 설정
                      />
                    </div>                    
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                      <label htmlFor="couponEndTime" style={{ fontSize: '12px', width: '100px', marginRight: '10px' }}>{t('end time')}</label>
                      <ReactDatetime
                        inputProps={{ id: 'couponEndTime' }}
                        value={this.state.couponEndDatetime}
                        onChange={this.handleCouponEndTimeChange}
                        dateFormat="YYYY-MM-DD" // 원하는 형식으로 설정 가능
                        timeFormat="HH:mm:ss" // 시간 형식 설정
                        closeOnSelect={true} // 날짜 선택 후 자동으로 닫히도록 설정
                      />
                    </div>


                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponPostSender" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('post sender')}</label>
                      <input type="text" placeholder={t('GM')} id="couponPostSender" value={this.state.couponPostSender} onChange={this.handleInputChange} style={{width: '100px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponPostKeepDay" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('post keep day')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="7" id="couponPostKeepDay" value={this.state.couponPostKeepDay} onChange={this.handleInputChange} style={{width: '30px'}}/> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponPostTextID" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('post text ID')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="couponPostTextID" value={this.state.couponPostTextID} onChange={this.handleInputChange} style={{width: '30px'}} disabled/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponPostMsg" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('post msg')}</label>
                      <input type="text" placeholder={t('msg')} id="couponPostMsg" value={this.state.couponPostMsg} onChange={this.handleInputChange} style={{width: '300px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="coupocouponRewardGoldnPostMsg" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('Gold')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="couponRewardGold" value={this.state.couponRewardGold} onChange={this.handleInputChange} style={{width: '80px'}}/> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardCashA" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('Green Ruby')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="couponRewardCashA" value={this.state.couponRewardCashA} onChange={this.handleInputChange} style={{width: '80px'}}/> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardCashB" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('Red Ruby')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="couponRewardCashB" value={this.state.couponRewardCashB} onChange={this.handleInputChange} style={{width: '80px'}}/> 
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_1" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item1')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_1} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem1Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_1_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_1_Value" value={this.state.couponRewardItem_1_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_2" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item2')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_2} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem2Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_2_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_2_Value" value={this.state.couponRewardItem_2_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_3" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item3')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_3} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem3Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_3_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_3_Value" value={this.state.couponRewardItem_3_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_4" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item4')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_4} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem4Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_4_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_4_Value" value={this.state.couponRewardItem_4_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_5" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item5')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_5} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem5Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_5_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_5_Value" value={this.state.couponRewardItem_5_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_6" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item6')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_6} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem6Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_6_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_6_Value" value={this.state.couponRewardItem_6_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_7" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item7')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_7} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem7Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_7_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_7_Value" value={this.state.couponRewardItem_7_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_8" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item8')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_8} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem8Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_8_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_8_Value" value={this.state.couponRewardItem_8_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_9" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item9')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_9} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem9Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_9_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_9_Value" value={this.state.couponRewardItem_9_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_10" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item10')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_10} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem10Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_10_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_10_Value" value={this.state.couponRewardItem_10_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_11" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item11')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_11} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem11Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_11_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_11_Value" value={this.state.couponRewardItem_11_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_12" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item12')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_12} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem12Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_12_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_12_Value" value={this.state.couponRewardItem_12_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_13" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item13')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_13} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem13Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_13_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_13_Value" value={this.state.couponRewardItem_13_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_14" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item14')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_14} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem14Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_14_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_14_Value" value={this.state.couponRewardItem_14_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_15" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item15')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_15} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem15Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_15_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_15_Value" value={this.state.couponRewardItem_15_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_16" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item16')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_16} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem16Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_16_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_16_Value" value={this.state.couponRewardItem_16_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_17" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item17')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_17} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem17Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_17_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_17_Value" value={this.state.couponRewardItem_17_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_18" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item18')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_18} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem18Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_18_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_18_Value" value={this.state.couponRewardItem_18_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_19" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item19')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_19} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem19Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_19_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_19_Value" value={this.state.couponRewardItem_19_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="couponRewardItem_20" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item20')}</label>
                      <ReactSelect
                        className="coupon-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.couponRewardItem_20} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleCouponItem20Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="couponRewardItem_20_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="couponRewardItem_20_Value" value={this.state.couponRewardItem_20_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>                    
                  </div>

                  <button onClick = {(e) => {this.update('INSERT_COUPON')}} style={{marginRight: '10px'}}>{t('INSERT COUPON')}</button>
                  <button onClick = {(e) => {this.update('UPDATE_COUPON')}} style={{marginRight: '10px'}}>{t('UPDATE COUPON')}</button>
                  <button onClick = {(e) => {this.update('DELETE_COUPON')}}>{t('DELETE COUPON')}</button>
                </div>
              </React.Fragment>
            :
            this.state.menu==='SEARCH_USED_COUPON' ? 
              <React.Fragment>
                <div className="info">{t('[ SEARCH USED COUPON ]')}</div> 
                <div className="search">
                  <label htmlFor="switch">{t('# Choose search type')}</label>
                  <div className="searchuser">
                  <label>
                      <input 
                        type="radio" 
                        value="0" 
                        checked={this.state.searchUsedCouponType === 0} 
                        onChange= {(e) => {this.setState({searchUsedCouponType:0,resultRows:''}); this.searchUsedCouponInit2();}}
                      /> {t('coupon name')}
                    </label>                    
                    <label>
                      <input 
                        type="radio" 
                        value="1" 
                        checked={this.state.searchUsedCouponType === 1} 
                        onChange={(e) => {this.setState({searchUsedCouponType:1,resultRows:''}); this.searchUsedCouponInit2();}}
                      /> {t('QuickSDK Account ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="2" 
                        checked={this.state.searchUsedCouponType === 2} 
                        onChange={(e) => {this.setState({searchUsedCouponType:2,resultRows:''}); this.searchUsedCouponInit2();}}
                      /> {t('Game Account ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="3" 
                        checked={this.state.searchUsedCouponType === 3} 
                        onChange={(e) => {this.setState({searchUsedCouponType:3,resultRows:''}); this.searchUsedCouponInit2();}}
                      /> {t('World User ID')}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="4" 
                        checked={this.state.searchUsedCouponType === 4} 
                        onChange= {(e) => {this.setState({searchUsedCouponType:4,resultRows:''}); this.searchUsedCouponInit2();}}
                      /> {t('Nickname')}
                    </label>
                  </div>
                  <br />
                    {this.state.searchUsedCouponType === 0 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="couponCode">{t('coupon name')}</label>
                          <input type="text" placeholder={t('input coupon code')} id="searchUsedCouponCode" value={this.state.searchUsedCouponCode} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>                      
                      :
                      this.state.searchUsedCouponType === 1 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="accountId">{t('Platform Account ID')}</label>
                          <input className="input" placeholder={t('input platform account id')} id="searchUsedCouponPlatformAccountID" value={this.state.searchUsedCouponPlatformAccountID} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      this.state.searchUsedCouponType === 2 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="gameAccountID">{t('Game Account ID')}</label>
                          <input type="number" placeholder={t('input game account id')} id="searchUsedCouponAccountID" value={this.state.searchUsedCouponAccountID} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      this.state.searchUsedCouponType === 3 ?
                      <React.Fragment>
                        <div className="input-group">
                          <label htmlFor="gameUserId">{t('Game User ID')}</label>
                          <input type="number" placeholder={t('input world user id')} id="searchUsedCouponUserID" value={this.state.searchUsedCouponUserID} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                        </div>
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <div className="input-group">
                          <div className="input-world">
                            <label htmlFor="worldIdx">{t('select world')}</label>
                            <ReactSelect className="select-world-custom" placeholder={t('select world')} value={this.state.searchUsedCouponWorldID} options={this.props.location.state.worldNames} onChange={this.handleWorldIdxChange} />
                          </div>
                          <div className="input-character">
                            <label htmlFor="characterNick">{t('Character Name')}</label>
                            <input type="text" placeholder={t('input character nickname')} id="searchUsedCouponCharacterName" value={this.state.searchUsedCouponCharacterName} onChange={this.handleInputChange}  onKeyPress={this.handleKeyPress} />
                          </div>
                        </div>
                      </React.Fragment>
                    }                  
                </div>                
                <button onClick = {this.select}>{t('SEARCH')}</button> 
              </React.Fragment>
//              : ''            
              : 
              // _COMPLAINT
              this.state.menu==='COMPLAINT' ? 
              <React.Fragment>
                <div className="info">{t('[ USER COMPLAINT ]')}</div> 
                <div className="complaint_search">
                <button onClick = {this.select}>{t('Search')}</button>
                </div>
                <div className="complaint_info">
                  <div className="basic" style={{display: 'flex', flexDirection: 'column'}}>

                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px'}}>
                        <label htmlFor="complaintID" style={{fontSize: '12px', width: '90px', marginRight: '10px' }}>{t('complaint id')}</label>
                        <input type="number" min="0" placeholder="0" id="complatinID" value={this.state.complaint_selectedRow.complaintID} style={{width: '130'}} disabled/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                      <div style={{display: 'flex', flexDirection: 'row', marginRight: '20px'}}>
                      <label htmlFor="worldID" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('world_id')}</label>
                      <input type="number" placeholder="0" id="worldID" value={this.state.complaint_selectedRow.worldID} style={{width: '130'}} disabled/>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row'}}>
                        <label htmlFor="complaintDate" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('reg date')}</label>
                        <input type="text" placeholder="0" id="complaintDate" value={this.state.complaint_selectedRow.complaintDate} style={{width: '130'}} disabled/>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                      <div style={{display: 'flex', flexDirection: 'row', marginRight: '20px'}}>
                        <button 
                          style={{ fontSize: '12px', width: '90px', marginRight: '10px', cursor: 'pointer', textAlign: 'left'}}
                          onClick={() => this.copyToClipboard(this.state.complaint_selectedRow.userID)}
                        > {t('user_id')}
                        </button>                        
                        <input type="number" placeholder="0" id="user_id" value={this.state.complaint_selectedRow.userID} style={{width: '130'}} disabled/>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row'}}>
                        <label htmlFor="complaintNickName" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('nick')}</label>
                        <input type="text" placeholder="0" id="complaintNickName" value={this.state.complaint_selectedRow.nickname} style={{width: '130'}} disabled/>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
                      <div style={{display: 'flex', flexDirection: 'row', marginRight: '20px'}}>
                        <button 
                          style={{ fontSize: '12px', width: '90px', marginRight: '10px', cursor: 'pointer', textAlign: 'left'}}
                          onClick={() => this.copyToClipboard(this.state.complaint_selectedRow.targetUserID)}
                        > {t('target user_id')}
                        </button>
                        <input type="number" placeholder="0" id="target_user_id" value={this.state.complaint_selectedRow.targetUserID} style={{width: '130'}} disabled/>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row'}}>
                        <label htmlFor="targetNickName" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('target nick')}</label>
                        <input type="text" placeholder="0" id="targetNickName" value={this.state.complaint_selectedRow.targetNickname} style={{width: '130'}} disabled/>
                      </div>
                    </div>


                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px'}}>
                      <label htmlFor="complaintMsg" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('complaint msg')}</label>
                      <textarea 
                        id="complaintMsg"
                        placeholder="" 
                        value={this.state.complaint_selectedRow.complaintMsg} 
                        style={{width: '470px', height: '43px'}} 
                        disabled/>
                    </div>
                    {/* */}
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px'}}>
                      <label htmlFor="complaintChat" style={{fontSize: '12px', width: '90px', marginRight: '10px'}}>{t('complaint chat')}</label>
                      <textarea 
                        id="complaintChat" 
                        placeholder="" 
                        value={this.state.complaint_selectedRow.complaintChat} 
                        style={{ width: '470px', height: '43px'}} 
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <Snackbar 
                  open={this.state.snackbarOpen} 
                  autoHideDuration={1500} 
                  onClose={this.handleSnackbarClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert onClose={this.handleSnackbarClose} severity="success">
                    {this.state.snackbarMessage}
                  </Alert>
                </Snackbar>                
              </React.Fragment>
//            :''              
// _QIANHUAN_MAIL
            :
            this.state.menu==='QIANHUAN_API_MAIL' ? 
              <React.Fragment>
                <div className="qianhuan_mail_info">{t('[ QIANHUAN MAIL ]')}</div> 
                <div className="qianhuan_mail_search">
                  <button onClick = {this.select}>{t('Show MAIL LIST')}</button>
                </div>
                <div className="qianhuan_mail_command">
                  <div className="basic" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailID" style={{fontSize: '12px', width: '100px', marginRight: '10px' }}>{t('mail id')}</label>
                      <input type="number" min="0" onKeyPress={(event) => {return event.charCode < 48 || event.charCode > 57}} placeholder="0" id="qianhuanMailID" value={this.state.qianhuanMailID} onChange={this.handleInputChange} style={{width: '80px'}}/>
                    </div>
                   
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_1" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item1')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_1} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem1Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_1_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_1_Value" value={this.state.qianhuanMailRewardItem_1_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_2" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item2')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_2} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem2Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_2_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_2_Value" value={this.state.qianhuanMailRewardItem_2_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_3" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item3')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_3} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem3Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_3_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_3_Value" value={this.state.qianhuanMailRewardItem_3_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_4" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item4')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_4} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem4Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_4_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_4_Value" value={this.state.qianhuanMailRewardItem_4_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_5" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item5')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_5} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem5Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_5_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_5_Value" value={this.state.qianhuanMailRewardItem_5_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_6" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item6')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_6} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem6Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_6_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_6_Value" value={this.state.qianhuanMailRewardItem_6_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_7" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item7')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_7} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem7Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_7_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_7_Value" value={this.state.qianhuanMailRewardItem_7_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_8" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item8')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_8} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem8Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_8_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_8_Value" value={this.state.qianhuanMailRewardItem_8_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_9" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item9')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_9} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem9Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_9_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_9_Value" value={this.state.qianhuanMailRewardItem_9_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                      <label htmlFor="qianhuanMailRewardItem_10" style={{fontSize: '12px', width: '100px', marginRight: '10px'}}>{t('reward item10')}</label>
                      <ReactSelect
                        className="qianhuan-mail-reward-custom" 
                        placeholder={t('select item')} 
                        value={this.state.qianhuanMailRewardItem_10} 
                        options={this.props.location.state.itemNames} 
                        onChange={this.handleQianhuanMailItem10Change}
                      />
                      <label htmlFor="space" style={{ fontSize: '12px', width: '30px', marginRight: '10px', visibility: 'hidden' }}></label>
                      <label htmlFor="qianhuanMailRewardItem_10_Value" style={{ fontSize: '12px', width: '30px', marginRight: '10px' }}>{t('qty')}</label>
                      <input type="number" min="0" onKeyPress={(event) => { return event.charCode < 48 || event.charCode > 57 }} placeholder="0" id="qianhuanMailRewardItem_10_Value" value={this.state.qianhuanMailRewardItem_10_Value} onChange={this.handleInputChange} style={{ width: '80px' }} /> 
                    </div>                    
                  </div>

                  <button onClick = {(e) => {this.update('QIANHUAN_INSERT_MAIL')}}>{t('INSERT INFO')}</button>
                  <button onClick = {(e) => {this.update('QIANHUAN_UPDATE_MAIL')}}>{t('UPDATE INFO')}</button>
                  <button onClick = {(e) => {this.update('QIANHUAN_DELETE_MAIL')}}>{t('DELETE INFO')}</button>
                </div>
              </React.Fragment>
              : ''   
//#endif QIANHUAN_MAIL              
          }
        </div>

{/*     <div className="right-middle-result" style={{ height: 'auto', maxHeight: '500px', overflowY: 'auto' }}>  */}
{/* style={{ height: 'auto', overflowY: 'hidden'}}*/}
        <div className="right-middle-result" >  
          <div className="title">{"RESULT"}
            { this.state.resultRows.length > 0 ? 
            <CSVLink className="export" data={this.state.resultRows} filename={'THE_FOUR_GOD_CS_'+this.state.menu+'.csv'}>EXPORT</CSVLink> : <></> }
          </div> 
          <div className="resultInfo">
            { this.state.resultRows === '' ? '' :
              <React.Fragment>
                <DataGrid 
                  columns={this.state.resultColumns} 
                  rows={this.state.resultRows} 
                  //height={this.state.resultRows.length * 30} // 50000
                  height={20 * (this.state.resultRows.length + 5) } // 50000
                  width={this.state.resultRows.length > 0 ? Object.keys(this.state.resultRows[0]).length * 100 : 0} // 필드 개수 * 100
                  rowHeight={20}
                  enableCellSelect={false}
                  //onSelectedCellChange={s => this.onSelectionCell({topLeft: s, bottomRight: s})}
                  //react-grid-style={{ overflowX: 'scroll', overflowY: 'auto', paddingBottom: '20px' /* 하단에 여백 추가*/ }}
                  onRowClick={(rowIdx, row, column) => this.handleRowDoubleClick(rowIdx, row)}
                />
              </React.Fragment>
            }
          </div>
        </div>

      </div>
    );
  }
}

// withTranslation으로 컴포넌트 래핑
export default withTranslation()(CS);