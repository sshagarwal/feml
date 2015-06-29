var EXPORTED_SYMBOLS = ["FemlUrl"];

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

function FemlUrl()
{ try {
  let url = Cc["@mesquilla.com/sgurl;1"]
              .createInstance(Ci.nsIMsgMailNewsUrl);
  url instanceof Ci.nsIURI;
  url instanceof Ci.nsIURL;
  url instanceof Ci.msqIOverride;
  this.sgurl = url;
  this.__proto__.__proto__ = url;

  // define the overrides
  this.jsUrl = new FemlUrlOverride(url);
  url.jsParent = this.jsUrl;

} catch(e) {re(e); throw e;}}

function FemlUrlOverride(aUrl) {
  this.wrappedJSObject = this;
  // initialization of member variables
  this.baseUrl = aUrl;
}

FemlUrlOverride.prototype = 
{
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsIMsgMailNewsUrl, Ci.nsIURI, Ci.nsIURL])
}
