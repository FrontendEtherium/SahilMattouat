import React from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  BrowserRouter,
} from "react-router-dom";
// import Heart from"../assets/img/heart.png";

import Heart from "../assets/img/heart.png";

import Home from "./LandingPage/Home";
import Profile from "./Profile/Profile";
import Privacy from "../privacy.js";

import Search from "./Search/Search";
import SearchName from "./Search/SearchName";
import AboutUs from "./Header/AboutUs";
import AuthApi from "./AuthApi";
import Disease from "./Disease/Disease";
import ChatList from "./LandingPage/ChatList";
import Dashboard from "./Dashboard/Dashboard.js";
import Analytics from "./Dashboard/Analytics";
import Blogpage from "./BlogPage/Blogpage";
import Medicinepage from "./BlogPage/Medicinepage";
import EditPost from "./BlogPage/EditModal";
import BlogAllPost from "./Dashboard/BlogAllPost";
import LoginInfo from "./loginForm/LoginInfo";
import CommentsRev from "./Dashboard/CommentsRev.js";
import Results from "./Dashboard/Results.js";
import PromoPaid from "./Dashboard/PromoPaid.js";
import PromoAdmin from "./Dashboard/PromoAdmin.js";
import ResetPass from "./loginForm/ResetPass.js";
import Verify from "./loginForm/Verify.js";
import EditSubscribe from "./Dashboard/EditSubscribe";
import DeleteSubscribe from "./Dashboard/DeleteSubscribe";
import List from "../List";
import DeleteUserProfile from "./Header/DeleteUserProfile";
import Userprofile from "./Profile/Userprofile";
import MyArticle from "./Profile/MyArtcle";
import ListArticle from "./Profile/ListArticle";
import NotFound from "./NotFound";
import { userAccess } from "./UserAccess";
import NotAuthorizedPage from "./NotAuthorizedPage";
import Feedback from "./Feedback";
import Categorypage from "./BlogPage/Categorypage";
import Editorial from "./Header/Editorial";
import Medical from "./Header/Medical";

import AllDisease from "./Header/AllDisease";
import privacy from "./BlogPage/Privacy";
import A from "./Header/Health A To Z/A";
import B from "./Header/Health A To Z/B";
import C from "./Header/Health A To Z/C";
import D from "./Header/Health A To Z/D";
import E from "./Header/Health A To Z/E";
import F from "./Header/Health A To Z/F";
import G from "./Header/Health A To Z/G";
import H from "./Header/Health A To Z/H";
import I from "./Header/Health A To Z/I";
import K from "./Header/Health A To Z/K";
import L from "./Header/Health A To Z/L";
import M from "./Header/Health A To Z/M";
import N from "./Header/Health A To Z/N";
import O from "./Header/Health A To Z/O";
import P from "./Header/Health A To Z/P";
import R from "./Header/Health A To Z/R";
import S from "./Header/Health A To Z/S";
import T from "./Header/Health A To Z/T";
import U from "./Header/Health A To Z/U";
import V from "./Header/Health A To Z/V";
import J from "./Header/Health A To Z/J";
import Q from "./Header/Health A To Z/Q";
import All from "./Header/Health A To Z/All";
import X from "./Header/Health A To Z/X";

import Y from "./Header/Health A To Z/Y";

import Z from "./Header/Health A To Z/Z";
import AppRedirect from "./LandingPage/AppRedirect";
import Webstories from "./WebStories/Webstories";
import RedirectQr from "./RedirectQr.js";
import DoctorLink from "./Profile/DoctorLink.js";
import ResponsePage from "./Profile/ResponsePage.js";
import PaymentRedirect from "./Profile/PaymentRedirect.js";
import ResponseRedirect from "./Profile/ResponseRedirect.js";
import DoctorConnect from "./LandingPage/DoctorConnect.js";
import DoctorLandingPage from "./LandingPage/DoctorLandingPage.js";
import Bookings from "./Profile/Bookings.js";
import AllBlogs from "./BlogPage/AllBlogs.js";

