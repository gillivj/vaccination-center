import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";

import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Component } from "react";
import axios from 'axios';
import moment from 'moment';

const Booking = props => (
  <TableRow>
    <TableCell>{props.booking.booking_id}</TableCell>
    <TableCell>{props.booking.patient.nric}</TableCell>
    <TableCell>{props.booking.patient.name}</TableCell>
    <TableCell>{props.booking.vaccination_center.name}</TableCell>
    <TableCell>{ moment(props.booking.booking_date).format('YYYY-MM-DD LT')}</TableCell>
    <TableCell>
    <Button component={Link} to={"/booking/"+props.booking._id}>
      <ModeEditIcon />
    </Button>
    <Button onClick={() => { props.deleteBooking(props.booking._id) }}>
      <DeleteIcon />
    </Button>
    </TableCell>
  </TableRow>
)

export class VaccineRegistrationListing extends Component {
  constructor(props) {
    super(props);

    this.deleteBooking = this.deleteBooking.bind(this)
    this.state = {
      bookings: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/booking/')
      .then(response => {
        this.setState({ bookings: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  deleteBooking(id) {
    axios.delete('http://localhost:5000/booking/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      bookings: this.state.bookings.filter(el => el._id !== id)
    })
  }
  bookingList() {
    return this.state.bookings.map(booking => {
      return <Booking booking={booking} deleteBooking={this.deleteBooking} key={booking._id}/>;
    })
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Active Bookings
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>NRIC</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Center Name</TableCell>
                    <TableCell align="left">Booking Date/Time</TableCell>
                    <TableCell align="left">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                { this.bookingList() }                  
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
