var EXPORTED_SYMBOLS = ["Utils"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;
const CE = Components.Exception;
const CC = Components.Constructor;

function AsyncDriver()
{
  this.curGenerator = null;
  // If a callback is called before the yield, then we generate an error. So
  //  we have to track if a yield is needed.
  this.timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
}

AsyncDriver.prototype = 
{
  nextStep: function asc_nextStep(aStatus)
  {
    // delay with a timer to prevent premature callbacks
    function _nextStep(aaStatus, curGenerator)
    {
      try {
        if (aaStatus)
        {
          curGenerator.send(aaStatus);
        }
        else
        {
          curGenerator.next();
        }
      }
      catch (ex) {
        if (ex != StopIteration) {
          Cu.reportError('TweeQuilla generator exception: ' + ex + '\n');
          curGenerator.next();
        }
      }
    }

    let curGenerator = this.curGenerator;
    this.timer.initWithCallback( function() { 
        _nextStep(aStatus, curGenerator);
      },
	    0, Ci.nsITimer.TYPE_ONE_SHOT);        
    return true;
  },
    
  runAsync: function asc_runAsync(aGenerator)
  {
    this.curGenerator = aGenerator;
    this.nextStep();
  }
}

function se(error) // string error
{
  let jsFrame;
  let str = 'javascript error: ' + error + '\n';
  if (error)
  {
    if (error.fileName)
      str += ' file: ' + error.fileName + ' line: ' + error.lineNumber + '\n';
    let jsFrame = error.stack;
  }
  if (!jsFrame)
    jsFrame = Components.stack;
  // remove the se() and re() from the stack
  try {
    if (jsFrame.caller.caller)
      jsFrame = jsFrame.caller.caller;
  } catch (e) {}
  while (jsFrame)
  {
    str += jsFrame.toString() + '\n';
    jsFrame = jsFrame.caller;
  }
  return str;
}

// standard error report from a js function (ignore is optional, default false)
function re(error, ignore)
{
  let strError= this.se(error);
  dump(strError + '\n');
  Cu.reportError(strError);
  if (!ignore)
    throw error;
}

// import into a given scope the symbols in this module
// Importing into this always seems to import into the highest
// level object, and also the local namespace. So this function
// makes sense in a module, but in a function attached to a
// public window it should not be used, as there is no benefit
// of this over just using the module export.
function importLocally(scope)
{
  for (let method in Utils)
  {
    if (typeof scope[method] == 'undefined')
      scope[method] = Utils[method];
  }

  // also import standard abbreviations

  if (typeof scope.Cc == 'undefined') scope.Cc = Cc;
  if (typeof scope.Ci == 'undefined') scope.Ci = Ci;
  if (typeof scope.Cu == 'undefined') scope.Cu = Cu;
  if (typeof scope.Cr == 'undefined') scope.Cr = Cr;
  if (typeof scope.CE == 'undefined') scope.CE = CE;
  if (typeof scope.CC == 'undefined') scope.CC = CC;
}

// Used to set a C++ break in a js routine
function catchMe()
{
  dl('catchMe()');
  let messenger = Cc["@mozilla.org/messenger;1"].createInstance(Ci.nsIMessenger);
  try {
    messenger.navigatePos = 10000;
  } catch (e) {}
}

// shorthand line output
function dl(t) {
  dump(t + "\n");
}

function domWindow()
{
  return Cc["@mozilla.org/messenger/services/session;1"]
           .getService(Ci.nsIMsgMailSession)
           .topmostMsgWindow
           .domWindow;
}

var Utils = {
  se: se,
  re: re,
  AsyncDriver: AsyncDriver,
  importLocally: importLocally,
  dl: dl,
  catchMe: catchMe,
  domWindow: domWindow,

}
