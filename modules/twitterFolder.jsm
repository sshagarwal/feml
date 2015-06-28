 var EXPORTED_SYMBOLS = ["TwitterFolder"];

// Create a new twitter folder, with an underlying nsIMsgFolder base
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource:///modules/XPCOMUtils.jsm");
Cu.import("resource:///modules/gloda/log4moz.js");
Cu.import("resource://feml/Utils.jsm");

Utils.importLocally(this);

function createAtom(aName)
{
  return Cc["@mozilla.org/atom-service;1"]
    .getService(Ci.nsIAtomService).getAtom(aName);
}

var gFolderLoadedAtom = createAtom("FolderLoaded");

function re(error)
{
  if (error)
    log.error('javascript error: ' + error + '\n');
  /*
  let jsFrame;
  if (!error || !(jsFrame = error.stack))
    jsFrame = Components.stack;
  while (jsFrame)
  {
    log.debug(jsFrame.toString() + '\n');
    jsFrame = jsFrame.caller;
  }
  if (error)
  {
    Cu.reportError(error);
    throw(error);
  }
  */
}

function dl(t) {
  dump(t + "\n");
}

function TwitterFolder()
{
  let folder = Cc["@mesquilla.com/sgmailfolder;1"]
                 .createInstance(Ci.nsIMsgFolder);
  folder instanceof Ci.nsIDBChangeListener;
  folder instanceof Ci.nsIUrlListener;
  folder instanceof Ci.nsIJunkMailClassificationListener;
  folder instanceof Ci.nsIMsgTraitClassificationListener;
  folder instanceof Ci.nsIRDFResource;
  folder instanceof Ci.msqISgMailFolder;
  folder instanceof Ci.msqIOverride;
  this.__proto__.__proto__ = folder;

  folder.saveServerType("twitter");

  // define the overrides
  // Get the parent cpp class to allow calling overridden base functions
  this.jsFolder = new TwitterFolderOverride(folder);
  folder.jsParent = this.jsFolder;
  folder.override("msqSgMailFolderOverridable::UpdateFolder");
  folder.override("msqSgMailFolderOverridable::GetRootFolder");
  folder.override("msqSgMailFolderOverridable::GetSubFolders");
  folder.override("msqSgMailFolderOverridable::GetCanFileMessages");
  folder.override("msqSgMailFolderOverridable::GetCanDeleteMessages");
  folder.override("msqSgMailFolderOverridable::GetCanCreateSubfolders");
  folder.override("msqSgMailFolderOverridable::GetCanRename");
  folder.override("msqSgMailFolderOverridable::GetCanCompact");
  folder.override("msqSgMailFolderOverridable::ApplyRetentionSettings");

}

function TwitterFolderOverride(aFolder) {
  this.wrappedJSObject = this;
  // initialization of member variables
  this.baseFolder = aFolder;
  this.mNeedFolderLoadedEvent = false;
  this.needsBaseFolders = true;
}