function Main(props) {
  const history = useHistory();

  // render() {
  const [auth, setAuth] = React.useState("not-logged-in");
  const [authLoaded, setAuthLoaded] = React.useState(false);
  const readCookie = () => {
    var user = userAccess;

    if (user >= 4 && user < 10) {
      // user access for reviewer to admin previleges
      setAuth("admin");
    } else if (user >= 1 && user < 4) {
      // user access for normal users
      setAuth("normal-user");
    } else if (!user) {
      // user access for not logged in users
      setAuth("not-logged-in");
    }
  };
  const url = props.url;
  React.useEffect(() => {
    // setAuth('authuhuhu', () => console.log('set auth: ', auth))
    readCookie();
  });

  React.useEffect(() => {
    setAuthLoaded(true);
  }, [auth]);

  if (!authLoaded) {
    return (
      <div className="loader main">
        <img src={Heart} alt="All Cures Logo" id="heart" />
      </div>
    );
  } else {
    return (
      <div>
        <AuthApi.Provider value={{ auth, setAuth }}>
          <BrowserRouter history={history}>
            {/* <HelmetMetaData></HelmetMetaData> */}
            <Routes authLoaded={authLoaded} url={url} userAccess={userAccess} />
          </BrowserRouter>
        </AuthApi.Provider>
      </div>
    );
  }
}

