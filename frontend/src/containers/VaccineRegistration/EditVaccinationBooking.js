import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import React, { Component } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const minDate = new Date(new Date().getTime() + 86400000);

export class EditVaccineRegistration extends Component {
  constructor(props) {
    super(props);

    this.onChangeNric= this.onChangeNric.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(8,15,0,0)

    this.state = {
      name: "",
      nric: "",
      vaccination_centers: [],
      vaccination_center_id: "",
      date: tomorrow,
      submitDisabled: false,
      errors: {}
    }; 
  }
  componentDidMount() {
    axios.get('http://localhost:5000/booking/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          name: response.data.patient.name,
          nric: response.data.patient.nric,
          vaccination_center_id: response.data.vaccination_center._id.toString(),
          date: new Date(response.data.booking_date),
          submitDisabled: false,
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/vaccination_center/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            vaccination_centers: response.data,
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
  onChangeNric(e) {
    const state = this.state;
    if (e.target.value.length > 0) {      
      state.errors['nric'] = ""
    }
    this.setState({...state, nric: e.target.value})
    
  }
  onChangeName(e) {
    const state = this.state;
    if (e.target.value.length > 0) {      
      state.errors['name'] = ""
    }
    this.setState({...state, name: e.target.value})
  }
  handleSelect(event) {
    this.setState({ vaccination_center_id: event.target.value });
  }
  handleDateChange(value) {
    const state = this.state;
    this.setState({ ...state, date: value });
  }
  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name
    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "Cannot be empty"
    }

    if (!this.state.nric) {
      formIsValid = false;
      errors["nric"] = "Cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  onSubmit(e) {
    e.preventDefault();

    if (this.state.disabled) {
      return;
    }
    if (this.handleValidation()) {
      this.setState({submitDisabled: true});
      const booking = {
        name: this.state.name,
        nric: this.state.nric,
        vaccination_center_id: this.state.vaccination_center_id,
        date: this.state.date
      }   

      axios.post('http://localhost:5000/booking/update/'+this.props.match.params.id, booking)
        .then(res => {
          toast.success("Reservation updated successfully");
          window.location = '/booking';
        })
        .catch(error => {
          if (error.response) {
            toast.error(error.response.data.error)
          } else {
            toast.error(error.message)
          }
        })
        .finally(() => {
          this.setState({submitDisabled: false});
        })
    }    
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <ToastContainer />
        <Container>
          <Box
            component="form"
            sx={{
              mt: 8,
            }}
          >
            <Typography component="h1" variant="h5">
              Edit Booking
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nric"
              label="NRIC Number"
              name="nric"
              autoComplete="nric"
              value={this.state.nric}
              sx={{mb: 2}}
              autoFocus
              helperText={this.state.errors["nric"]}
              error={Boolean(this.state.errors["nric"])}
            />
            <TextField
              required
              fullWidth
              id="name"
              label="Full Name"
              value={this.state.name}
              sx={{mb: 2}}
              name="name"
              autoComplete="name"
              helperText={this.state.errors["name"]}
              error={Boolean(this.state.errors["name"])}
            />
            <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
            <Select
              labelId="vaccineCenterLabel"
              label="Vaccine Center"
              required
              fullWidth
              id="vaccineCenter"
              value={this.state.vaccination_center_id}
              onChange={this.handleSelect}
              sx={{mb: 2}}
            >
              {
                this.state.vaccination_centers.map(function(v) {
                  return <MenuItem 
                    key={v._id.toString()}
                    value={v._id.toString()}>{v.name}
                    </MenuItem>;
                })
              }
            </Select>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Slot"
                value={this.state.date}
                onChange={this.handleDateChange}     
                minDate={minDate}
                minTime={new Date(0, 0, 0, 8)}
                maxTime={new Date(0, 0, 0, 17)} 
                minutesStep={15}
                disablePast       
                required
              />
            </LocalizationProvider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.onSubmit}
              disabled={this.state.submitDisabled}
            >
               {this.state.submitDisabled ? 'Updating...' : 'Update!'}
            </Button>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
