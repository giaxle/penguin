export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (allMessages, m, i, userId) => {
  return (
    i < allMessages.length - 1 &&
    (allMessages[i + 1].sender._id !== m.sender._id ||
      allMessages[i + 1].sender._id === undefined) &&
    allMessages[i].sender._id !== userId
  );
};

export const isLastMessage = (allMessages, i, userId) => {
  return (
    i === allMessages.length - 1 &&
    allMessages[allMessages.length - 1].sender._id !== userId &&
    allMessages[allMessages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (allMessages, m, i, userId) => {
  if (
    i < allMessages.length - 1 &&
    allMessages[i + 1].sender._id === m.sender._id &&
    allMessages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < allMessages.length - 1 &&
      allMessages[i + 1].sender._id !== m.sender._id &&
      allMessages[i].sender._id !== userId) ||
    (i === allMessages.length - 1 && allMessages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
