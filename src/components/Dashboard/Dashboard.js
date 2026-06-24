import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { StyledEngineProvider } from '@mui/material/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import BarAnalytics from './BarAnalytics';
import CommentsAnalytics from './CommentsAnalytics';
import RatingAnalytics from './RatingAnalytics';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import TestAjax from './test/TestAjax'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Promo from './Promo/CreatePromo'
import GetPromo from './Promo/GetPromo';
import UpdatePromo from './Promo/UpdatePromo';
import Title from './Title';
import BlogAllPost from './BlogAllPost';
import EditModal from '../BlogPage/EditModal';
import CreateDoctor from './CreateDoctor';
import RegisterUser from './RegisterUser';
import SubscribedUser from './SubscribedUser';
import DoctorCreate from './DoctorCreate';
import NestedListItems from './NestedListItems';
import CommentsRev from './CommentsRev';
import Analytics from './Analytics';
import WhatsappAnalytics from './WhatsappAnalytics';
import { backendHost } from '../../api-config';
import { ImageUpload } from './ImageUpload';
import createTypography from '@material-ui/core/styles/createTypography';
import EditTip from './EditTip';
import Tip from './Tip';
import TipDetails from "./TipDetails";
import CreateCompany from "./CreateCompany";
import Campign from "./Campign";
import CampaignAds from "./CampaignAds";
import CompanyList from './Campaign/CompanyList';
import CampaignList from './Campaign/CampaignList';
import CampaignAdvs from './Campaign/CampaignAdvs';
import UpdateCompany from './Campaign/UpdateCompany';
import UpdateCampaign from './Campaign/UpdateCampaign';
import UpdateAdvs from './Campaign/UpdateAdvs';
import CreateWebStories from './CreateWebStories';
import MasterTables from './DoctorItems/MasterTables';
import CreateServiceList from './DoctorItems/CreateContract';
import DoctorAvailibility from './DoctorItems/DoctorAvailibility';
import AllContract from './DoctorItems/AllContract';
import UpdateContract from './DoctorItems/UpdateContract';
import AllServicesList from './DoctorItems/AllServicesList';
import UpdateAllServices from './DoctorItems/UpdateAllServices';
import AllServicesPaymentList from './DoctorItems/AllServicesPaymentList';
import UpdatePayment from './DoctorItems/UpdatePayment';
import FailureReasonList from './DoctorItems/FailureReasonList';
import UpdateFailureReason from './DoctorItems/UpdateFailureReason';
import DoctorAvailibilityList from './DoctorItems/DoctorAvailibilityList';
import UpdateDoctorAvail from './DoctorItems/UpdateDoctorAvail';
import CreateServicePaymentMethod from './DoctorItems/CreateServicePaymentMethod';
import ServicePaymentMethodList from './DoctorItems/ServicePaymentMethodList';
import UpdateServicePayment from './DoctorItems/UpdateServicePayment';
import WebstoriesList from './WebstoriesList';
import WebstoriesUpdate from './WebstoriesUpdate';