TwitterFolderOverride.prototype = 
{
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgFolder]),

  // **** nsIMsgFolder overrides
  applyRetentionSettings: function _applyRetentionSettings()
  {
    if (this.baseFolder.getFlag(Ci.nsMsgFolderFlags.Virtual))
      return;
    let rs = this.baseFolder.retentionSettings;
    if (rs.keepUnreadMessagesOnly || (rs.retainByPreference != Ci.nsIMsgRetentionSettings.nsMsgRetainAll))
    {
      this.baseFolder.msgDatabase.applyRetentionSettings(rs, false);
    }
  },

  updateFolder: function _updateFolder(aWindow)
  { try {
    //log.debug("twitterFolder: updateFolder");
    this.applyRetentionSettings();
    let server = this.baseFolder.server;
    this.mNeedFolderLoadedEvent = true;
    server instanceof Ci.msqIOverride;
    let twh = server.jsParent.wrappedJSObject.serverHelper;

    // todo: use the context only to pass context, not a new FolderListener instance?
    let listener = new FolderListener(this.baseFolder);

    // determine the action to take
    let sinceId = this.baseFolder.getStringProperty("SinceId");
    let action = null;
    if (this.baseFolder.getFlag(Ci.nsMsgFolderFlags.Archive))
    {
      action = "Nothing";
    }
    else
    {
      try {
        action = this.baseFolder.getStringProperty("TwitterAction");
      } catch(e) {}
    }

    let tweetCount = Cc["@mozilla.org/preferences-service;1"]
                       .getService(Ci.nsIPrefBranch2)
                       .getIntPref("extensions.tweequilla.tweetCount");

    if (action == "UserTimeline")
      twh.statuses.user_timeline(listener.callback, listener.errorCallback, this, "json", null, sinceId, tweetCount);
    else if (action == "FriendsTimeline")
      twh.statuses.friends_timeline(listener.callback, listener.errorCallback, this, "json", sinceId, tweetCount);
    else if (action == "HomeTimeline")
      twh.statuses.home_timeline(listener.callback, listener.errorCallback, this, "json", sinceId, tweetCount);
    else if (action == "Mentions")
      twh.statuses.mentions(listener.callback, listener.errorCallback, this, "json", null, sinceId, tweetCount);
    else if (action == "RetweetsOfMe")
      twh.statuses.retweets_of_me(listener.callback, listener.errorCallback, this, "json", sinceId, tweetCount);
    else if (action == "RetweetedByMe")
      twh.statuses.retweeted_by_me(listener.callback, listener.errorCallback, this, "json", sinceId, tweetCount);
    else if (action == "Lists")
      twh.lists.get(listener.listsCallback, listener.errorCallback, this, "json", server.username);
    else if (action == "ListTimeline")
      twh.lists.timeline(listener.callback, listener.errorCallback, this, "json",
                         server.username, this.baseFolder.getStringProperty("ListId"), sinceId, tweetCount);
    else if (action == "Searches")
      twh.searches.get(listener.searchesCallback, listener.errorCallback, this, "json");
    else if (action == "SearchTimeline")
      twh.searches.timeline(listener.callback, listener.errorCallback, this, "json",
                            decodeURIComponent(this.baseFolder.getStringProperty("SearchQuery")), sinceId, tweetCount);
    else if (action == "Nothing") // mostly for debugging
      this.notifyFolderLoaded();
    else
      throw("Unrecognized twitter action");

  } catch(e) {re(e);}},

  get rootFolder()
  {
    re("getting root");
    return this.baseFolder.base.QueryInterface(Ci.nsIMsgFolder);
  },
  get subFolders()
  {
Cu.reportError("I am in subfolders");
return [];
  try {
    let base = this.baseFolder.base.QueryInterface(Ci.nsIMsgFolder);
    if (base.isServer && this.needsBaseFolders)
    {
      this.needsBaseFolders = false;
      this.makeStandardFolders(base);
      // Earlier versions allowed skink  to create a useless archive folder. Delete
      //  that if found
      try {
        let archive = base.getFolderWithFlags(Ci.nsMsgFolderFlags.Archive);
        if (archive)
        {
          log.info("Deleting stray Archive folder");
          base.propagateDelete(archive, true, null);
        }
      } catch (e) {}
    }
    return base.subFolders;
  } catch(e) {re(e);}},

  get canFileMessages()
  {
    return false;
  },

  get canDeleteMessages()
  {
    return false;
  },

  get canCreateSubfolders()
  {
    return false;
  },

  get canCompact()
  {
    return false;
  },

  get canRename()
  {
    return false;
  },

  // **** local methods
  // create if needed standard Twitter folders
  makeStandardFolders: function _makeStandardFolders(aRootMsgFolder)
  { try {

    function makeFolder(aName, aTwitterAction)
    {
      let msgFolder;
      try 
      {
        msgFolder = aRootMsgFolder.getChildNamed(aName);
      } 
      catch (e)
      {
        msgFolder = aRootMsgFolder.addSubfolder(aName);
        msgFolder.setFlag(Ci.nsMsgFolderFlags.CheckNew);
      }
      msgFolder.setStringProperty("TwitterAction", aTwitterAction);
      msgFolder.prettyName = aName;

      return msgFolder;
    }
      
    let sentMsgFolder = makeFolder("My Tweets", "UserTimeline");
    sentMsgFolder.setFlag(Ci.nsMsgFolderFlags.SentMail);

    makeFolder("Timeline", "HomeTimeline");
    makeFolder("Mentions", "Mentions");
    makeFolder("Retweets of me", "RetweetsOfMe");
    makeFolder("Retweeted by me", "RetweetedByMe");
    makeFolder("My Lists", "Lists");
    makeFolder("My Searches", "Searches");
  } catch (e) {re(e);}},

  reconcileFolder: function _reconcileFolder(aJso)
  {
    let existingSinceId;
    try {
      existingSinceId = this.baseFolder.getStringProperty("SinceId");
    } catch (e) {}
    existingSinceId = (existingSinceId && existingSinceId.length) ? existingSinceId : "0";
    let currentSinceId = existingSinceId;
    let items;
    if ('results' in aJso) // this is a search
    {
      items = aJso.results;
    }
    else
      items = aJso;
    for each (let item in items)
    {
      let idStr = this.reconcileItem(item);
      if (idStr && (parseInt(idStr) > parseInt(currentSinceId)))
        currentSinceId = idStr;
    }
    if (parseInt(currentSinceId) > parseInt(existingSinceId))
    {
        this.baseFolder.setStringProperty("SinceId", currentSinceId);
    }
    this.baseFolder.msgDatabase.summaryValid = true;
  },

  // returns the item id
  reconcileItem: function _reconcileItem(aJsItem)
  { try {
    /*
    for (name1 in aJsItem)
    {
     dump(name1 + ": " + aJsItem[name1] + "\n");
     if (name1 == "user")
       for (name2 in aJsItem[name1])
         dump(name1 + "." + name2 + ": " + aJsItem[name1][name2] + "\n");
    }
    /**/
    // add to database if needed
    let db = this.baseFolder.msgDatabase;
    let existingMsg = db.getMsgHdrForMessageID(aJsItem.id_str);
    if (existingMsg)
    {
      //dump("found existing message, subject is " + existingMsg.subject + "\n");
      // update items that might change
      existingMsg.markFlagged(aJsItem.favorited);
      return aJsItem.id_str;
    }
    // add new hdr to the database
    let fi = db.dBFolderInfo;
    let nextKey = fi.highWater + 1;
    let newMessage = db.CreateNewHdr(nextKey);
    fi.highWater = nextKey;

    // For retweets, we will use the original message, but keep a retweet
    //  field with the screen name of the retweeter, and keep the date
    //  of the retweet

    newMessage.date = 1000 * Date.parse(aJsItem.created_at);
    newMessage.messageId = aJsItem.id_str;
    newMessage.markFlagged(aJsItem.favorited);

    if (aJsItem.retweeted_status)
    {
      newMessage.setProperty("retweet", "@" + aJsItem.user.screen_name);
      aJsItem = aJsItem.retweeted_status;
    }

    if (aJsItem.user)
      newMessage.author = "@" + aJsItem.user.screen_name;
    else if (aJsItem.from_user)
      newMessage.author = "@" + aJsItem.from_user;
    newMessage.setUint32Property("notAPhishMessage", 1);
    newMessage.subject = mimeEncodeSubject(aJsItem.text, 'UTF-8');

    let inReplyTo = aJsItem.in_reply_to_status_id_str;
    if (inReplyTo && inReplyTo.length)
      newMessage.setReferences(inReplyTo);
    db.AddNewHdrToDB(newMessage, true);
    return aJsItem.id_str;
  } catch(e) {re(e)}},

  // aJsLists: the lists json from twitter
  // aJsFolder: the local js version of the Lists folder (parent to the lists)
  reconcileLists: function _reconcileLists(aJsLists, aJsFolder)
  {
    let skinkFolder = aJsFolder.baseFolder;

    // Get a list of existing subfolders
    let subfolders = skinkFolder.subFolders;
    let subfoldersFound = {};
    while (subfolders && subfolders.hasMoreElements())
    {
      let folder = subfolders.getNext()
                             .QueryInterface(Ci.nsIMsgFolder);
      subfoldersFound[folder.name] = false;
    }

    // Find and add if needed the lists
    for (let index in aJsLists)
    {
      let name = aJsLists[index].name;
      let newFolder;
      try {
        newFolder = skinkFolder.getChildNamed(name);
      } catch(e) {
        newFolder = skinkFolder.addSubfolder(name);
        newFolder.setFlag(Ci.nsMsgFolderFlags.CheckNew);
      }
      newFolder.prettyName = name;
      newFolder.setStringProperty("TwitterAction", "ListTimeline");
      newFolder.setStringProperty("ListId", aJsLists[index].id_str);
      subfoldersFound[name] = true;
    }

    // delete any subfolders that no longer exist
    for (let name in subfoldersFound)
    {
      if (!subfoldersFound[name])
      {
        try {
          let folderToDelete = skinkFolder.getChildNamed(name);
          if (!folderToDelete.getFlag(Ci.nsMsgFolderFlags.Virtual))
            skinkFolder.propagateDelete(folderToDelete, true, null);
        } catch(e) {}
      }
    }
  },

  // aJson: the json response from twitter
  // aJsFolder: the local js version of the Searches folder (parent to the searches)
  reconcileSearches: function _reconcileSearches(aJson, aJsFolder)
  {
    let skinkFolder = aJsFolder.baseFolder;

    // Get a list of existing subfolders
    let subfolders = skinkFolder.subFolders;
    let subfoldersFound = {};
    while (subfolders && subfolders.hasMoreElements())
    {
      let folder = subfolders.getNext()
                             .QueryInterface(Ci.nsIMsgFolder);
      subfoldersFound[folder.name] = false;
    }

    // Find and add if needed the searches
    for (var index in aJson)
    {
      let name = aJson[index].name;
      let newFolder;
      try {
        newFolder = skinkFolder.getChildNamed(name);
      } catch(e) {
        newFolder = skinkFolder.addSubfolder(name);
        newFolder.setFlag(Ci.nsMsgFolderFlags.CheckNew);
      }
      newFolder.setStringProperty("TwitterAction", "SearchTimeline");
      newFolder.setStringProperty("SearchQuery", encodeURIComponent(aJson[index].query));
      newFolder.prettyName = name;
      subfoldersFound[name] = true;
    }

    // delete any subfolders that no longer exist
    for (var name in subfoldersFound)
    {
      if (!subfoldersFound[name])
      {
        try {
          let folderToDelete = skinkFolder.getChildNamed(name);
          if (!folderToDelete.getFlag(Ci.nsMsgFolderFlags.Virtual))
            skinkFolder.propagateDelete(folderToDelete, true, null);
        } catch(e) {dl(e);}
      }
    }
  },

  notifyFolderLoaded: function _notifyFolderLoaded()
  { try {
    if (this.mNeedFolderLoadedEvent)
    {
      this.baseFolder.NotifyFolderEvent(gFolderLoadedAtom);
      this.mNeedFolderLoadedEvent = false;
    }
    this.baseFolder.summaryChanged();
    
  } catch(e) {re(e);}},

}

