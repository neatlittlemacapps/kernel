// Kernel components read window.React at module load (extraction-boundary design).
// This must be the first import in preview.jsx to populate globalThis.React before
// any component module evaluates.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
window.React = React;
window.ReactDOM = ReactDOM;
