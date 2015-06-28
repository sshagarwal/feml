var EXPORTED_SYMBOLS = ["FemlIncomingServer"];

// Create a new twitter server, with an underlying nsIMsgIncomingServer base
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;


Cu.import("resource:///modules/XPCOMUtils.jsm");
Cu.import("resource:///modules/gloda/log4moz.js");
Cu.import("resource://feml/Utils.jsm");
Utils.importLocally(this);
//let log = Log4Moz.getConfiguredLogger("extensions.tweequilla");
//var gStrings = Cc["@mozilla.org/intl/stringbundle;1"]
//                .getService(Ci.nsIStringBundleService)
//                .createBundle("chrome://tweequilla/locale/extension.properties");

function FemlIncomingServer()
{
  try {var server = Cc["@mesquilla.com/sgincomingserver;1"]
                      .createInstance(Ci.nsIMsgIncomingServer);
  } catch (e) {
    // This fails if skinkglue is not installed. There is little that we can do about
    //  it here, but the main addon will detect this and try to fix. Just note it.
    Cc["@mozilla.org/consoleservice;1"]
      .getService(Ci.nsIConsoleService)
      .logStringMessage("Missing New Account Types addon");
      return;
   }

  try {
  server instanceof Ci.msqISgIncomingServer;
  server instanceof Ci.msqIOverride;
  this.__proto__.__proto__ = server;

  // define the overrides
  this.jsServer = new TwitterIncomingServerOverride(server);
  server.jsParent = this.jsServer;
  server.override("msqSgIncomingServerOverridable::GetNewMessages");
  server.override("msqSgIncomingServerOverridable::PerformBiff");
  server.override("msqSgIncomingServerOverridable::GetLocalPath");
  server.override("msqSgIncomingServerOverridable::GetRootFolder");
  server.override("msqSgIncomingServerOverridable::GetServerRequiresPasswordForBiff");
  server.override("msqSgIncomingServerOverridable::GetCanSearchMessages");
  server.override("msqSgIncomingServerOverridable::GetCanHaveFilters");
  server.override("msqSgIncomingServerOverridable::GetMsgStore");
  server.override("msqSgIncomingServerOverridable::SetKey");

  // initializations
  server.saveLocalStoreType("twitter");
  // server.saveAccountManagerChrome("am-serverwithnoidentities.xul");

  } catch(e) {
    re(e);
  }
}

function TwitterIncomingServerOverride(aIncomingServer) {
  try {
    // initialization of member variables
    this.wrappedJSObject = this;
    this.baseServer = aIncomingServer;
    Cu.import("resource://feml/twitterStore.jsm");
    this._msgStore = new TwitterStore;
  } catch (e) {
    re(e);
  }
}

TwitterIncomingServerOverride.prototype = 
{
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgIncomingServer]),

  // **** nsIMsgIncomingServer overrides

  set key(newval) { try {
    // This is the initialization of the server
    let skinkServer = this.baseServer.base.QueryInterface(Ci.nsIMsgIncomingServer);
    skinkServer.key = newval;
    let seconds = skinkServer.getIntValue("secondsToLeaveUnavailable");
    if (seconds == 0)
    {
      // set a default value
      skinkServer.setIntValue("secondsToLeaveUnavailable",  2592000);
    }
  } catch (e) {re(e);}},

  getNewMessages: function _getNewMessages(aFolder, aMsgWindow, aUrlListener)
  { 
    try {
      //dl('getNewMessages for folder ' + aFolder.name);
      let subfolders = Cc["@mozilla.org/supports-array;1"]
                         .createInstance(Ci.nsISupportsArray);
      aFolder.ListDescendents(subfolders);
      //dl('found ' + subfolders.Count() + ' descendents');
      for (let index = 0; index < subfolders.Count(); index++)
      {
        let folder = subfolders.QueryElementAt(index, Ci.nsIMsgFolder);
        if (folder.getFlag(Ci.nsMsgFolderFlags.CheckNew))
        {
          //dl('need to update folder ' + folder.name);
          folder.updateFolder(aMsgWindow);
        }
      }
    } catch(e) {
      re(e);
    }
  },

  performBiff: function _performBiff(aMsgWindow)
  { 
    try {
      let server = this.baseServer;
      server.getNewMessages(server.rootMsgFolder, aMsgWindow, null);
    } catch(e) {
      re(e);
    }
  },

  get serverRequiresPasswordForBiff()
  {
    return false;
  },

  get localPath()
  { 
    try {
      let server = this.baseServer;

      let serverPath;
      try {
        serverPath = server.getFileValue("directory-rel", "directory");
      } catch (e) {}
      if (serverPath)
        return serverPath;

    let protocolInfo = Cc["@mozilla.org/messenger/protocol/info;1?type=feml"]
                         .getService(Ci.nsIMsgProtocolInfo);
    let defaultLocalPath = protocolInfo.defaultLocalPath;
    // Create if needed. Normal error is file exists
    try {
      defaultLocalPath.create(Ci.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));
      Cu.reportError("Def path");
    } catch(e) {}
    if (!defaultLocalPath.exists())
      throw "Local path for twitter account could not be created";

    serverPath = defaultLocalPath.clone();
    serverPath.append(server.username + '@' + server.hostName);
    // Create if missing. Normal error is directory exists, which implies that
    //  we are recreating a twitter account, and will then use the old account
    //  directory.
    try {
      serverPath.create(Ci.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));
    } catch (e) {}
    if (!serverPath.exists())
      throw ('could not create account path for twitter account');

    server.localPath = serverPath;
    return serverPath;
  }  catch(e) {re(e);}},

  get canSearchMessages()
  {
    return true;
  },

  get canHaveFilters()
  {
    return false;
  },

  // message store to use for the folders under this server.
  //readonly attribute nsIMsgPluggableStore msgStore;
  get msgStore()
  {
    return this._msgStore;
  },

  get rootFolder()
  {
    Cu.import("resource://feml/twitterFolder.jsm");
    Cu.reportError("folder import success");
    TwitterFolder.call(this);
    return TwitterFolder.rootFolder;
  }
}

// json pretty print from http://stackoverflow.com/questions/130404/javascript-data-formatting-pretty-printer
function dumpObjectIndented(obj, indent)
{
  var result = "";
  if (indent == null) indent = "";

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      }
      else
      {
        // Recursive dump
        // (replace "  " by "\t" or something else if you prefer)
        var od = DumpObjectIndented(value, indent + "  ");
        // If you like { on the same line as the key
        //value = "{\n" + od + "\n" + indent + "}";
        // If you prefer { and } to be aligned
        value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + "'" + property + "' : " + value + ",\n";
  }
  return result.replace(/,\n$/, "");
}
