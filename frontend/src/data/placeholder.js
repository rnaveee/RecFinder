export const CURRENT_USER = {
  id: 1,
  name: "Ryan",
  age: 22,
  bio: "Looking for pickup basketball and soccer games around Austin.",
  socials: "@ryan_hoops",
  location: "Austin, TX",
  sports: ["Basketball", "Soccer", "Volleyball"],
};

export const SCRIMMAGES = [
  {
    id: 1,
    sport: "Basketball",
    city: "Austin",
    location: "Zilker Park Courts",
    startTime: "2026-06-25T18:00:00Z",
    attendanceCost: 0,
    maxPlayers: 10,
    createdById: 1,
    createdByName: "Ryan",
    attendeeCount: 6,
  },
  {
    id: 2,
    sport: "Soccer",
    city: "Austin",
    location: "Mueller Park Field 3",
    startTime: "2026-06-26T09:00:00Z",
    attendanceCost: 5,
    maxPlayers: 22,
    createdById: 2,
    createdByName: "Jordan",
    attendeeCount: 14,
  },
  {
    id: 3,
    sport: "Volleyball",
    city: "Dallas",
    location: "White Rock Lake Beach",
    startTime: "2026-06-27T17:00:00Z",
    attendanceCost: 0,
    maxPlayers: 12,
    createdById: 3,
    createdByName: "Alex",
    attendeeCount: 12,
  },
  {
    id: 4,
    sport: "Basketball",
    city: "Houston",
    location: "Hermann Park Courts",
    startTime: "2026-06-28T19:30:00Z",
    attendanceCost: 3,
    maxPlayers: 10,
    createdById: 4,
    createdByName: "Sam",
    attendeeCount: 4,
  },
  {
    id: 5,
    sport: "Tennis",
    city: "Austin",
    location: "Caswell Tennis Center",
    startTime: "2026-06-29T08:00:00Z",
    attendanceCost: 10,
    maxPlayers: 4,
    createdById: 2,
    createdByName: "Jordan",
    attendeeCount: 2,
  },
  {
    id: 6,
    sport: "Soccer",
    city: "San Antonio",
    location: "McAllister Park Field 1",
    startTime: "2026-07-01T16:00:00Z",
    attendanceCost: 0,
    maxPlayers: 18,
    createdById: 5,
    createdByName: "Chris",
    attendeeCount: 7,
  },
];

export const ATTENDEES = [
  { id: 1, scrimmageId: 1, userId: 1, userName: "Ryan", joinedAt: "2026-06-20T10:00:00Z" },
  { id: 2, scrimmageId: 1, userId: 2, userName: "Jordan", joinedAt: "2026-06-20T11:00:00Z" },
  { id: 3, scrimmageId: 1, userId: 3, userName: "Alex", joinedAt: "2026-06-21T09:00:00Z" },
  { id: 4, scrimmageId: 1, userId: 4, userName: "Sam", joinedAt: "2026-06-21T14:00:00Z" },
  { id: 5, scrimmageId: 1, userId: 5, userName: "Chris", joinedAt: "2026-06-22T08:00:00Z" },
  { id: 6, scrimmageId: 1, userId: 6, userName: "Taylor", joinedAt: "2026-06-22T12:00:00Z" },
];

export const FRIENDS = [
  { id: 1, requesterId: 1, addresseeId: 2, status: "ACCEPTED", createdAt: "2026-06-10T10:00:00Z", friendName: "Jordan" },
  { id: 2, requesterId: 3, addresseeId: 1, status: "ACCEPTED", createdAt: "2026-06-12T14:00:00Z", friendName: "Alex" },
  { id: 3, requesterId: 1, addresseeId: 4, status: "ACCEPTED", createdAt: "2026-06-15T09:00:00Z", friendName: "Sam" },
];

export const FRIEND_REQUESTS = [
  { id: 4, requesterId: 5, addresseeId: 1, status: "PENDING", createdAt: "2026-06-18T11:00:00Z", friendName: "Chris" },
  { id: 5, requesterId: 6, addresseeId: 1, status: "PENDING", createdAt: "2026-06-19T08:00:00Z", friendName: "Taylor" },
];

export const SCRIMMAGE_MESSAGES = [
  { id: 1, scrimmageId: 1, senderId: 2, senderName: "Jordan", content: "Anyone bringing extra balls?", sentAt: "2026-06-22T14:00:00Z" },
  { id: 2, scrimmageId: 1, senderId: 1, senderName: "Ryan", content: "I got two, should be enough", sentAt: "2026-06-22T14:02:00Z" },
  { id: 3, scrimmageId: 1, senderId: 3, senderName: "Alex", content: "Nice, I'll bring water for everyone", sentAt: "2026-06-22T14:05:00Z" },
  { id: 4, scrimmageId: 1, senderId: 5, senderName: "Chris", content: "Courts get crowded after 6, we should try to grab one early", sentAt: "2026-06-22T14:10:00Z" },
  { id: 5, scrimmageId: 1, senderId: 1, senderName: "Ryan", content: "Good call. I can get there 15 min early to hold one", sentAt: "2026-06-22T14:12:00Z" },
  { id: 6, scrimmageId: 1, senderId: 4, senderName: "Sam", content: "Sounds good, see you all there", sentAt: "2026-06-22T14:15:00Z" },
];

export const DIRECT_CONVERSATIONS = [
  {
    id: 1,
    otherUserId: 2,
    otherUserName: "Jordan",
    lastMessage: "Yeah I'm down for Thursday too",
    lastMessageAt: "2026-06-19T16:30:00Z",
    messages: [
      { id: 1, senderId: 1, senderName: "Ryan", content: "Hey, good game yesterday!", sentAt: "2026-06-19T15:00:00Z" },
      { id: 2, senderId: 2, senderName: "Jordan", content: "Thanks! That last play was wild", sentAt: "2026-06-19T15:05:00Z" },
      { id: 3, senderId: 1, senderName: "Ryan", content: "You playing again Thursday?", sentAt: "2026-06-19T16:20:00Z" },
      { id: 4, senderId: 2, senderName: "Jordan", content: "Yeah I'm down for Thursday too", sentAt: "2026-06-19T16:30:00Z" },
    ],
  },
  {
    id: 2,
    otherUserId: 3,
    otherUserName: "Alex",
    lastMessage: "See you at the volleyball game!",
    lastMessageAt: "2026-06-18T10:00:00Z",
    messages: [
      { id: 5, senderId: 3, senderName: "Alex", content: "Hey are you going to the volleyball scrimmage?", sentAt: "2026-06-18T09:30:00Z" },
      { id: 6, senderId: 1, senderName: "Ryan", content: "Thinking about it, when is it?", sentAt: "2026-06-18T09:45:00Z" },
      { id: 7, senderId: 3, senderName: "Alex", content: "Friday at 5pm, White Rock Lake", sentAt: "2026-06-18T09:50:00Z" },
      { id: 8, senderId: 1, senderName: "Ryan", content: "See you at the volleyball game!", sentAt: "2026-06-18T10:00:00Z" },
    ],
  },
  {
    id: 3,
    otherUserId: 4,
    otherUserName: "Sam",
    lastMessage: "Awesome, let's do it",
    lastMessageAt: "2026-06-17T20:00:00Z",
    messages: [
      { id: 9, senderId: 4, senderName: "Sam", content: "Wanna hit up Hermann Park this weekend?", sentAt: "2026-06-17T19:30:00Z" },
      { id: 10, senderId: 1, senderName: "Ryan", content: "Awesome, let's do it", sentAt: "2026-06-17T20:00:00Z" },
    ],
  },
];
