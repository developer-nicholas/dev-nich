"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";
import "flexboxgrid2";
import classes from "./page.module.css";
import { YOUR_API_TOKEN } from "../custom-tools";
import "./page.css";
import "../globals.css"

export default function teamMatches() {
  const [matches, setMatches] = useState([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { RangePicker } = DatePicker;

  const getTeamMatches = async () => {
    const response = await fetch(
      `http://localhost:8080/v4/teams/${id}/matches`,
      {
        headers: {
          "X-Auth-Token": YOUR_API_TOKEN,
        },
      }
    );
    return await response.json();
  };
  const addMatches = () => {
    getTeamMatches().then((data) => setMatches(data.matches));
  };
  useEffect(() => addMatches(), []);

  function filterByDate(date) {
    if (!date) {
      addMatches();
    } else {
      const dateFrom = Date.parse(date[0]);
      const dateTo = Date.parse(date[1]);
      const filteredMatches = matches.filter(
        (item) =>
          Date.parse(item.utcDate) >= dateFrom &&
          Date.parse(item.utcDate) <= dateTo
      );
      setMatches(filteredMatches);
    }
  }

  function translateStatus(status) {
    switch (status) {
      case "SCHEDULED":
        status = "Запланирован";
        return status;
      case "TIMED":
        status = "Запланирован";
        return status;

      case "LIVE":
        status = "В прямом эфире";
        return status;

      case "IN_PLAY":
        status = "В игре";
        return status;

      case "PAUSED":
        status = "Пауза";
        return status;

      case "FINISHED":
        status = "Завершен";
        return status;

      case "POSTPONED":
        status = "Отложен";
        return status;

      case "SUSPENDED":
        status = "Приостановлен";
        return status;

      case "CANCELED":
        status = "Отменен";
        return status;
    }
  }

  const columns = [
    {
      title: "Дата",
      dataIndex: "utcDate",
      key: "id",
      render: (utcDate) => (
        <div style={{ textAlign: "center" }}>
          {moment(utcDate).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Время",
      dataIndex: "utcDate",
      key: "id",
      render: (utcDate) => (
        <div style={{ textAlign: "center" }}>
          {moment(utcDate).utcOffset(240).format("HH:mm")}
        </div>
      ),
    },

    {
      title: "Статус",
      dataIndex: "status",
      key: "id",
      render: (status) => (
        <div style={{ textAlign: "center" }}>{translateStatus(status)}</div>
      ),
    },
    {
      title: "Хозяева",
      dataIndex: "homeTeam",
      key: ["homeTeam", "id"],
      render: (homeTeam) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img
              style={{ width: "70px", height: "70px" }}
              src={homeTeam.crest}
            />
          </div>
          <h4 style={{ textAlign: "center" }}>{homeTeam.name}</h4>
        </div>
      ),
    },
    {
      title: "Гости",
      dataIndex: "awayTeam",
      key: ["awayTeam", "id"],
      render: (awayTeam) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img
              style={{ width: "70px", height: "70px" }}
              src={awayTeam.crest}
            />
          </div>
          <h4 style={{ textAlign: "center" }}>{awayTeam.name}</h4>
        </div>
      ),
    },
    {
      title: "Результат",
      dataIndex: ["score", "fullTime"],
      key: ["score", "winner"],
      render: (fullTime) => (
        <div style={{ textAlign: "center" }}>
          {fullTime.home}:{fullTime.away}
        </div>
      ),
    },
  ];
  return (
    <div className={classes.matchCalendar}>
      <div className="container">
        <RangePicker
          placeholder={["С", "ПО"]}
          className={classes.dateRange}
          onChange={(data) => filterByDate(data)}
        />
        <div className="row center-xs">
          <div className="col-xs-12">
            <Table
              dataSource={matches}
              columns={columns}
              pagination={{
                position: ["bottomCenter"],
                defaultPageSize: 10,
                hideOnSinglePage: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