const Routes = (props) => {
  const Auth = React.useContext(AuthApi);
  return (
    <>
      <Switch>
        {/* Home Page */}

        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/feedback" component={Feedback} />
        <Route exact path="/alldisease" component={AllDisease} />
        <Route exact path="/aboutus" component={AboutUs} />
        <Route exact path="/DeleteUserProfile" component={DeleteUserProfile} />
        <Route exact path="/editorial" component={Editorial} />
        <Route exact path="/medical" component={Medical} />
        <Route exact path="/chatlist" component={ChatList} />
        <Route exact path="/appRedirect" component={AppRedirect} />
        {/* <Route exact path="/webStories" component={Webstories} /> */}
        <Route exact path="/jammuevent" component={RedirectQr} />
        <Route path="/notification/:linkid" component={DoctorLink} />
        <Route exact path="/paymentStatus" component={ResponsePage} />
        <Route exact path="/paymentRedirection" component={PaymentRedirect} />
        <Route exact path="/statusPayment" component={ResponseRedirect} />
        <Route exact path="/bookings" component={Bookings} />
        <Route
          exact
          path="/doctor-connect/:medicineType?"
          component={DoctorConnect}
        />
        <Route exact path="/doctor" component={DoctorLandingPage} />

        <Route exact path="/privacy" component={Privacy} />

        {/* Health a to z Page */}

        <Route exact path="/alldisease-A" component={A} />
        <Route exact path="/alldisease-B" component={B} />
        <Route exact path="/alldisease-C" component={C} />
        <Route exact path="/alldisease-D" component={D} />
        <Route exact path="/alldisease-E" component={E} />
        <Route exact path="/alldisease-F" component={F} />
        <Route exact path="/alldisease-G" component={G} />
        <Route exact path="/alldisease-H" component={H} />
        <Route exact path="/alldisease-I" component={I} />
        <Route exact path="/alldisease-K" component={K} />
        <Route exact path="/alldisease-L" component={L} />
        <Route exact path="/alldisease-M" component={M} />
        <Route exact path="/alldisease-N" component={N} />
        <Route exact path="/alldisease-O" component={O} />
        <Route exact path="/alldisease-P" component={P} />
        <Route exact path="/alldisease-R" component={R} />
        <Route exact path="/alldisease-S" component={S} />
        <Route exact path="/alldisease-T" component={T} />
        <Route exact path="/alldisease-U" component={U} />
        <Route exact path="/alldisease-V" component={V} />

        <Route exact path="/alldisease-J" component={J} />
        <Route exact path="/alldisease-Q" component={Q} />
        <Route exact path="/alldisease-X" component={X} />
        <Route exact path="/alldisease-Y" component={Y} />
        <Route exact path="/alldisease-Z" component={Z} />
        <Route exact path="/allcategory" component={All} />
        <Route exact path="/allcures" component={AllBlogs} />

        {/* Doctor search page */}
        <Route exact path="/search/:city" component={Search} />
        <Route exact path="/searchName/:name" component={SearchName} />
        <Route path="/search/:city/:name" component={Search} />

        {/* Article edit */}
        <ProtectedRoute
          auth={Auth.auth}
          path="/article/:id"
          component={EditPost}
        />

        {/* Article creation page */}
        <ProtectedRoute auth={Auth.auth} path="/article" component={EditPost} />

        {/* Dashboard pages */}
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/analytics"
          component={Analytics}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard"
          component={Dashboard}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/blogs"
          component={BlogAllPost}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/commentsrev"
          component={CommentsRev}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/results"
          component={Results}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/promopaid"
          component={PromoPaid}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/promoadmin"
          component={PromoAdmin}
        />
        <ProtectedRouteDashboard
          userAccess={props.userAccess}
          auth={Auth.auth}
          exact
          path="/dashboard/promoadmin"
          component={PromoAdmin}
        />

        {/* Cures list page */}
        <Route exact path="/searchcures" component={Blogpage} />
        <Route path="/searchcures/:type" component={Blogpage} />

        <Route exact path="/searchmedicine" component={Medicinepage} />
        <Route path="/searchmedicine/:cureType" component={Medicinepage} />

        {/*category*/}
        <Route exact path="/searchcategory" component={Categorypage} />
        <Route
          path="/searchcategory/disease/:disease_condition_id"
          component={Categorypage}
        />
        {/* Cure according to article_id*/}
        {/* <Route auth={Auth.auth} exact path="/cure/:cureType/:id" component={Disease}/> */}

        <Route auth={Auth.auth} exact path="/cure/:id" component={Disease} />

        {/* Doctor profile page */}
        <Route auth={Auth.auth} exact path="/doctor/:id" component={Profile} />
        <Route exact path="/profile/:id/edit" component={LoginInfo} />
        <Route exact path="/privacy" component={privacy} />
        {/* Doctor invitation page and ask for UPNR number */}
        <Route exact path="/login/doctor" component={LoginInfo} />

        {/* User's self profile */}
        <ProtectedRoute
          auth={Auth.auth}
          exact
          path="/user/profile"
          component={Userprofile}
        />

        {/* My articles */}
        <ProtectedRoute
          auth={Auth.auth}
          exact
          path="/my-cures"
          component={MyArticle}
        />
        <Route exact path="/ListArticle" component={ListArticle} />

        <Route exact path="/editsubscribe" component={EditSubscribe} />
        <Route exact path="/list" component={List} />
        <Route exact path="/deletesubscribe" component={DeleteSubscribe} />

        <Route exact path="/loginForm/ResetPass" component={ResetPass} />
        <Route exact path="/loginForm/verify" component={Verify} />

        {/* For not authorized users trying to access Dashboard */}
        <Route exact path="/forbidden" component={NotAuthorizedPage} />
        {/* When the requested page is not available */}
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};

const ProtectedRoute = ({ auth, path, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        auth !== "not-logged-in" ? (
          <Route exact path={path} component={Component} />
        ) : (
          // <Redirect to="/login"/>
          <Redirect
            to={{
              pathname: "/home",
              search: "",
              state: { modalShow: true, path: path },
            }}
          />
        )
      }
    />
  );
};
const ProtectedRouteDashboard = ({
  auth,
  path,
  component: Component,
  userAccess,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={() =>
        auth !== "not-logged-in" && userAccess > 4 ? (
          <Route exact path={path} component={Component} />
        ) : (
          // <Redirect to="/login"/>

          <Redirect to={{ pathname: "/forbidden", search: "" }} />
        )
      }
    />
  );
};

// const ProtectedLogin = ({auth, component:Component, ...rest}) => {
//     return(
//       <Route
//       {...rest}
//       render = {() =>!auth ? (
//         <Component/>
//       ):
//         (
//           <Redirect to="#"/>
//         )
//     }
//       />
//     )
// }

// const ProtectedArticle = ({auth, component:Component, ...rest}) => {

//   return(
//     <Route
//       {...rest}
//         render = {() => auth?(
//           <Component/>
//           // console.log('Auth: Nope', auth)
//           ):
//         (
//           <Redirect to="/home"/>

//           // console.log('AuthSuccess: ', auth)
//         )
//       }
//     />
//   )
// }

export default Main;
