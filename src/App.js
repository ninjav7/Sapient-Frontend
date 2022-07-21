import React from 'react';
import Routes from './routes/Routes';

// setup fake backend
import { configureFakeBackend } from './helpers';
import { createBrowserHistory } from 'history';
import SetupInterceptors from './middleware/SetupInterceptors';
// Themes

// default
import './assets/scss/theme.scss';

// dark
// import './assets/scss/theme-dark.scss';

// rtl
// import './assets/scss/theme-rtl.scss';


// configure fake backend
configureFakeBackend();

/**
 * Main app component
 */
const App=()=>{
  const history = createBrowserHistory();
  SetupInterceptors(history);
    return <Routes></Routes>;
}

export default App;
