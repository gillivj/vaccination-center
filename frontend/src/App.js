import './App.css';
import {Route, Switch,BrowserRouter } from 'react-router-dom';
import {VaccineRegistration} from './containers/VaccineRegistration/VaccineRegistration';
import {VaccineRegistrationListing} from './containers/VaccineRegistration/ListVaccinationBooking';
import {EditVaccineRegistration} from './containers/VaccineRegistration/EditVaccinationBooking';

import {VaccinationCenterListing} from './containers/VaccinationCenter/ListVaccinationCenter';
import {NurseListing} from './containers/Nurse/ListNurse';

import { NavBar } from './containers/Nav';
import { Component } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

class App extends Component {
  componentDidMount() {
    document.title = 'Vaccination Center';
  }
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
            <NavBar />
            <Switch>
              <Route path="/booking" exact component={VaccineRegistrationListing} />
              <Route path="/booking/:id" exact component={EditVaccineRegistration} />
              <Route path="/" exact component={VaccineRegistration} />

              <Route path="/vaccination_center" exact component={VaccinationCenterListing} />
              <Route path="/nurse" exact component={NurseListing} />
            </Switch>
        </BrowserRouter>
      </LocalizationProvider>
    )
  }
}


export default App;
