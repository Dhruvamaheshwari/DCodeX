
import {Routes , Route} from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {checkAuth} from './authSlice'
import { useDispatch , useSelector} from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./adminPage/AdminPanel";

function App() {

  // code likhna ki ye user authetciated h ki nhi h;
  const {isLoading} =  useSelector((state) => state.auth); // auth ye slick ka naam h;
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
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route>
      </Routes>
    </>
  );
}
export default App;