function FolderListener(aFolder)
{
  this.baseFolder = aFolder;
}

FolderListener.prototype =
{
  callback: function __callback(aTwh, aJson, jsFolder)
  {
    log.debug('Normal twitter helper callback');
    jsFolder.reconcileFolder(aJson);
    jsFolder.notifyFolderLoaded();
  },
  errorCallback: function _errorCallback(aTwitterHelper, aXmlRequest, aContext)
  {
    re('Error twitter callback status is ' + aXmlRequest.status);
    jsFolder.notifyFolderLoaded(); // to get rid of the wait indicator
  },
  listsCallback: function _listsCallback(aTwh, aJson, jsFolder)
  {
    //dl('listsCallback');
    jsFolder.reconcileLists(aJson.lists, jsFolder);
    jsFolder.notifyFolderLoaded();
  },
  searchesCallback: function _searchesCallback(aTwh, aJson, jsFolder)
  {
    //dl('searchesCallback');
    jsFolder.reconcileSearches(aJson, jsFolder);
    jsFolder.notifyFolderLoaded();
  },

}

var gUnicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                                  .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
gUnicodeConverter.charset = "UTF-8";

// adapted from FeedItem.js
function mimeEncodeSubject(aSubject, aCharset)
{
  // Get the mime header encoder service
  var mimeEncoder = Components.classes["@mozilla.org/messenger/mimeconverter;1"]
                              .getService(Components.interfaces.nsIMimeConverter);

  // This routine sometimes throws exceptions for mis-encoded data so
  // wrap it with a try catch for now..
  var newSubject;
  try
  {
    newSubject = mimeEncoder.encodeMimePartIIStr_UTF8(aSubject, false, aCharset, 9, 141);
  }
  catch (ex)
  {
    dl('mime encoder failed ' + ex);
    newSubject = aSubject;
  }

  return newSubject;
}
