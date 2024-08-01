import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = {hasError:false}
  }
  static getDerivedStateFromError(error){
    return {hasError:true}
  }
  componentDidCatch(error,info){
    console.log("ERR",error);
  }
  render() {
    if(this.state.hasError){
      return <div>ERROR</div>
    }else{
      return this.props.children
    }
  }
} 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
  </React.StrictMode>,
)


