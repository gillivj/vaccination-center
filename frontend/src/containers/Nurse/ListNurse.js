import {
  Table,
  Box,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";

import React, { Component } from "react";
import axios from 'axios';

const Nurse = props => (
  <TableRow>
    <TableCell>{props.nurse.name}</TableCell>
    <TableCell>{props.nurse.email}</TableCell>
    <TableCell>{props.nurse.working_days.join(",")}</TableCell>
    <TableCell>{props.booking.vaccination_center.name}</TableCell>
  </TableRow>
)

export class NurseListing extends Component {
  constructor(props) {
    super(props);

    this.deleteNurse = this.deleteNurse.bind(this)
    this.state = {
      nurses: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/nurse/')
      .then(response => {
        this.setState({ nurses: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  deleteNurse(id) {
    axios.delete('http://localhost:5000/nurse/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      nurses: this.state.nurses.filter(el => el._id !== id)
    })
  }
  nurseList() {
    return this.state.nurses.map(nurse => {
      return <Nurse booking={nurse} deleteBooking={this.deleteNurse} key={nurse._id}/>;
    })
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Nurses
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Working Days</TableCell>
                    <TableCell align="left">Center Name</TableCell>                   
                  </TableRow>
                </TableHead>
                <TableBody>
                { this.nurseList() }                  
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
