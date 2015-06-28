const EXPORTED_SYMBOLS = ["TwitterStore"];

var Cu = Components.utils;
Cu.import("resource:///modules/gloda/log4moz.js");
Cu.import("resource://feml/Utils.jsm");
Cu.import("resource:///modules/XPCOMUtils.jsm");
Utils.importLocally(this);
//let //log = Log4Moz.getConfiguredLogger("extensions.tweequilla");

/**
 * Pluggable message store interface. Each incoming server can have a different
 * message store.
 * All methods are synchronous unless otherwise specified.
 */
function TwitterStore()
{

}

TwitterStore.prototype = {

  //interface nsIMsgPluggableStore : nsISupports {
  QueryInterface:   XPCOMUtils.generateQI([Components.interfaces.nsIMsgPluggableStore]),
  /**
   * Examines the store and adds subfolders for the existing folders in the
   * profile directory. aParentFolder->AddSubfolder is the normal way
   * to register the subfolders. This method is expected to be synchronous.
   * This shouldn't be confused with server folder discovery, which is allowed
   * to be asynchronous.
   *
   * @param aParentFolder folder whose existing children we want to discover.
   *                      This will be the root folder for the server object.
   * @param aDeep true if we should discover all descendents. Would we ever
   *              not want to do this?
   */

  //void discoverSubFolders(in nsIMsgFolder aParentFolder, in boolean aDeep);
  discoverSubFolders: function _discoverSubFolders(aParentFolder, aDeep)
  { try {
    ////log.debug("TwitterStore.discoverSubFolders");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},
  
  /**
   * Creates storage for a new, empty folder.
   *
   * @param aParent parent folder
   * @param aFolderName leaf name of folder.
   * @return newly created folder.
   * @exception NS_MSG_FOLDER_EXISTS If the child exists.
   * @exception NS_MSG_CANT_CREATE_FOLDER for other errors.
   */
  //nsIMsgFolder createFolder(in nsIMsgFolder aParent, in AString aFolderName);
  createFolder: function _createFolder(aParent, aFolderName)
  { try {
    ////log.debug("TwitterStore.createFolder");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Get an nsILocalFile corresponding to the .msf file. This allows stores
   * to put the .msf files where they want.
   *
   * @param aFolder folder we want summary file for
   * @return summary file
   */
  //nsILocalFile getSummaryFile(in nsIMsgFolder aFolder);
  getSummaryFile: function _getSummaryFile(aFolder)
  { try {
    let newSummaryLocation = aFolder.filePath;
    newSummaryLocation.leafName = newSummaryLocation.leafName + ".msf";
    return newSummaryLocation;
  } catch (e) {re(e);}},

  /**
   * Delete the passed in folder. This is a real delete, not a move
   * to the trash folder.
   *
   * @param aFolder folder to delete
   */
  //void deleteFolder(in nsIMsgFolder aFolder);
  deleteFolder: function _deleteFolder(aFolder)
  { try {
    //log.debug("TwitterStore.deleteFolder");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Rename storage for an existing folder.
   *
   * @param aFolder folder to rename
   * @param aNewName name to give new folder
   * @return the renamed folder object
   */
  //nsIMsgFolder renameFolder(in nsIMsgFolder aFolder, in AString aNewName);
  renameFolder: function _renameFolder(aFolder, aNewName)
  { try {
    //log.debug("TwitterStore.renameFolder");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Tells if the store has the requested amount of space available in the
   * specified folder.
   *
   * @param aFolder folder we want to add messages to.
   * @param aSpaceRequested How many bytes we're trying to add to the store.
   */
  //boolean hasSpaceAvailable(in nsIMsgFolder aFolder, in long long aSpaceRequested);
  hasSpaceAvailable: function _hasSpaceAvailable(aFolder, aSpaceRequested)
  { try {
    return true;
  } catch (e) {re(e);}},

  /**
   * Move/Copy a folder to a new parent folder. This method is asynchronous.
   * The store needs to use the aListener to notify the core code of the
   * completion of the operation. And it must send the appropriate
   * nsIMsgFolderNotificationService notifications.
   *
   * @param aSrcFolder folder to move/copy
   * @param aDstFolder parent dest folder
   * @param aIsMoveFolder true if move, false if copy. If move, source folder
   *                      is deleted when copy completes.
   * @param aMsgWindow used to display progress, may be null
   * @param aListener - used to get notification when copy is done.
   */
  //void copyFolder(in nsIMsgFolder aSrcFolder, in nsIMsgFolder aDstFolder,
  //                in boolean aIsMoveFolder, in nsIMsgWindow aMsgWindow,
  //                in nsIMsgCopyServiceListener aListener);
  copyFolder: function _copyFolder(aSrcFolder, aDstFolder,
                                   aIsMoveFolder, aMsgWindow,
                                   aListener)
  { try {
    //log.debug("TwitterStore.copyFolder");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Get an output stream for a message in a folder.
   *
   * @param aFolder folder to create a message output stream for.
   * @param aNewHdr If aNewHdr is set on input, then this is probably for
   *                offline storage of an existing message. If null, the
   *                this is a newly downloaded message and the store needs
   *                to create a new header for the new message. If the db
   *                is invalid, this can be null. But if the db is valid,
   *                the store should create a message header with the right
   *                message key, or whatever other property it needs to set to
   *                be able to retrieve the message contents later. If the store
   *                needs to base any of this on the contents of the message,
   *                it will need remember the message header and hook into
   *                the output stream somehow to alter the message header.
   * @param aReusable set to true on output if the caller can reuse the
   *                  stream for multiple messages, e.g., mbox format.
   *                  This means the caller will likely get the same stream
   *                  back on multiple calls to this method, and shouldn't
   *                  close the stream in between calls if they want reuse.
   *
   * @return The output stream to write to. The output stream will be positioned
   *         for writing (e.g., for berkeley mailbox, it will be at the end).
   */
  //nsIOutputStream getNewMsgOutputStream(in nsIMsgFolder aFolder,
  //                                      inout nsIMsgDBHdr aNewHdr,
  //                                      out boolean aReusable);
  getNewMsgOutputStream: function _getNewMsgOutputStream(aFolder, aNewHdr, aReusable)
  { try {
    //log.debug("TwitterStore.getNewMsgOutputStream");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Called when the current message is discarded, e.g., it is moved
   * to an other folder as a filter action, or is deleted because it's
   * a duplicate. This gives the berkeley mailbox store a chance to simply
   * truncate the Inbox w/o leaving a deleted message in the store.
   *
   * @param aOutputStream stream we were writing the message to be discarded to
   * @param aNewHdr header of message to discard
   */
  //void discardNewMessage(in nsIOutputStream aOutputStream,
  //                       in nsIMsgDBHdr aNewHdr);
  discardNewMessage: function _discardNewMessage(aOutputStream, aNewHdr)
  { try {
    //log.debug("TwitterStore.discardNewMessage");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Must be called by code that calls getNewMsgOutputStream to finish
   * the process of storing a new message, if the new msg has not been
   * discarded. Could/should this be combined with discardNewMessage?
   *
   * @param aOutputStream stream we were writing the message to.
   * @param aNewHdr header of message finished.
   */
  //void finishNewMessage(in nsIOutputStream aOutputStream,
  //                       in nsIMsgDBHdr aNewHdr);
  finishNewMessage: function _finishNewMessage(aOutputStream, aNewHdr)
  { try {
    //log.debug("TwitterStore.finishNewMessage");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Called by pop3 message filters when a newly downloaded message is being
   * moved by an incoming filter. This is called before finishNewMessage, and
   * it allows the store to optimize that case.
   *
   * @param aNewHdr msg hdr of message being moved.
   * @param aDestFolder folder to move message to, in the same store.
   *
   * @return true if successful, false if the store doesn't want to optimize
   *         this.
   * @exception If the moved failed. values TBD
   */
  //boolean moveNewlyDownloadedMessage(in nsIMsgDBHdr aNewHdr,
  //                                   in nsIMsgFolder aDestFolder);
  moveNewlyDownloadedMessage: function _moveNewlyDownloadedMessage(aNewHdr, aDestFolder)
  { try {
    //log.debug("TwitterStore.moveNewlyDownloadedMessage");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Get an input stream that we can read the contents of a message from.
   * If the input stream is reusable, and the caller is going to ask
   * for input streams for other messages in the folder, then the caller
   * should not close the stream until it is done with its messages.
   *
   * @param aMsgFolder Folder containing the message
   * @param aMsgToken token that identifies message. This is store-dependent,
   *                  and must be set as a string property "storeToken" on the
   *                  message hdr by the store when the message is added
   *                  to the store.
   * @param aOffset offset in the returned stream of the message.
   * @param[optional] aHdr msgHdr to use in case storeToken is not set. This is
   *                  for upgrade from existing profiles.
   * @param[optional] aReusable Is the returned stream re-usable for other
   *                            messages' input streams?
   */
  //nsIInputStream getMsgInputStream(in nsIMsgFolder aFolder,
  //                                 in ACString aMsgToken,
  //                                 out long long aOffset,
  //                                 [optional] in nsIMsgDBHdr aHdr,
  //                                 [optional] out boolean aReusable);
  getMsgInputStream: function _getMsgInputStream(aFolder, aMsgToken, aOffset, aHdr, aReusable)
  { try {
    //log.debug("TwitterStore.getMsgInputStream");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Delete the passed in messages. These message should all be in the
   * same folder.
   * @param aHdrArray array of nsIMsgDBHdr's.
   */
  //void deleteMessages(in nsIArray aHdrArray);
  deleteMessages: function _deleteMessages(aHdrArray)
  { try {
    //log.debug("TwitterStore.deleteMessages");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * This allows the store to handle a msg move/copy if it wants. This lets
   * it optimize move/copies within the same store. E.g., for maildir, a
   * msg move mostly entails moving the file containing the message, and
   * updating the db. If the store does not want to implement this, the core
   * code will use getMsgInputStream on the source message,
   * getNewMsgOutputStream for the dest message, and stream the input to
   * the output. This operation can be asynchronous.
   * If the store does the copy, it must add the appropriate undo action,
   * which can be store dependent. And it must send the appropriate
   * nsIMsgFolderNotificationService notifications.
   *
   * @param isMove true if this is a move, false if it is a copy.
   * @param aHdrArray array of nsIMsgDBHdr's, all in the same folder
   * @param aDstFolder folder to move/copy the messages to.
   * @param aListener listener to notify of copy status.
   * @return true if messages were copied, false if the core code should
   *         do the copy.
   */
  //boolean copyMessages(in boolean isMove,
  //                     in nsIArray aHdrArray,
  //                     in nsIMsgFolder aDstFolder,
  //                     in nsIMsgCopyServiceListener aListener);
  copyMessages: function _copyMessages(isMove, aHdrArray, aDstFolder, aListener)
  { try {
    //log.debug("TwitterStore.copyMessages");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Does this store require compaction? For example, maildir doesn't require
   * compaction at all. Berkeley mailbox does. A sqlite store probably doesn't.
   * This is a static property of the store. It doesn't mean that any particular
   * folder has space that can be reclaimed via compaction. Right now, the core
   * code keeps track of the size of messages deleted, which it can use in
   * conjunction with this store attribute.
   */
  //readonly attribute boolean supportsCompaction;
  get supportsCompaction()
  { try {
    return false;
  } catch (e) {re(e);}},

  /**
   * Remove deleted messages from the store, reclaiming space. Some stores
   * won't need to do anything here (e.g., maildir), and those stores
   * should return false for needsCompaction. This operation is asynchronous,
   * and the passed url listener should be called when the operation is done.
   *
   * @param aFolder folder whose storage is to be compacted
   * @param aListener listener notified when compaction is done.
   * @param aMsgWindow window to display progress/status in.
   */
  //void compactFolder(in nsIMsgFolder aFolder, in nsIUrlListener aListener,
  //                   in nsIMsgWindow aMsgWindow);
  compactFolder: function _compactFolder(aFolder, aListener, aMsgWindow)
  { try {
    //log.debug("TwitterStore.compactFolder");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Is the summary file for the passed folder valid? For Berkeley Mailboxes,
   * for local mail folders, this checks the timestamp and size of the local
   * mail folder against values stored in the db. For other stores, this may
   * be a noop, though other stores could certainly become invalid. For
   * Berkeley Mailboxes, this is to deal with the case of other apps altering
   * mailboxes from outside mailnews code, and this is certainly possible
   * with other stores.
   *
   * @param aFolder Folder to check if summary is valid for.
   * @param aDB DB to check validity of.
   *
   * @return return true if the summary file is valid, false otherwise.
   */
  //boolean isSummaryFileValid(in nsIMsgFolder aFolder, in nsIMsgDatabase aDB);
  isSummaryFileValid: function _isSummaryFileValid(aFolder, aDB)
  { try {
    return true;
  } catch (e) {re(e);}},

  /**
   * Marks the summary file for aFolder as valid or invalid. This method
   * may not be required, since it's really used by Berkeley Mailbox code
   * to fix the timestamp and size for a folder.
   *
   * @param aFolder folder whose summary file should be marked (in)valid.
   * @param aDB db to mark valid (may not be the folder's db in odd cases
   *            like folder compaction.
   * @param aValid whether to mark it valid or invalid.
   */
  //void setSummaryFileValid(in nsIMsgFolder aFolder, in nsIMsgDatabase aDB,
  //                         in boolean aValid);
  setSummaryFileValid: function _setSummaryFileValid(aFolder, aDB, aValid)
  { try {
    ////log.debug("TwitterStore.setSummaryFileValid");
  } catch (e) {re(e);}},

  /**
   * Rebuild the index from information in the store. This involves creating
   * a new nsIMsgDatabase for the folder, adding the information for all the
   * messages in the store, and then copying the new msg database over the
   * existing database. For Berkeley mailbox, we try to maintain meta data
   * stored in the existing database when possible, and other stores should do
   * the same. Ideally, I would figure out a way of making that easy. That
   * might entail reworking the rebuild index process into one where the store
   * would iterate over the messages, and stream each message through the
   * message parser, and the common code would handle maintaining the
   * meta data. But the berkeley mailbox code needs to do some parsing because
   * it doesn't know how big the message is (i.e., the stream can't simply be
   * a file stream).
   * This operation is asynchronous,
   * and the passed url listener should be called when the operation is done.
   *
   * @param aFolder folder whose storage is to be compacted
   * @param aMsgDB db to put parsed headers in.
   * @param aMsgWindow msgWindow to use for progress updates.
   * @param aListener listener notified when the index is rebuilt.
   */
  //void rebuildIndex(in nsIMsgFolder aFolder, in nsIMsgDatabase aMsgDB,
  //                  in nsIMsgWindow aMsgWindow, in nsIUrlListener aListener);
  rebuildIndex: function _rebuildIndex(aFolder, aMsgDB, aMsgWindow, aListener)
  { try {
    //log.debug("TwitterStore.rebuildIndex");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   * Sets/Clears the passed flags on the passed messages.
   * @param aHdrArray array of nsIMsgDBHdr's
   * @param aFlags flags to set/clear
   * @param aSet true to set the flag(s), false to clear.
   */
  //void changeFlags(in nsIArray aHdrArray, in unsigned long aFlags,
  //                 in boolean aSet);
  changeFlags: function _changeFlags(aHdrArray, aFlags, aSet)
  { try {
    //log.debug("TwitterStore.changeFlags");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

  /**
   *Sets/Clears the passed keywords on the passed messages.
   * @param aHdrArray array of nsIMsgDBHdr's
   * @param aKeywords keywords to set/clear
   * @param aAdd true to add the keyword(s), false to remove.
   */
  //void changeKeywords(in nsIArray aHdrArray, in ACString aKeywords,
  //                    in boolean aAdd);
  changeKeywords: function _changeKeywords(aHdrArray, aKeywords, aAdd)
  { try {
    //log.debug("TwitterStore.changeKeywords");
    throw CE("Not Implemented", Cr.NS_ERROR_NOT_IMPLEMENTED);
  } catch (e) {re(e);}},

};