function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        All Cures
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  // const acPerm = Cookies.get("acPerm").split('|')
  const [open, setOpen] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(null);


  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  }; 
  
  const handleCountClick = (key,value) => {
    // e.preventDefault()
    setIsOnline(true);
    // useEffect(() => {
    //   setKey(key)
    // }, []);
     // return "CCCCCCCCCCLIIIIIIIIIICCCCCCCKKKKKKKKKKK"+key+value
  //  return (<RenderComponentArticle value={value} key={key} kv={1}/>);
  //  return (<div></div>)
 // props.dispatch(<RenderComponentArticle value={value} key={key} kv={1}/>);
  };
  
  useEffect(() => {
    document.title = 'All-Cures | Dashboard'
    setIsLoaded(false);
    // fetch(`${backendHost}/dashboard/articlecount`)
  //   axios.defaults.withCredentials = true
  //   axios.get(`${backendHost}/dashboard/articlecount`,    {   withCredentials: true,origin: "http://192.168.29.160",headers: {
  //     'Access-Control-Allow-Credentials': true
  //   },credentials: "same-origin"
  // })
  fetch(`${backendHost}/dashboard/articlecount`, {
    method: "GET",
    credentials: "include",headers: {'Access-Control-Allow-Credentials': true}
  })
  .then((res) => res.json())
      .then((json) => {
        setItems(json);
        setIsLoaded(true);        
        // <RenderComponent
        //     pathname={props.location.pathname}
        //     search={props.location.search} 
        //     container={classes.container} 
        //     fixedHeightPaper={fixedHeightPaper} 
        //     ajaxIsLoaded={isLoaded}
        //     ajaxItems={items}
        //     isOnline={isOnline}
        //   />
      });
      // eslint-disable-next-line
    }, []);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className="wallpaper-dashboard">
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          Dashboard
          </Typography>
          <IconButton color="inherit">
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <StyledEngineProvider injectFirst>
    <NestedListItems />
  </StyledEngineProvider>
        <Divider />
        
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
          <RenderComponent 
            search={props.location.search} 
            container={classes.container} 
            fixedHeightPaper={fixedHeightPaper} 
            ajaxIsLoaded={isLoaded}
            ajaxItems={items}
            handleCountClick = {handleCountClick}
          />
          {/* <Promo/> */}
          {/* <RenderComponentArticle value={items} key={123}/>
          <div className="timer">Timer: {isLoaded}s</div> */}
      </main>
    </div>
    </div>
  );
}


//   if(key){
//   return(
//       <div className='card'>{key}
//         <Grid item xs={12} md={4} lg={3}>
//           <Paper>
//             <React.Fragment>
//               <Title>{key} Article IDs</Title>  
//               <ul>
//               {value.map(item => {
//                 <li>{item}</li>;
//               })}
//               </ul> 
//               <Typography color="textSecondary">
//               </Typography>
//             </React.Fragment>
//           </Paper>
//         </Grid>
//       </div>
//     )
// }
//}

