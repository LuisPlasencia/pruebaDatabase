function parsePositiveId(value) {
  const parsedId = Number(value);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

module.exports = { parsePositiveId };
