const createParticipantKey = (sender, recipient) => {
  const participantKey = [sender, recipient].sort().join('-');
  return participantKey;
};

module.exports = { createParticipantKey };
