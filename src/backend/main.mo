import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat32 "mo:core/Nat32";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    bio : ?Text;
  };

  type ContentItem = {
    id : Text;
    title : Text;
    description : Text;
    authorName : Text;
    contentType : {
      #audio;
      #story;
    };
    genre : Text;
    textContent : Text;
    blobId : ?Storage.ExternalBlob;
    thumbnailBlobId : ?Storage.ExternalBlob;
    createdAt : Time.Time;
    uploaderPid : Principal;
  };

  type ContentItemWithLikes = ContentItem and {
    likeCount : Nat32;
  };

  module ContentItem {
    public func compare(content1 : ContentItem, content2 : ContentItem) : Order.Order {
      Text.compare(content1.id, content2.id);
    };

    public func compareByTitle(content1 : ContentItem, content2 : ContentItem) : Order.Order {
      Text.compare(content1.title, content2.title);
    };

    public func compareByLikeCount(content1 : ContentItemWithLikes, content2 : ContentItemWithLikes) : Order.Order {
      Nat32.compare(content2.likeCount, content1.likeCount);
    };

    public func compareByCreatedAt(content1 : ContentItem, content2 : ContentItem) : Order.Order {
      Int.compare(content2.createdAt, content1.createdAt);
    };
  };

  type Comment = {
    id : Nat32;
    contentId : Text;
    userPid : Principal;
    userName : Text;
    text : Text;
    timestamp : Time.Time;
  };

  type Progress = {
    contentId : Text;
    position : Nat32;
    lastAccessed : Time.Time;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let contentStorage = Map.empty<Text, ContentItem>();
  let comments = Map.empty<Nat32, Comment>();
  let likes = Map.empty<Text, Set.Set<Principal>>();
  let bookmarks = Map.empty<Principal, Set.Set<Text>>();
  let progress = Map.empty<Principal, Map.Map<Text, Progress>>();

  var nextCommentId : Nat32 = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Management
  public shared ({ caller }) func uploadContent(content : ContentItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload content");
    };

    if (content.contentType == #story and content.textContent == "") {
      Runtime.trap("Text content is required for stories");
    };

    let newContent : ContentItem = {
      content with
      createdAt = Time.now();
      uploaderPid = caller;
    };
    contentStorage.add(content.id, newContent);
    likes.add(content.id, Set.empty<Principal>());
  };

  public query func getAllContent() : async [ContentItem] {
    contentStorage.values().toArray();
  };

  public query func getContentByType(contentType : { #audio; #story }) : async [ContentItem] {
    contentStorage.values().filter(
      func(c : ContentItem) : Bool {
        c.contentType == contentType;
      }
    ).toArray();
  };

  public query func searchContentByTitle(searchTerm : Text) : async [ContentItem] {
    contentStorage.values().filter(
      func(c : ContentItem) : Bool {
        c.title.contains(#text searchTerm);
      }
    ).toArray();
  };

  // Likes
  public shared ({ caller }) func likeContent(contentId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like content");
    };

    switch (likes.get(contentId)) {
      case (null) { false };
      case (?userSet) {
        if (userSet.contains(caller)) {
          false;
        } else {
          userSet.add(caller);
          true;
        };
      };
    };
  };

  public shared ({ caller }) func unlikeContent(contentId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike content");
    };

    switch (likes.get(contentId)) {
      case (null) { false };
      case (?userSet) {
        if (userSet.contains(caller)) {
          userSet.remove(caller);
          true;
        } else { false };
      };
    };
  };

  public query func getLikeCount(contentId : Text) : async ?Nat32 {
    switch (likes.get(contentId)) {
      case (null) { null };
      case (?userSet) { ?Nat32.fromNat(userSet.size()) };
    };
  };

  // Comments
  public shared ({ caller }) func addComment(contentId : Text, userName : Text, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };

    let comment : Comment = {
      id = nextCommentId;
      contentId;
      userPid = caller;
      userName;
      text;
      timestamp = Time.now();
    };
    comments.add(nextCommentId, comment);
    nextCommentId += 1;
  };

  public query func getCommentsForContent(contentId : Text) : async [Comment] {
    comments.values().filter(
      func(c : Comment) : Bool {
        c.contentId == contentId;
      }
    ).toArray();
  };

  // Bookmarks
  public shared ({ caller }) func bookmarkContent(contentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can bookmark content");
    };

    let userBookmarks = switch (bookmarks.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?set) { set };
    };
    userBookmarks.add(contentId);
    bookmarks.add(caller, userBookmarks);
  };

  public shared ({ caller }) func unbookmarkContent(contentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unbookmark content");
    };

    switch (bookmarks.get(caller)) {
      case (null) {};
      case (?userBookmarks) {
        userBookmarks.remove(contentId);
        bookmarks.add(caller, userBookmarks);
      };
    };
  };

  public query ({ caller }) func getUserBookmarks() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookmarks");
    };

    switch (bookmarks.get(caller)) {
      case (null) { [] };
      case (?userBookmarks) { userBookmarks.toArray() };
    };
  };

  // Progress
  public shared ({ caller }) func saveProgress(contentId : Text, position : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save progress");
    };

    let userProgress = switch (progress.get(caller)) {
      case (null) { Map.empty<Text, Progress>() };
      case (?p) { p };
    };
    let newProgress : Progress = {
      contentId;
      position;
      lastAccessed = Time.now();
    };
    userProgress.add(contentId, newProgress);
    progress.add(caller, userProgress);
  };

  public query ({ caller }) func getProgress(contentId : Text) : async ?Progress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (progress.get(caller)) {
      case (null) { null };
      case (?userProgress) { userProgress.get(contentId) };
    };
  };

  // Trending and Recent Content
  public query func getTrendingContent() : async [ContentItemWithLikes] {
    let contentArray = contentStorage.values().toArray().map(
      func(c : ContentItem) : ContentItemWithLikes {
        {
          id = c.id;
          title = c.title;
          description = c.description;
          authorName = c.authorName;
          contentType = c.contentType;
          genre = c.genre;
          textContent = c.textContent;
          blobId = c.blobId;
          thumbnailBlobId = c.thumbnailBlobId;
          createdAt = c.createdAt;
          uploaderPid = c.uploaderPid;
          likeCount = switch (likes.get(c.id)) {
            case (null) { 0 };
            case (?userSet) { Nat32.fromNat(userSet.size()) };
          };
        };
      }
    );

    contentArray.sort(ContentItem.compareByLikeCount);
  };

  public query func getRecentUploads() : async [ContentItem] {
    contentStorage.values().toArray().sort(ContentItem.compareByCreatedAt);
  };
};
