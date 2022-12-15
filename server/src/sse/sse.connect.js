const SSE = require('sse');

const parseHeader = (rawHeaders) => {
  const parsed = rawHeaders
    .reduce((pre, cur) => {
      if (pre === true) return cur;
      return cur === 'Referer' ? true : pre;
    }, undefined)
    .split('/')
    .splice(-2);
  if (parsed === undefined || parsed.length < 2) return undefined;
  return parsed[0] === 'page' ? parsed[1] : undefined;
};

module.exports = (server) => {
  const sse = new SSE(server);
  sse.on('connection', (client) => {
    const pageId = parseHeader(client.req.rawHeaders);
    const onSave = (tasks, userId, title) => {
      client.send(JSON.stringify({ edits: tasks, userId, title }));
    };
    sse.on(pageId, onSave);
    client.on('close', () => {
      sse.off(pageId, onSave);
      console.log('disconnect!');
    });
  });
  return sse;
};
