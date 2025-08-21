import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import setupAxiosInterceptor from './utils/axiosInterceptor';

// Setup Axios Interceptor
setupAxiosInterceptor();

createRoot(document.getElementById('root')!).render(
  import.meta.env.DEV ? <App /> : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
)