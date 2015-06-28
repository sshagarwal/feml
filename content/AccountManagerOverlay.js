if (!feml)
  var feml = {};

feml.newAccountWindowOpen = function _newAccountWindowOpen()
{
  try {
    let newAccountWindow = window.openDialog("chrome://feml/content/newAccount.xul", "_blank",
        "chrome,extrachrome,menubar,resizable=yes,scrollbars=yes,status=yes",
        "some info");
  }
  catch (e) {dump("failed to open new account window\n");}
}

feml.overrideAccountManager = function _overrideAccountManager()
{
  //Components.utils.import("resource:///modules/gloda/log4moz.js", feml);
  //let log = feml.Log4Moz.getConfiguredLogger("extensions.feml");
  //log.debug("feml.overrideAccountManager()");
  // override the account tree to allow us to revise the panels
/*
  gAccountTree.feml_oldbuild = gAccountTree._build;
  gAccountTree._build = function feml_build()
  {
    gAccountTree.feml_oldbuild();
    let mainTreeChildren = document.getElementById("account-tree-children").childNodes;
    for (let i = 0; i < mainTreeChildren.length; i++)
    {
      let node = mainTreeChildren[i];
      try {
        if (node._account && node._account.incomingServer.type == 'folderemail')
        {
          // remove unwanted panes
          let treeChildrenNode = node.getElementsByTagName("treechildren")[0];
          let nodeChildren = treeChildrenNode.childNodes;
          let twitterServerNode = null
          //  scan backwards to find the feml ServerNode first
          for (let j = nodeChildren.length - 1; j >= 0; j--)
          {
            let row = nodeChildren[j];
            let pageTag = row.getAttribute('PageTag');
            if (pageTag == 'am-folderemailserver.xul')
            {
              twitterServerNode = row;
            }
            else if (pageTag == 'am-server.xul')
            {
              if (twitterServerNode)
              {
                treeChildrenNode.replaceChild(twitterServerNode, row);
              }
            }
            if (pageTag == 'am-offline.xul' ||
                pageTag == 'am-junk.xul' ||
                pageTag == 'am-mdn.xul' ||
                pageTag == 'am-smime.xul' ||
                pageTag == 'am-copies.xul' ||
                pageTag == 'am-addressing.xul')
            {
              treeChildrenNode.removeChild(row);
            }
          }
        }
      } catch (e) {Components.utils.reportError(e);}
    }
  }
  gAccountTree._build();

  // override the saveAccount function so that we can save the token secret
  //  to the password manager.
  let _saveAccountOld = saveAccount;

  // this is the existing saveAccount function with problematic or unneeded features removed
  function shortSaveAccount(accountValues, account)
  {
    var identity = null;
    var server = null;

    if (account) {
      identity = account.defaultIdentity;
      server = account.incomingServer;
    }

    for (var type in accountValues) {
      var typeArray = accountValues[type];

      for (var slot in typeArray) {
        var dest;
        try {
        if (type == "identity")
          dest = identity;
        else if (type == "server")
          dest = server;

        } catch (ex) {
          // don't do anything, just means we don't support that
        }
        if (dest == undefined) continue;

        if ((type in gGenericAttributeTypes) && (slot in gGenericAttributeTypes[type])) {
          var methodName = "get";
          switch (gGenericAttributeTypes[type][slot]) {
            case "int":
              methodName += "Int";
              break;
            case "wstring":
              methodName += "Unichar";
              break;
            case "string":
              methodName += "Char";
              break;
            case "bool":
              // in some cases
              // like for radiogroups of type boolean
              // the value will be "false" instead of false
              // we need to convert it.
              if (typeArray[slot] == "false")
                typeArray[slot] = false;
              else if (typeArray[slot] == "true")
                typeArray[slot] = true;

              methodName += "Bool";
              break;
            default:
              dump("unexpected preftype: " + preftype + "\n");
              break;
          }
          methodName += ((methodName + "Value") in dest ? "Value" : "Attribute");
          if (dest[methodName](slot) != typeArray[slot]) {
            methodName = methodName.replace("get", "set");
            dest[methodName](slot, typeArray[slot]);
          }
        }
        else if (slot in dest && typeArray[slot] != undefined && dest[slot] != typeArray[slot]) {
          try {
            dest[slot] = typeArray[slot];
          } catch (ex) {
            // hrm... need to handle special types here
          }
        }
      }
    }
  }

  saveAccount = function _saveAccount(accountValues, account)
  {
    if (account && account.incomingServer.type == "twitter")
    {
      log.debug("saveAccount()");
      shortSaveAccount(accountValues, account);
      let dummy;
      let secret;
      if ( (dummy = accountValues["dummy"]) &&
           (secret = dummy["accessTokenSecret"]) &&
           secret.length)
      {
        // We need to save the secret, but not in the preferences. So we will add this
        //  to the password manager. If for some reason the account dialog is cancelled, then
        //  this just becomes an unused password which we should clean up later.
        Components.utils.import("resource://feml/oauthTokenMgr.jsm");
        let username = account.incomingServer.username;
        let pwdMgr = new oauthTokenMgr("feml", username);
        pwdMgr.store(secret);
      }
    }
    else
      return _saveAccountOld(accountValues, account);
    return true;
  }
*/
}

window.addEventListener("load", function(e) { feml.overrideAccountManager(e); }, false);
