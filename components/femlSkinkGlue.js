const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource:///modules/XPCOMUtils.jsm");
function cerr(e)
{
  Components.utils.reportError(e);
}

function IncomingServer() {
  try{
    //this.wrappedJSObject = this;
    Cu.reportError("In here");
    Cu.import("resource://feml/femlIncomingServer.jsm");
    FemlIncomingServer.call(this);
  } catch(e) {cerr(e);}
}

IncomingServer.prototype = {
  classDescription: "Feml Incoming Server",
  classID:          Components.ID("{14E58292-3341-4642-A55D-4649609B3819}"),
  contractID:       "@mozilla.org/messenger/server;1?type=feml",

  // If SkinkGlue is not installed, then don't lie about the interface. This leads to bug 659606
  QueryInterface: XPCOMUtils.generateQI(
                    Cc["@mesquilla.com/sgincomingserver;1"] ? [Ci.nsIMsgIncomingServer, Ci.msqISgIncomingServer] : []),

  hello: function() {
    Components.utils.reportError("hello world");
  }
}

function MsgProtocolInfo() { try{
  Cu.import("resource://feml/twitterService.jsm");
  Cu.reportError("protocol info import successful");
  TwitterService.call(this);
} catch(e) {cerr(e);}}

MsgProtocolInfo.prototype = {
    classDescription: "Feml Server Protocol Info Service",
    classID:          Components.ID("{13a9e741-e9a6-4975-8039-4328d1112864}"),
    contractID:       "@mozilla.org/messenger/protocol/info;1?type=feml",
    QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgProtocolInfo, Ci.nsIMsgMessageService, Ci.nsIProtocolHandler, Ci.msqISgService])
}

function ResourceFactory() {
  try{
    Cu.import("resource://feml/twitterFolder.jsm");
    Cu.reportError("import success");
    TwitterFolder.call(this);
  } catch(e) {
    cerr(e);
  }
}

ResourceFactory.prototype =
{
  /// XPCOM glue
  classDescription: "feml Message Folder",
  classID:          Components.ID("{aa206cec-1e7b-4d6c-a979-038623944429}"),
  contractID:       "@mozilla.org/rdf/resource-factory;1?name=feml",
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgFolder, Ci.nsIDBChangeListener,
                                           Ci.nsIUrlListener, Ci.nsIJunkMailClassificationListener,
                                           Ci.nsIMsgTraitClassificationListener, Ci.nsIRDFResource,
                                           Ci.msqISgMailFolder, Ci.msqISgJsOverride]),
}

var components = [IncomingServer, MsgProtocolInfo, ResourceFactory];

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule(components);
