import './App.css';
import React, { lazy } from 'react'
import {
  Routes,
  Route,
  useLocation,
  Navigate

} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import SuspenseWithChunkError from './components/SuspenseWithChunkError';
import PageLoader from './components/PageLoader';

export const RemoveTrailingSlash = ({ ...rest }) => {
  const location = useLocation()

  // If the last character of the url is '/'
  if (location.pathname.match('/.*/$')) {
    return <Navigate replace {...rest} to={{
      pathname: location.pathname.replace(/\/+$/, ""),
      search: location.search
    }} />
  }

  return null
}
const PreserveQueryNavigate = ({ to }: any) => {
  const location = useLocation()
  const search = location.search
  return <Navigate to={`${to}${search}`} replace />
}
const Home = lazy(() => import('./views/Home'))
const IPM = lazy(() => import('./views/IPM'))
const Calculator = lazy(() => import('./views/Calculator/index'))
const CalculatorResult = lazy(() => import('./views/Calculator/result'))
const Chatbot = lazy(() => import('./views/Chatbot'))

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <RemoveTrailingSlash />
          <Routes>
            <Route index element={<PreserveQueryNavigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ipm" element={<IPM />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/calculator/result" element={<CalculatorResult />} />
            <Route path="/chatbot" element={<Chatbot />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </SuspenseWithChunkError>
      </div>
    </ChakraProvider>
  );
}

export default React.memo(App);
