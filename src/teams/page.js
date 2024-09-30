"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "antd";
import "flexboxgrid2";
import classes from "./teams.module.css";
import { Pagination } from "antd";
import { YOUR_API_TOKEN } from "../custom-tools";
import "../globals.css"

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteringTeam, setfilteringTeam] = useState([]);
  const [defaultPageSize, setDefaultPageSize] = useState(16);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(500);

  const getData = async () => {
    const response = await fetch(
      `http://localhost:8080/v4/teams?limit=${total}`,
      {
        headers: {
          "X-Auth-Token": YOUR_API_TOKEN,
        },
      }
    );
    return await response.json();
  };

  const addTeams = () => {
    getData().then((data) => {
      setTeams(data.teams);
      setfilteringTeam(data.teams);
    });
  };

  useEffect(() => addTeams(), []);

  function searchTeams(text) {
    if (!text) {
      addTeams();
    } else {
      let filteredTeams = filteringTeam.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setTeams(filteredTeams);
      setCurrent(1);
    }
  }

  function changePage(number) {
    setCurrent(number);
  }

  return (
    <div className={classes.teams}>
      <div className="container">
        <Input
          className={classes.search}
          placeholder="Поиск"
          onChange={(e) => searchTeams(e.target.value)}
        />
        <div className={classes.teamBox}>
          <div className="row">
            {teams
              .slice((current - 1) * defaultPageSize, current * defaultPageSize)
              .map((item) => (
                <div key={item.id} className="col-xs-6 col-md-4 col-xl-3">
                  <Link
                    href={{ pathname: "/team-matches", query: { id: item.id } }}
                  >
                    <div className={classes.team}>
                      <div className={classes.boxTeamEmblem}>
                        <img className={classes.teamEmblem} src={item.crest} />
                      </div>
                      <h3 className={classes.teamName}>{item.name}</h3>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Pagination
        onChange={(current) => changePage(current)}
        defaultPageSize={defaultPageSize}
        total={total}
        align="center"
        style={{margin: "15px 0"}}
      />
    </div>
  );
}
