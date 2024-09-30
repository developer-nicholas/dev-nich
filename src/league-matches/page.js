"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Table, DatePicker } from "antd";
import moment from "moment";
import "flexboxgrid2";
import "../globals.css"
import { YOUR_API_TOKEN } from "../custom-tools";

export default function leagueMatches() {
  const [matches, setMatches] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { RangePicker } = DatePicker;


  const getLeagueMatches = async () => {
    const response = await fetch(
      `http://localhost:8080/v4/competitions/${id}/matches`,
      {
        headers: {
          "X-Auth-Token": YOUR_API_TOKEN,
        },
      }
    );
    return await response.json();
  };
  const addMatches = () => {
    getLeagueMatches().then((data) => setMatches(data.matches));
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
      
      sorter: (firstDate, secondDate) =>
        firstDate.utcDate.localeCompare(secondDate.utcDate),
      
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
    <div style={{ paddingTop: "80px" }}>
      <div className="container">
        <RangePicker
          placeholder={["С", "ПО"]}
          style={{ margin: "10px", width: "50%" }}
          onChange={(data) => filterByDate(data)}
        />
        <div className="row center-xs">
          <div className="col-xs-12">
            <Table
              pagination={{ position: ["bottomCenter"], defaultPageSize: 10 }}
              dataSource={matches}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
