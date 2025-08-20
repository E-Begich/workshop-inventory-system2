import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomePage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  const [totalReceipts, setTotalReceipts] = useState(0);
  const [lastWeekReceipts, setLastWeekReceipts] = useState(0);

  const [activeOffers, setActiveOffers] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);

  const [totalMaterials, setTotalMaterials] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const [chartData, setChartData] = useState(null);


  useEffect(() => {
    fetch("/api/aplication/getAllReceipt", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        const parseAmount = str => parseFloat(str.replace(',', '.'));

        const thisMonthReceipts = data.filter(r => {
          const date = new Date(r.DateCreate);
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });

        const lastMonthReceipts = data.filter(r => {
          const date = new Date(r.DateCreate);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });

        const totalThisMonth = thisMonthReceipts.reduce((acc, r) => acc + parseAmount(r.PriceNoTax), 0);
        const totalLastMonth = lastMonthReceipts.reduce((acc, r) => acc + parseAmount(r.PriceNoTax), 0);

        setTotalRevenue(totalThisMonth);
        setTotalReceipts(thisMonthReceipts.length);

        const change = totalLastMonth === 0 ? 0 : ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        setRevenueChange(change);
      });
  }, []);

  useEffect(() => {
    fetch("/api/aplication/getAllReceipt", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const today = new Date();

        // Funkcija koja vraća ponedjeljak trenutnog tjedna
        const getMonday = (d) => {
          const day = d.getDay();
          const diff = (day === 0 ? -6 : 1) - day; // HR: ponedjeljak = 1, nedjelja = 0
          const monday = new Date(d);
          monday.setDate(d.getDate() + diff);
          monday.setHours(0, 0, 0, 0);
          return monday;
        };

        const mondayThisWeek = getMonday(today);
        const mondayLastWeek = new Date(mondayThisWeek);
        mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);
        const sundayLastWeek = new Date(mondayThisWeek);
        sundayLastWeek.setDate(mondayThisWeek.getDate() - 1);
        sundayLastWeek.setHours(23, 59, 59, 999);

        let currentWeekCount = 0;
        let lastWeekCount = 0;

        data.forEach(receipt => {
          const date = new Date(receipt.DateCreate);
          if (date >= mondayThisWeek) {
            currentWeekCount++;
          } else if (date >= mondayLastWeek && date <= sundayLastWeek) {
            lastWeekCount++;
          }
        });

        setTotalReceipts(currentWeekCount);
        setLastWeekReceipts(lastWeekCount); // broj računa prošlog tjedna
      });
  }, []);


  useEffect(() => {
    fetch("/api/aplication/getAllOffer", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // data je niz ponuda
        const offers = Array.isArray(data) ? data : data.offers || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let active = 0;
        let expiring = 0;

        offers.forEach(offer => {
          const hasReceipt = offer.HasReceipt; // true/false
          const endDate = new Date(offer.DateEnd);
          endDate.setHours(0, 0, 0, 0);

          if (!hasReceipt && endDate >= today) {
            active++;
            const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            if (diffDays <= 2) {
              expiring++;
            }
          }
        });

        setActiveOffers(active);
        setExpiringSoon(expiring);
      })
      .catch(err => {
        console.error("Greška prilikom dohvata ponuda:", err);
      });
  }, []);

  useEffect(() => {
    fetch("/api/aplication/getAllMaterial", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data); // provjeri strukturu

        const materials = Array.isArray(data) ? data : data.materials || [];

        // Broj artikala = broj redova u tablici
        setTotalMaterials(materials.length);

        // Broj artikala pri isteku (Amount <= MinAmount)
        const lowStockCount = materials.filter(m =>
          parseFloat(m.Amount) <= parseFloat(m.MinAmount)
        ).length;

        setLowStock(lowStockCount);
      })
      .catch(err => console.error("Greška kod dohvata materijala:", err));
  }, []);

  useEffect(() => {
    fetch("/api/aplication/getMonthlySales", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Podaci za graf:", data);
        if (!Array.isArray(data)) return;

        const labels = data.map(item => `${item.month}.${item.year}`);
        const totals = data.map(item => Number(item.total));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Prodaja (€)",
              data: totals,
              backgroundColor: "rgba(75,192,192,0.6)"
            }
          ]
        });
      })
      .catch(err => console.error("Greška pri dohvaćanju podataka:", err));
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Mjesečna prodaja",
      },
    },
  };



  return (
    <Container fluid className="p-4">
      {/* Gornji KPI kartice */}
      <Row className="mb-4">
        <Col md={3}>
          {/* Prihodi */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Ukupni prihodi</h5>
              <h3>{totalRevenue.toFixed(2)} €</h3>
              <small className={revenueChange >= 0 ? "text-success" : "text-danger"}>
                {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}% ovaj mjesec
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {/* Računi */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Izdani računi</h5>
              <h3>{totalReceipts}</h3>
              <small className="text-primary">
                {lastWeekReceipts} izdano računa prošli tjedan
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Aktivne ponude</h5>
              <h3>{activeOffers}</h3>
              <small className="text-warning">
                {expiringSoon} {expiringSoon === 1 ? "ponuda istječe" : "ponude istječu"} unutar 2 dana
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Stanje skladišta</h5>
              <h3>{totalMaterials} artikala</h3>
              <small className={lowStock > 0 ? "text-danger" : "text-success"}>
                {lowStock > 0
                  ? `${lowStock} pri isteku zaliha`
                  : "Sve zalihe stabilne"}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graf / placeholder */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Prodaja po mjesecima</h5>
              <div style={{ height: "250px", backgroundColor: "#f8f9fa" }}>
                {chartData && <Bar data={chartData} options={chartOptions} />}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Potrošnja materijala</h5>
              <div style={{ height: "250px", backgroundColor: "#f8f9fa" }}>
                {/* Ovdje može pie chart */}
                <p className="text-center mt-5">[Pie chart - Chart.js placeholder]</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tablice */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5>Zadnjih 5 računa</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kupac</th>
                    <th>Iznos</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>123</td>
                    <td>Ivan Horvat</td>
                    <td>450 €</td>
                    <td><span className="badge bg-success">Plaćeno</span></td>
                  </tr>
                  <tr>
                    <td>124</td>
                    <td>Marko Marković</td>
                    <td>320 €</td>
                    <td><span className="badge bg-warning text-dark">Na čekanju</span></td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="outline-primary" size="sm">Pogledaj sve</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5>Activity log</h5>
              <ul className="list-group">
                <li className="list-group-item">📌 Dodan račun #123 - Ivan Horvat</li>
                <li className="list-group-item">📦 Skinuto 5m kože sa skladišta</li>
                <li className="list-group-item">📝 Nova ponuda za Petra Petrovića</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );
};


export default HomePage