function RenderComponent(props){
  // debugger
  // if (props.ajaxItems){
  // this.ajaxItems['draft_article']
  // if(props.key === "Draft"){
    // if (props.key)
    // return(<RenderComponentArticle value={props.ajaxItems[props.key]} key={props.key}/>);
  // }
// }
  if(props.search === '?article'){
    return(<EditModal search={props.search} />);
  }
 
 
  if(props.search === '?blogs'){
    return(<BlogAllPost/>);
  }
 
  if(props.search === '?tip'){
    return(<Tip/>);
  }

  if(props.search === '?tipdetails'){
    return(<TipDetails/>);
  }
  if(props.search === '?create_promo'){
    return(<Promo/>);
  } else if(props.search === '?stats'){
    
    return(<Container maxWidth="lg" className={props.container}>
    <Grid container spacing={3}>
     
      <Grid item xs={12} md={4}>
        <Paper className={props.fixedHeightPaper}>
          <div className="h4">Cure Statistics</div>
          <div className="h6">Published : <TestAjax name="published_article"/></div>
          {/* <Deposits /> */}
          <div className="h6">Draft: <TestAjax name="draft_article"/></div>
          <div className="h6">Approval: <TestAjax name="approval_article"/></div>
          <div className="h6">Review: <TestAjax name="review_article"/></div>
          {/* <Draft/>
          <Approval />
          <Review /> */}

        </Paper>
      </Grid>
      {/* <Grid item xs={12} md={4} lg={3}>
        <Paper className={props.fixedHeightPaper}>
          
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={props.fixedHeightPaper}>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={props.fixedHeightPaper}>
        <Deposits />
        </Paper>
      </Grid> */}
    </Grid>
    <Box pt={4}>
      <Copyright />
    </Box>
  </Container>
  );
  } else if(props.search === '?promotions'){
    return(
      <GetPromo/>
    )
    

  } else if(props.search.split('=')[0] === '?edit'){
    return(
      <UpdatePromo search={props.search}/>
    )
  } else if(props.search.split('=')[0] === '?doctor'){
    return(
      <CreateDoctor search={props.search}/>
    )
  } else if(props.search.split('=')[0] === '?doctorcreate'){
    return(
      <DoctorCreate search={props.search}/>
    )

  } else if(props.search.split('=')[0] === '?edittip'){
    return(
      <EditTip search={props.search}/>
    )
    
  } else if(props.search.split('=')[0] === '?editarticle'){
    return(
      <EditModal search={props.search}/>
    )
  // } else if(props.search.split('=')[0] === '?feedbacks'){
  //   return(
  //     <UserFeedback search={props.search}/>
  //   )
  } else if(props.search.split('=')[0] === '?comments'){
    return(
      <CommentsRev search={props.search}/>
    )
  } else if(props.search.split('=')[0] === '?user'){
    return(
      <RegisterUser search={props.search}/>
    )
  // 
  }else if(props.search.split('=')[0] === '?test'){
    return(
      <NestedListItems search={props.search}/>
    )
  // 
  }
  
  else if(props.search.split('=')[0] === '?subscribedusers'){
    return(
      <SubscribedUser search={props.search}/>
    )
  // 
  } 
  else if(props.search.split('=')[0] === '?analytics'){
    return(
      <Analytics search={props.search}/>
    )
  // 
  } 
  else if(props.search.split('=')[0] === '?baranalytics'){
    return(
      <BarAnalytics search={props.search}/>
    )
  // 
  } 
  else if(props.search.split('=')[0] === '?ratinganalytics'){
    return(
      <RatingAnalytics search={props.search}/>
    )
  // 
  } 
  else if(props.search.split('=')[0] === '?commentsanalytics'){
    return(
      <CommentsAnalytics search={props.search}/>
    )
  // 
  } 
  else if(props.search.split('=')[0] === '?whatsappanalytics'){
    return(
      <WhatsappAnalytics search={props.search}/>
    )
  // 
  } 

    else if(props.search.split('=')[0] === '?createwebstories'){
    return(
      <CreateWebStories search={props.search}/>
    )
  
  } 

 else if(props.search.split('=')[0] === '?webstoriesList'){
    return(
      < WebstoriesList search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?webstoriesUpdate'){
    return(
      < WebstoriesUpdate search={props.search}/>
    )
  
  } 
  
  else if(props.search.split('=')[0] === '?createcompany'){
    return(
      <CreateCompany search={props.search}/>
    )
  
  } 
  
  else if(props.search.split('=')[0] === '?createcampaign'){
    return(
      <Campign search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?createcampaignads'){
    return(
      <CampaignAds search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?companylist'){
    return(
      <CompanyList search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?campaignlist'){
    return(
      <CampaignList search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?campaignadslist'){
    return(
      <CampaignAdvs search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?updatecampaignads'){
    return(
      <UpdateAdvs search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?updatecampaignlist'){
    return(
      <UpdateCampaign search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?updatecompany'){
    return(
      <UpdateCompany search={props.search}/>
    )
  
  }

  else if(props.search.split('=')[0] === '?mastertable'){
    return(
      <MasterTables search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?createcontract'){
    return(
      <CreateServiceList search={props.search}/>
    )
  
  }

  else if(props.search.split('=')[0] === '?allcontract'){
    return(
      <AllContract search={props.search}/>
    )
  
  }
  else if(props.search.split('=')[0] === '?updatecontract'){
    return(
      <UpdateContract search={props.search}/>
    )
  
  }

  else if(props.search.split('=')[0] === '?doctoravailibility'){
    return(
      <DoctorAvailibility  search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?doctoravailibilitylist'){
    return(
      <DoctorAvailibilityList  search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?updateAvailibilityList'){
    return(
      <UpdateDoctorAvail  search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?allserviceslist'){
    return(
      <AllServicesList search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?updateallserviceslist'){
    return(
      <UpdateAllServices search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?allservicespaymentlist'){
    return(
      <AllServicesPaymentList search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?updateallservicespaymentlist'){
    return(
      <UpdatePayment search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?failurereasonlist'){
    return(
      <FailureReasonList search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?updatefailurereasonlist'){
    return(
      <UpdateFailureReason search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?createservicespaymentmethod'){
    return(
      <CreateServicePaymentMethod search={props.search}/>
    )
  
  } 

  else if(props.search.split('=')[0] === '?servicespaymentmethodlist'){
    return(
      <ServicePaymentMethodList search={props.search}/>
    )
  
  } 
  else if(props.search.split('=')[0] === '?updateservicepaymentmethod'){
    return(
      <UpdateServicePayment search={props.search}/>
    )
  
  } 

  
  else if(props.search.split('=')[0] === '?upload-img'){
    return(
      <ImageUpload search = {props.search}/>
    )
  } else {
    if (!props.ajaxIsLoaded) {

      return <div>Loading...</div>;
    } else if (props.ajaxIsLoaded) {
    return(
    <Container maxWidth="lg" className={props.container}>
    <Grid container spacing={3}>
       
      <Grid item xs={12} md={4} lg={3}>
       <Paper className={props.fixedHeightPaper}>
        <React.Fragment>
          <Title>Draft Cures</Title>   
          <div onClick={(e) => props.handleCountClick("Draft",props.ajaxItems["draft_article"],e)}>{props.ajaxItems["draft_article"].length}</div>
          {/* <div style={{ color: props.isOnline ? 'green' : 'black' }} onClick={(e) => props.handleCountClick("Draft",props.ajaxItems["draft_article"])}>Test</div> */}

          <Typography color="textSecondary">
          </Typography>
        </React.Fragment>
       </Paper>
     </Grid>
    
     <Grid item xs={12} md={4} lg={3}>
       <Paper className={props.fixedHeightPaper}>
        <React.Fragment>
          <Title>For Review</Title>   
          <div onClick={() => props.handleCountClick("Review",props.ajaxItems["review_article"])}>{props.ajaxItems["review_article"].length}</div>
          <Typography color="textSecondary">
          </Typography>
        </React.Fragment>
       </Paper>
     </Grid>
     <Grid item xs={12} md={4} lg={3}>
       <Paper className={props.fixedHeightPaper}>
        <React.Fragment>
          <Title>Published Cures</Title>   
          <div onClick={() => props.handleCountClick("Publish",props.ajaxItems["published_article"])}>{props.ajaxItems["published_article"].length}</div>  
          <Typography color="textSecondary">
          </Typography>
        </React.Fragment>
       </Paper>
     </Grid>
     <p id="Default" style={{ width:'100%', color: props.isOnline ? 'green' : 'black'  }} onClick={(e) => props.handleCountClick("Draft",props.ajaxItems["draft_article"])}> draft_article: {JSON.stringify(props.ajaxItems["draft_article"])}</p>
     <p id="Review" style={{ width:'100%',  color: props.isOnline ? 'green' : 'black' }} onClick={(e) => props.handleCountClick("Review",props.ajaxItems["review_article"])}> review_article: {JSON.stringify(props.ajaxItems["review_article"])}</p>
     <p id="Approval" style={{ width:'100%',  color: props.isOnline ? 'green' : 'black' }} onClick={(e) => props.handleCountClick("Approval",props.ajaxItems["approval_article"])}> approval_article: {JSON.stringify(props.ajaxItems["approval_article"])}</p>
     <p id="Publish" style={{ width:'100%',  color: props.isOnline ? 'green' : 'black' }} onClick={(e) => props.handleCountClick("Publish",props.ajaxItems["published_article"])}> publish_article: {JSON.stringify(props.ajaxItems["published_article"])}</p>

      <Paper className={props.fixedHeightPaper}>Published Cures
        {props.ajaxItems["published_article"].map((i) => (
          <>
          <Link to={`${/cure/i}`}>{i}</Link>
          </>
        ))}
      </Paper>
    </Grid>
    <Box pt={4}>
      <Copyright />
    </Box>
  </Container>
    )
    }
  }
}
