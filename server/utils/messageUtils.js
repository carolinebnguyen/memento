const createParticipantKey = (sender, recipient) => {
  const participantKey = [sender, recipient].sort().join('-');
  return participantKey;
};

const getParticipantList = (participantKey) => {
  const participants = participantKey.split('-');
  return participants;
};

module.exports = { createParticipantKey, getParticipantList };
