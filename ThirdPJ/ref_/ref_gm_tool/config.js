//************************************
// cn-test
//************************************
module.exports =
{
  language : 'cn',//kr,cn,vn,en

  port : "2888",

  log: {
    level : "debug",
    dir : "../var/log/bs_crm",
    name : "crm",
  },

  mysql : {
    crm : {
      poolSize : 5,
      ip  : "192.168.150.130",
      port : 3306,
      user : "storm_crm",
      pwd : "stormcrm12#$",
      db : "crmdb"
    },
    global : {
      poolSize : 5,
      ip  : "192.168.150.130",
      port : 3306,
      user : "stormgames",
      pwd : "stormgames",
      db : "w_globaldb"
    },
    w_set:{
      poolSize : 5,
      ip  : "192.168.150.130",
      port : 3306,
      user : "stormgames",
      pwd : "stormgames",
      db : "w_setdb"
    },
    iap : {
      poolSize : 5,
      ip  : "192.168.150.130",
      port : 3306,
      user : "stormgames",
      pwd : "stormgames",
      db : "w_iapdb"
    },
    game : {
      poolSize : 5
    },
  },

  tcp:{
      ip: "192.168.150.130",
      port: 40157,
      timeout : 3000
  }

}