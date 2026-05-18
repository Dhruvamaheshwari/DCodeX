
import {Routes , Route, Navigate} from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {checkAuth} from './authSlice'
import { useDispatch , useSelector} from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./adminPage/AdminPanel";

function App() {

  // code likhna ki ye user authetciated h ki nhi h;
  const {isLoading , isAuthenticated , user} =  useSelector((state) => state.auth); // auth ye slick ka naam h;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth())
  } , [dispatch])



  if(isLoading)
  {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  }
 
  return (
    <>
      <Routes>
          <Route path="/" element={isAuthenticated ?<HomePage></HomePage>:<Navigate to="/signup"/>}></Route>
          <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
          <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>
          {/* <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route> */}
          {/* hum url se hit kre ge to pura page reload hota h to jo admin bhi hoga vo bhi admin page ko access nhi kr paye ga isliye hum navlink ka use krete h */}
          <Route path="/admin" element={isAuthenticated && user?.role === 'admin'? <AdminPanel></AdminPanel> : <Navigate to='/'/>}/>
      </Routes>
    </>
  );
}
export default App;