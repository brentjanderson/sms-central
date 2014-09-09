// {name, number, groups: ["Ward"]}
Members = new Meteor.Collection("members");

// {subject, groups: []}
Conversations = new Meteor.Collection("conversations");

// {memberId: , conversationId, message, fromNumber, toNumber, direction (inbound/outbound), messageCode (Optional)}
// Message Code used to identify special messages like STOP or the initial message
// Codes include: STOP, START, AUTH (For logging in from the website), unset if part of a conversation
Messages = new Meteor.Collection("messages");
