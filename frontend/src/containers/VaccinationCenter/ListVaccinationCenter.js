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

const VaccinationCenter = props => (
  <TableRow>
    <TableCell>{props.vaccination_center.name}</TableCell>
    <TableCell>{props.vaccination_center.address}</TableCell>
    <TableCell>{props.vaccination_center.vaccine_type}</TableCell>
  </TableRow>
)

export class VaccinationCenterListing extends Component {
  constructor(props) {
    super(props);

    this.deleteVaccinationCenter = this.deleteVaccinationCenter.bind(this)
    this.state = {
      vaccination_centers: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/vaccination_center/')
      .then(response => {
        this.setState({ vaccination_centers: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  deleteVaccinationCenter(id) {
    axios.delete('http://localhost:5000/vaccination_center/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      vaccination_centers: this.state.vaccination_centers.filter(el => el._id !== id)
    })
  }
  vaccinationCenterList() {
    return this.state.vaccination_centers.map(vaccination_center => {
      return <VaccinationCenter vaccination_center={vaccination_center} deleteVaccinationCenter={this.deleteVaccinationCenter} key={vaccination_center._id}/>;
    })
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Vaccination Centers
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Vaccine Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                { this.vaccinationCenterList() }                  
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
