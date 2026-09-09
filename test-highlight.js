const highlightJson = (jsonStr) => {
  if (!jsonStr) return '';
  return jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let color = '#2c4035'; // default ink
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#8b5a2b'; // keys - brown
        } else {
          color = '#2d6a4f'; // string values - forest green
        }
      } else if (/true|false/.test(match)) {
        color = '#d97706'; // booleans - amber
      } else if (/null/.test(match)) {
        color = '#6b7280'; // null - gray
      } else {
        color = '#0284c7'; // numbers - blue
      }
      return `<span style="color: ${color}">${match}</span>`;
    });
};

console.log(highlightJson('{"foo": "bar"}'));
