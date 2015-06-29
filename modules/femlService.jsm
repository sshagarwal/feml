 var EXPORTED_SYMBOLS = ["FemlService"];

// Create the twitter service
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource:///modules/XPCOMUtils.jsm");

function re(e) {
  dump(e + "\n");
}

function dl(t) {
  dump(t + "\n");
}


var gService;
function getService()
{ try {
  if (!gService)
  {
    gService = Cc["@mesquilla.com/sgservice;1"]
                  .createInstance(Ci.nsIMsgMessageService);
    gService instanceof Ci.nsIMsgProtocolInfo;
    gService instanceof Ci.nsIProtocolHandler;
    gService instanceof Ci.msqIOverride;
    gService instanceof Ci.msqISgService;
    //dl("gService1 is " + gService);
    gService.type = "feml";
  }
  return gService;
} catch(e) {re(e); throw e;}}

function FemlService()
{ try {
  let service = getService();
  this.sgService = service;
  this.__proto__.__proto__ = service;

  // define the overrides
  this.jsService = new FemlServiceOverride(service);
  service.jsParent = this.jsService;
  service.override("msqSgServiceOverridable::DisplayMessage");
  service.override("msqSgServiceOverridable::GetCanLoginAtStartUp");

} catch(e) {re(e); throw e;}}

function FemlServiceOverride(aService) {
  this.wrappedJSObject = this;
  // initialization of member variables
  this.baseService = aService;
}

FemlServiceOverride.prototype = 
{
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgMessageService, Ci.nsIMsgProtocolInfo, Ci.nsIProtocolHandler]),

/* void DisplayMessage (in string aMessageURI, in nsISupports aDisplayConsumer, in nsIMsgWindow aMsgWindow, in nsIUrlListener aUrlListener, in string aCharsetOverride, out nsIURI aURL); */
/*
  void DisplayMessage(in string aMessageURI, 
            in nsISupports aDisplayConsumer, 
            in nsIMsgWindow aMsgWindow,
            in nsIUrlListener aUrlListener, 
            in string aCharsetOverride,
            out nsIURI aURL);
*/
  DisplayMessage: function _DisplayMessage(aMessageURI, aDisplayConsumer, aMsgWindow, aUrlListener, aCharsetOverride, aURL)
  { try {
dump("NOT IMPLEMENTED");
/*
    dump("twitterService.DisplayMessage uri <" + aMessageURI + ">\n");

    // debug create of a channel
    let channel = Cc["@mesquilla.com/sgprotocol;1?type=twitter"]
                    .createInstance(Ci.nsIChannel);
    //dl("Channel is " + channel);
    // make a url object
    let iSgService = this.baseService.base.QueryInterface(Ci.msqISgService);
    let url = iSgService.prepareUrl(aMessageURI, aUrlListener, aMsgWindow);
    //dl("url spec is " + url.spec);
    iSgService.fetchMessageUrl(url, aDisplayConsumer, aMsgWindow, aUrlListener);
    aURL = url;*/
  } catch(e) {re(e)}},

  get canLoginAtStartUp()
  {
    return true;
  },

  GetDefaultServerPort: function(aUseSSL)
  {
    return -1;
    if (!aUseSSL)
      return Ci.nsIPop3URL.DEFAULT_POP3_PORT;
    return Ci.nsIPop3URL.DEFAULT_POP3S_PORT;
  }
}
