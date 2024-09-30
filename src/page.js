"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "antd";
import "flexboxgrid2";
import classes from "./page.module.css";
import "./globals.css";
import { YOUR_API_TOKEN } from "./custom-tools";

export default function Leagues() {

  const [competitions, setCompetitions] = useState([]);
  const [filteringCompetitions, setfilteringCompetitions] = useState([]);

  const getData = async () => {
    const response = await fetch("http://localhost:8080/v4/competitions/", {
      headers: {
        "X-Auth-Token": YOUR_API_TOKEN,
      },
    });
    
    
    
  };
  console.log(getData());
  

  const addCompetitions = () => {
    getData().then((data) => {
      setCompetitions(data.competitions);
      setfilteringCompetitions(data.competitions);
      console.log(data);
      
    });
  };

  useEffect(() => {
    addCompetitions();
  }, []);

  function leagueSearch(text) {
    if (!text) {
      addCompetitions();
    } else {
      const filteredLeagues = filteringCompetitions.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.area.name.toLowerCase().includes(text.toLowerCase())
      );
      setCompetitions(filteredLeagues);
    }
  }

  return (
    <div className={classes.leagues}>
      <div className="container">
        <Input
          className={classes.search}
          placeholder="Поиск"
          onChange={(e) => leagueSearch(e.target.value)}
        />
        <div className={classes.leagueBox}>
          <div className="row">
            {competitions.map((item) => (
              <div key={item.id} className="col-xs-6 col-md-4 col-xl-3">
                <Link
                  href={{ pathname: "/league-matches", query: { id: item.id } }}
                >
                  <div className={classes.league}>
                    <div className={classes.boxLeagueEmblem}>
                      <img className={classes.leagueEmblem} src={item.emblem} />
                    </div>
                    <h3 className={classes.leagueName}>{item.name}</h3>
                    <p className={classes.leagueCountry}>{item.area.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
