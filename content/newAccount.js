const Cc = Components.classes;
const Ci = Components.interfaces;

function onLoad()
{
  dump("onLoad");
}

function onCancel()
{
  dump("onCancel");
}

function onAccept()
{
  dump("onaccept");
  Components.utils.reportError("I am here");
  try {
  let accountData = {
    type: "feml",
    server: {},
    identity: null
  };
  accountData.server.username = document.getElementById('fPath').value;

  Components.utils.reportError("Server Username: " + accountData.server.username);

  accountData.server.hostName = "folder.com";
  accountData.server.port = -1;
  accountData.server.type = "feml";
  let am = Cc["@mozilla.org/messenger/account-manager;1"]
             .getService(Ci.nsIMsgAccountManager);
  let account = am.createAccount();

  // identities make little sense for twitter, but skink UI seems to
  //  complain if they do not exist
  let identity = am.createIdentity();
  account.addIdentity(identity);
  identity.archiveEnabled = false;
  account.incomingServer = am.createIncomingServer(accountData.server.username,
                                                   accountData.server.hostName,
                                                   accountData.server.type);
  //Components.utils.reportError("key: " + account.key);
  //Components.utils.reportError("name js: " + account.toString());
  //Components.utils.reportError("server key: " + account.incomingServer.key);
  //Components.utils.reportError("server uri: " + account.incomingServer.serverURI);
  //Components.utils.reportError("server storetype: " + account.incomingServer.localStoreType);
  //Components.utils.reportError("server leafname: " + account.incomingServer.localPath.leafName);
  //Components.utils.reportError("totalaccounts: " + am.accounts.length);
  //for (var i = 0; i < am.accounts.length; i++) {
  //  var acc = am.accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
  //  Components.utils.reportError("acc " + acc.incomingServer.username);
  //}
  //account.incomingServer.localStoreType = "mbox";
  //account.incomingServer.valid = true;
  account.incomingServer.port = -1;
  account.incomingServer.valid = true;
  //account.incomingServer.socketType = Ci.nsMsgSocketType.SSL;
  account.incomingServer = account.incomingServer;
  } catch(e) {
    dump("dump Error: " + e);
  }

  Components.utils.reportError("Returning true");
  return true;
}

