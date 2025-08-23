import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

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

  const [chartData, setChartData] = useState();
  const [topMaterialsData, setTopMaterialsData] = useState(null);

  const [receipts, setReceipts] = useState([]);
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [logs, setLogs] = useState([]);

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

        // uzmi zadnja 3 mjeseca
        const lastMonths = data.slice(-3);

        const labels = lastMonths.map(item => `${item.month} - ${item.year}`);
        const totals = lastMonths.map(item => Number(item.total));

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

  useEffect(() => {
    fetch("/api/aplication/getTopMaterials", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Pretvaramo podatke u format za Chart.js
        const chartData = {
          labels: data.map((m) => m.NameMaterial),
          datasets: [
            {
              label: 'Minimalna količina',
              data: data.map((m) => m.MinAmount),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Stvarna količina',
              data: data.map((m) => m.Amount),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
          ],
        };
        setTopMaterialsData(chartData);
      })
      .catch((err) => console.error('Greška kod dohvata top materijala:', err));
  }, []);

  useEffect(() => {
    fetch("/api/aplication/getAllReceipt", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // sortiramo po datumu opadajuće i uzmemo samo 5
        const last5 = data.sort((a, b) => new Date(b.DateReceipt) - new Date(a.DateReceipt)).slice(0, 5);
        setReceipts(last5);
      })
      .catch(err => console.error("Greška kod dohvaćanja računa:", err));
  }, []);

  useEffect(() => {
    fetch("/api/aplication/getAllClients", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  const getClientName = (id) => {
    const client = clients.find(c => c.ID_client === id);
    return client ? (client.TypeClient === 'Tvrtka' ? client.Name : client.ContactName) : 'Nepoznato';
  };

  const smallText = {
    fontSize: "0.5em",
    color: "gray" // opcionalno
  };

  useEffect(() => {
    fetch("/api/aplication/getActivityLogs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) =>
        console.error("Greška kod dohvata activity logova:", err)
      );
  }, []);

  return (
    <Container fluid className="p-4">
      {/* Gornji KPI kartice */}
      <Row className="mb-4">
        <Col md={3}>
          {/* Prihodi */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Ukupni prihodi <span style={smallText}>(bez PDV-a)</span></h5>
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
              <small className={expiringSoon > 0 ? "text-warning" : "text-success"}>
                {expiringSoon > 0
                  ? `${expiringSoon} ${expiringSoon === 1 ? "ponuda istječe" : "ponude istječu"} unutar 2 dana`
                  : "Nema ponuda sa istekom"}
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
            <Card.Body className="d-flex flex-column">
              <h5>Top 5 materijala po količini</h5>
              {topMaterialsData ? (
                <div style={{ height: '100%', minHeight: '250px' }}>
                  <Bar data={topMaterialsData} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <p className="text-center mt-5">Nema podataka za prikaz</p>
              )}
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
                  {receipts.length > 0 ? (
                    receipts.map((r, index) => (
                      <tr key={r.ID_receipt}>
                        <td>{index + 1}</td>
                        <td>{getClientName(r.ID_client)}</td>
                        <td>{Number(r.PriceNoTax).toFixed(2)} €</td>
                        <td>
                          <span className="badge bg-success">Plaćeno</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Nema podataka
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/showReceipt")}
              >
                Pogledaj sve
              </Button>
            </Card.Body>

          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5>Activity Log</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Korisnik</th>
                    <th>Akcija</th>
                    <th>Objekt</th>
                    <th>Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((c) => (
                      <tr key={c.ID_change}>
                        <td>{c.User?.Name || c.User?.Username || c.ID_user}</td>
                        <td>{c.ActionType}</td>
                        <td>{c.EntityName || c.ObjectType}</td>
                        <td>{new Date(c.ChangeDate).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Nema aktivnosti
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/showWarehouseChange")}
              >
                Pogledaj sve
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );
};


export default HomePage
