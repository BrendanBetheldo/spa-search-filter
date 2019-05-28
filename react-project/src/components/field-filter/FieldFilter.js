import React, { Component } from "react";

import "./FieldFilter.scss";

import axios from "axios";

class FieldFilter extends Component {
  constructor() {
    super();

    this.years = [];

    this.state = {
      missions: [],
      launchpads: [],
      filteredMissions: [],
      searchTerm: "",
      minYear: 0,
      maxYear: 0,
      loading: true
    };

    axios
      .get("http://localhost:8001/launches")
      .then(function(response) {
        return response;
      })
      .then(missions => {
        // store our years to use on the dropdowns
        // re-map the missions to return the year from the luanch date
        this.years = missions.data.map(mission => {
          //get day
          const missionDate = new Date(mission.launch_date_local);
          //gotta get the time in am or pm depending on what's given
          let formatAMPM = date => {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var strTime = hours + ":" + minutes + " " + ampm;
            return strTime;
          };
          const time = formatAMPM(missionDate);
          const day = missionDate.getDate();
          //get month
          let month_name = dt => {
            let mlist = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ];
            return mlist[dt.getMonth()];
          };
          const month = month_name(missionDate);
          //get year
          const year = missionDate.getFullYear();

          // while we're here, may as well update the mission object with the date values
          mission.time = time;
          mission.day = day;
          mission.month = month;
          mission.year = year;
          // return just the date values
          return year;
        });

        // now filter out any duplicate years
        this.years = this.years.filter(
          (item, pos) => this.years.indexOf(item) === pos
        );
        
        this.setState({ missions: missions, loading: false });
      });
    // making a 2nd request and return a promise
    axios
      .get("http://localhost:8001/launchpads")
      .then(function(response) {
        return response;
      })
      .then(launchpads => {
        //map to launchpad dropdown
        this.launchpads = launchpads.data.map(launchpads => ({
          name: launchpads.full_name,
          id: launchpads.id
        }));

        this.setState({ launchpads: this.launchpads });
      });
  }

  /*Entering a value will filter results where it’s value matches either flight numbers, any word
  in rocket name or any word in payload id. If no value is entered, this should match all
  launches. */
  onKeywordTextChange(e) {
    // set the search term
    this.setState({ searchTerm: e.target.value || "" });
  }

  onLaunchpadChange(e) {
    this.setState({ launchpad: e.target.value } || 0);
  }

  onMinYearChange(e) {
    this.setState({ minYear: parseInt(e.target.value) || 0 });
  }
  onMaxYearChange(e) {
    this.setState({ maxYear: parseInt(e.target.value) || 0 });
  }

  applyFilters() {
    //Min / Max check with alert error.
    if (this.state.minYear > this.state.maxYear) {
      return alert("Min year cannot be greater than max year");
    } else if (this.state.maxYear < this.state.minYear) {
      return alert("Max year cannot be less than min year");
    }
    const filteredMissions = this.state.missions.data.filter(mission => {
      // 2a
      const matchedKeywordRule = !this.state.searchTerm
        ? true
        : `${mission.flight_number}${
            mission.rocket.rocket_name
          }${mission.payloads.map(i => i.payload_id).join("")}`
            .toLowerCase()
            .includes(this.state.searchTerm.toLowerCase());
      // if anything == false in the rules, something didn't match
      // 2c - current item min year must be greater or equal to picked year, if minYear is 0, no year picked
      const matchMinYear =
        this.state.minYear > 0 ? mission.year >= this.state.minYear : true;

      // Max year check
      const maxYearCheck =
        this.state.maxYear > 0 ? mission.year <= this.state.maxYear : true;

      const minMaxCheck =
        this.state.minYear >= this.state.maxYear ? true : false;
      // launch pad check,
      const launchpadCheck =
        this.state.launchpads > 0
          ? mission.launchSite === this.state.launchPadId
          : true;
      console.log(`
          Filter Matches:
        - Keyword: ${matchedKeywordRule} */ FROM TERM "${this.state.searchTerm}"
        - Min Year: ${matchMinYear} FROM TERM "${this.state.minYear}"
        `);
      return matchedKeywordRule && matchMinYear && maxYearCheck && launchpadCheck;
    });

    this.setState({ filteredMissions: filteredMissions });
  }
  render() {
    return (
      <div className="field-filter-component container-fluid">
        {/* <div className="row dbug">
            <div className="col-md-12 text-center">
              <h1>Search Results</h1>
              <div>
                <p>Loading: {this.state.loading ? "true" : "false"}</p>
                Total Missions: {this.state.missions.length}
              </div>
            </div>            
          </div> */}
        <div className="row filter-container justify-content-center align-items-center">
          <div className="col-md-3 text-left">
            <p>Keyword: </p>
            <div className="input-group input-group-lg">
              <input
                placeholder="eg Falcon"
                type="text"
                className="form-control"
                onChange={this.onKeywordTextChange.bind(this)}
              />
            </div>
          </div>
          <div className="col-md-3 text-left">
            <p> Launch pads: </p>
            <select
              className="custom-select custom-select-lg"
              name="launchPads"
            >
              <option defaultValue>Any</option>
              {this.state.launchpads.map((launchpad, index) => {
                return (
                  <option key={index} value={launchpad.id}>
                    {launchpad.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-2 text-center">
            <p>Min Year: </p>
            <select
              className="custom-select custom-select-lg"
              name="minYear"
              onChange={this.onMinYearChange.bind(this)}
            >
              <option defaultValue>Any</option>
              {this.years.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-2 text-left">
            <p>Max Year: </p>
            <select
              className="custom-select custom-select-lg"
              name="maxYear"
              onChange={this.onMaxYearChange.bind(this)}
            >
              <option defaultValue>Any</option>
              {this.years.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-auto text-center">
            <button
              className="btn btn-primary btn-lg submit"
              onClick={this.applyFilters.bind(this)}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="row text-center results-container">
          <div className="col-12">
            {/* <p>Search Term "{this.state.searchTerm}"</p>
                  <p>Launch Pad "TODO"</p>
                  <p>Min Year "{this.state.minYear}"</p>
                  <p>Max Year "{this.state.maxYear}"</p> */}

            {this.state.filteredMissions.length > 0 && (
              <p className="result-length">Showing {this.state.filteredMissions.length} Missions</p>
            )}
            {this.state.filteredMissions.length <= 0 && (
              <p className="result-length">No Missions Found</p>
            )}
          </div>
          <div className="col-12">
            {this.state.filteredMissions.map((mission, index) => {
              return (
                <div className="row result-card justify-content-center" key={index}>
                  <div className="col-auto">
                    <div className="patch">
                      <img src={mission.links.mission_patch} alt="" />
                    </div>
                  </div>
                  <div className="col-8 text-left">
                    <h5 className="card-title">
                      {mission.rocket.rocket_name} -{" "}
                      {mission.payloads.map(i => i.payload_id).join(", ")}
                    </h5>                    
                    <p>
                      Launched <strong>{mission.day}th</strong>{" "}
                      <strong>{mission.month}</strong>{" "}
                      <strong>{mission.year}</strong> at{" "}
                      <strong>{mission.time}</strong> from{" "}
                      {mission.launch_site.site_name}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="flight-number">#{mission.flight_number}</p>
                    <p>Flight Number</p>
                  </div>
                </div>                
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default FieldFilter;
