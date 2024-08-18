import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store,{persistor} from './Store/reduxStore.js'
// import dotenv from 'dotenv'
// dotenv.config()
 
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_GCLIENTID
console.log('env varaible',clientId);

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = {hasError:false}
  }
  static getDerivedStateFromError(error){
    return {hasError:true}
  }
  componentDidCatch(error,info){
    console.log("ERROR from frontend-->",error);
    console.log("INFo-->",info);
  }
  render() {
    if(this.state.hasError){
      return <div>ERROR</div>
    }else{
      return this.props.children
    }
  }
} 
console.log("store.getState()-->"+JSON.stringify(store.getState()))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)


