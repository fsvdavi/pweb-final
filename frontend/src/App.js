import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Container, Navbar, Nav, Card, Button, Form, Modal, Spinner, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const BACKEND_URL = 'https://space-explorer-backend-ksro.onrender.com'; //http://localhost:5000

function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="App">
      <Particles id="tsparticles" init={particlesInit} options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          color: { value: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"] },
          move: { enable: true, speed: 1, random: true },
          number: { value: 80 },
          opacity: { value: { min: 0.1, max: 0.7 }, animation: { enable: true } },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 4 } },
        },
      }} />

      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Space Explorer 🌌</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/solar-system">Sistema Solar</Nav.Link>
              <Nav.Link as={Link} to="/moons">Luas</Nav.Link>
              <Nav.Link as={Link} to="/other-systems">Outros Sistemas</Nav.Link>
              <Nav.Link as={Link} to="/favorites">Favoritos</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contato</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/moons" element={<Moons />} />
          <Route path="/other-systems" element={<OtherSystems />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </div>
  );
}

function DetailModal({ show, handleClose, item }) {
  if (!item) return null;

  const lines = item.detailed.split('. ').map(sentence => sentence.trim() + (sentence.endsWith('.') ? '' : '.'));

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{item.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white text-center">
        <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '15px', marginBottom: '20px' }} />
        <div style={{ textAlign: 'left', fontSize: '1.1rem', lineHeight: '1.8' }}>
          {lines.map((line, index) => (
            <p key={index} style={{ marginBottom: '10px' }}>{line}</p>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

function AstroCard({ item, onClick, isFavorite, onFavoriteToggle }) {
  const [loading, setLoading] = useState(true);

  return (
    <Card className="h-100 text-white bg-dark border-0" style={{ cursor: 'pointer', position: 'relative' }}>
      <div style={{ height: '200px', position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        {loading && <Spinner animation="border" variant="light" style={{ position: 'absolute' }} />}
      </div>

      {/* Estrelinha de favorito */}

      <div
        style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', cursor: 'pointer', zIndex: 10 }}
        onClick={(e) => {
          e.stopPropagation(); 
          onFavoriteToggle(item);
        }}
      >
        {isFavorite ? '⭐' : '☆'}
      </div>

      <Card.Body onClick={onClick}>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.short}</Card.Text>
      </Card.Body>
    </Card>
  );
}


const allItems = [
  { name: "Sol", image: "https://spaceplace.nasa.gov/gallery-sun/en/solar-flare.en.jpg", short: "Estrela central do sistema solar.", detailed: "Tipo espectral: G2V (anã amarela). Massa: 1.989 × 10^30 kg. Luminosidade: 3.828 × 10^26 W. Diâmetro: 1.392.000 km. Gravidade superficial: 274 m/s² (2796% da Terra). Principal astro do nosso sistema e oresponsável por organizar todas as orbitas e permitir a vida na Teraa" },
  { name: "Mercúrio", image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/7906/live/936e7150-e4ce-11f0-8a85-09a10e143343.jpg.webp", short: "Planeta mais próximo do Sol.", detailed: "Descoberto: Antiguidade. Diâmetro: 4.879 km. Distância média do Sol: 57.9 milhões km. Período orbital: 88 dias. Luas: 0. Gravidade superficial: 3.7 m/s² (38% da Terra). Segundo planeta mais denso após a Terra, com gravidade similar à de Marte mesmo sendo menor." },
  { name: "Vênus", image: "https://www.nasa.gov/wp-content/uploads/2021/06/imagesvenus20191211venus20191211-16.jpeg?w=1600", short: "Planeta mais quente.", detailed: "Descoberto: Antiguidade. Diâmetro: 12.104 km. Distância média: 108 milhões km. Período orbital: 225 dias. Luas: 0. Gravidade superficial: 8.87 m/s² (90% da Terra). Albedo alto, reflete quase toda luz sendo o planeta mais brilhoso podendo ser confundido com uma estrela. Atmosfera 93 vezes mais densa que a da Terra. Gira no sentido horário (retrógrado), único junto com Urano. Um dia dura mais que um ano." },
  { name: "Terra", image: "https://assets.science.nasa.gov/dynamicimage/assets/science/esd/climate/2023/12/ImageWall5_1920x1200-80.jpg?w=1920&h=1200&fit=clip&crop=faces%2Cfocalpoint", short: "Nosso planeta azul.", detailed: "Diâmetro: 12.742 km. Distância média do Sol: 150 milhões km. Período orbital: 365.25 dias. Luas: 1 (Lua). Gravidade superficial: 9.8 m/s² (100% da Terra). Único com vida conhecida." },
  { name: "Marte", image: "https://www.americaspace.com/wp-content/uploads/2014/02/mars_globe.jpg", short: "O planeta Vermelho", detailed: "Descoberto: Antiguidade. Diâmetro: 6.779 km. Distância média: 228 milhões km. Período orbital: 687 dias. Luas: 2 (Phobos e Deimos). Gravidade superficial: 3.71 m/s² (38% da Terra). Phobos pode colidir com Marte no futuro, formando anéis." },
  { name: "Ceres", image: "https://science.nasa.gov/wp-content/uploads/2018/10/pia21906-ceres-full-globe-1280x900-1.jpg", short: "Maior objeto do cinturão de asteroides.", detailed: "Descoberto: 1801. Diâmetro: 946 km. Representa 1/3 da massa do cinturão de asteroides. Gravidade superficial: 0.27 m/s² (3% da Terra). Classificado como planeta anão." },
  { name: "Cinturão de Asteroides", image: "https://www.nasa.gov/wp-content/uploads/2023/07/asteroid-belt.jpg", short: "Região entre Marte e Júpiter.", detailed: "Conhecido especificamente como cinturão de Orion é uma região que contém milhões de asteroides. Largura aproximada: 140 milhões km. Maior objeto: Ceres (planeta anão). Desperta interessee econômico por possuir asteroides rico em metais que podem valer trilhões de dolares. " },
  { name: "Júpiter", image: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia02/pia02873/PIA02873.jpg?w=1920&h=1080&fit=clip&crop=faces%2Cfocalpoint", short: "O gigante gasoso.", detailed: "Descoberto: Antiguidade. Diâmetro: 139.820 km. Distância média: 778 milhões km. Período orbital: 12 anos. Luas conhecidas: 95+. Gravidade superficial: 24.79 m/s² (253% da Terra). A Mancha Vermelha é uma tempestade gigante maior que a Terra." },
  { name: "Saturno", image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", short: "Planeta dos anéis.", detailed: "Descoberto: Antiguidade. Diâmetro: 116.460 km. Distância média: 1.4 bilhões km. Período orbital: 29 anos. Luas conhecidas: 146+. Gravidade superficial: 10.44 m/s² (106% da Terra). Anéis nutridos por geysers de Encélado." },
  { name: "Urano", image: "https://d2pn8kiwq2w21t.cloudfront.net/original_images/imagesvoyager20160121PIA18182-16.jpg", short: "Planeta inclinado.", detailed: "Descoberto: 1781 por William Herschel. Diâmetro: 50.724 km. Distância média: 2.9 bilhões km. Período orbital: 84 anos. Luas: 27. Gravidade superficial: 8.69 m/s² (89% da Terra). Gira no sentido horário (retrógrado), único junto com Vênus." },
  { name: "Netuno", image: "https://science.nasa.gov/wp-content/uploads/2024/03/pia01492-neptune-full-disk-16x9-1.jpg?w=1920", short: "Gigante de gelo azul.", detailed: "Descoberto: 1846. Diâmetro: 49.244 km. Distância média: 4.5 bilhões km. Período orbital: 165 anos. Luas: 16. Gravidade superficial: 11.15 m/s² (114% da Terra)." },
  { name: "Europa", image: "https://thumbs.dreamstime.com/b/o-europa-lua-do-j%C3%BApiter-planeta-em-cores-naturais-isolada-na-ilustra%C3%A7%C3%A3o-preta-fundo-d-elementos-desta-imagem-%C3%A9-f-112967791.jpg", short: "Lua de Júpiter com oceano subterrâneo.", detailed: "Descoberto: 1610 por Galileu. Diâmetro: 3.122 km. 6ª maior lua do sistema solar. Distância média de Júpiter: 670.900 km. Período de revolução: 3.55 dias. Gravidade superficial: 1.315 m/s² (13% da Terra). Possível oceano líquido abaixo do gelo. Atmosfera tênue de oxigênio não biológico." },
  { name: "Io", image: "https://spacetoday.com.br/wp-content/uploads/2024/04/io_ativo_01.jpg", short: "Lua mais vulcânica do sistema.", detailed: "Descoberto: 1610. Diâmetro: 3.643 km. 4ª maior lua. Distância média de Júpiter: 421.700 km. Período de revolução: 1.77 dias. Gravidade superficial: 1.796 m/s² (18% da Terra). Mais de 400 vulcões ativos. Coloração devida ao enxofre das erupções." },
  { name: "Ganímedes", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/330px-Ganymede_-_Perijove_34_Composite.png", short: "Maior lua do sistema solar.", detailed: "Descoberto: 1610. Diâmetro: 5.268 km. 1ª maior lua. Distância média de Júpiter: 1.070.400 km. Período de revolução: 7.15 dias. Gravidade superficial: 1.428 m/s² (15% da Terra). Única lua com campo magnético notável. Atmosfera tênue de oxigênio não biológico." },
  { name: "Calisto", image: "https://eos.org/wp-content/uploads/2025/02/callisto.jpg", short: "Lua altamente craterizada.", detailed: "Descoberto: 1610. Diâmetro: 4.821 km. 3ª maior lua. Distância média de Júpiter: 1.882.700 km. Período de revolução: 16.69 dias. Gravidade superficial: 1.235 m/s² (13% da Terra). Superfície antiga com muitas crateras. Atmosfera tênue de oxigênio não biológico." },
  { name: "Titã", image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Titan_in_true_color.jpg", short: "Lua com atmosfera densa.", detailed: "Descoberto: 1655. Diâmetro: 5.150 km. 2ª maior lua. Distância média de Saturno: 1.221.870 km. Período de revolução: 15.95 dias. Gravidade superficial: 1.35 m/s² (14% da Terra). Atmosfera com mais pressão que a da Terra. Única lua com atmosfera espessa e lagos de metano." },
  { name: "Lua", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/330px-FullMoon2010.jpg", short: "Nosso satélite natural.", detailed: "Formada há ~4.5 bilhões de anos por colisão com protoplaneta Theia. Diâmetro: 3.474 km. Distância média da Terra: 384.400 km. Período de revolução: 27.3 dias. Gravidade superficial: 1.62 m/s² (17% da Terra). 5ª maior lua do sistema solar. Único corpo celeste além da Terra que humanos pisaram." },
  { name: "Encélado", image: "https://d2pn8kiwq2w21t.cloudfront.net/original_images/enceladus_IQ2NpXI.jpg", short: "Lua de Saturno com geysers.", detailed: "Descoberto: 1789. Diâmetro: 504 km. Possui oceano subterrâneo com mais água que todos os oceanos da Terra. Geysers de água gelada nutrem os anéis de Saturno. Distância média de Saturno: 238.000 km. Período de revolução: 1.37 dias. Gravidade superficial: 0.113 m/s² (1% da Terra)." },
  { name: "Cinturão de Kuiper", image: "https://images-assets.nasa.gov/image/ACD17-0168-009/ACD17-0168-009~large.jpg?w=1920&h=1440&fit=clip&crop=faces%2Cfocalpoint", short: "Região além de Netuno.", detailed: "É um cinturão de asteróides muito mais distante e maior que o de Orion, contendo no total ate 10%  da massa da Terra dividida entre diversos objetos gelados e planetas anões como Plutão. Extensão: 30 a 55 UA do Sol." },
  { name: "Plutão", image: "https://cdn.mos.cms.futurecdn.net/DA6c9nKCb9u384QntxgtNP.jpeg", short: "Planeta anão no Cinturão de Kuiper.", detailed: "Descoberto: 1930. Diâmetro: 2.377 km. Distância média do Sol: 5.9 bilhões km. Período orbital: 248 anos. Luas: 5 (Caronte principal). Classificado como planeta anão em 2006." },
  { name: "Nuvem de Oort", image: "https://tm.ibxk.com.br/2024/10/29/29145625301191.jpg", short: "Limite externo do sistema solar.", detailed: "Trata-se do espaço (esférico) mais distante possível que a nossa estrela ainda tenha algum tipo de influência e portanto fazendo parte do Sistema Solar. Possui uma extensão absurda podendo passar de até 1 ano luz de diametro. Ë a fonte de cometas de longo período que ocasionalmente entra no sistema solar interno." },
  { name: "Alpha Centauri A (Rigil Kentaurus)", image: "https://science.nasa.gov/wp-content/uploads/2023/04/hubble_friday_09022016-jpg.webp", short: "Estrela principal do sistema triplo.", detailed: "Nome próprio: Rigil Kentaurus. Tipo espectral: G2V (anã amarela). Massa: 1.1 massas solares. Luminosidade: 1.5 vezes o Sol. Diâmetro: 1.2 vezes o Sol. Constelação: Centauro. Trata-se de um estrela bem parecida com o nosso Sol porém um pouco mais velha, maior e mais luminosa sendo a maior do sistema estelar triplo Alpha Centauri." },
  { name: "Alpha Centauri B (Toliman)", image: "https://www.star-facts.com/wp-content/uploads/2020/08/Alpha-Centauri-A-and-B.jpg", short: "Estrela secundária do sistema.", detailed: "Nome próprio: Toliman. Tipo espectral: K1V (anã laranja). Massa: 0.9 massas solares. Luminosidade: 0.5 vezes o Sol. Diâmetro: 0.9 vezes o Sol. Constelação: Centauro. Estrela de cor alaranjada, menor e com menos brilho que o Sol, porém que vive por dezenas de bilhões de anos a mais. Faz parte do sistema estelar triplo Alpha Centauri na dupla principal interna junto à Rigil Kentaurus." },
  { name: "Proxima Centauri", image: "https://cdn.sci.news/images/enlarge8/image_9579e-Proxima-Centauri-Flare.jpg", short: "Anã vermelha mais próxima.", detailed: "Nome próprio: Proxima Centauri. Tipo espectral: M5.5V (anã vermelha). Massa: 0.12 massas solares. Luminosidade: 0.0017 vezes o Sol. Diâmetro: 0.14 vezes o Sol. Constelação: Centauro. É a menor estrela do sistema de Alpha Centauri.Orbitando ao redor do par principal.Leva o nome devido a ser a estrela mais próxima ao sisstema solar excluindo o próprio Sol. Devido a ser muito menor e mais fraca é a única das três que possui exoplanetas confirmados em sua órbita.Sendo três planetas no total com um em específico (Proxima Centauri b) chamando atenção por ser um planeta rochoso, de tamanho similar ao da Terra na zona habitável possuindo alguma chance de vida." },
  { name: "Sirius A", image: "https://cdn.esahubble.org/archives/images/wallpaper5/heic0516a.jpg", short: "Estrela mais brilhante no céu noturno.", detailed: "Tipo espectral: A1V (estrela branca). Massa: 2 massas solares. Luminosidade: 25 vezes o Sol. Diâmetro: 1.7 vezes o Sol. Constelação: Cão Maior (Canis Major). É uma estrela de bliho branco azulado conhecida por ser a estrela mais brilhante do céu noturno visto da Terra" },
  { name: "Sirius B", image: "https://cdn.esahubble.org/archives/images/large/heic0516b.jpg", short: "Anã branca companheira de Sirius A.", detailed: "Tipo espectral: DA2 (anã branca). Massa: ~1 massa solar. Luminosidade: muito baixa. Diâmetro: tamanho da Terra. Constelação: Cão Maior (Canis Major). Trata-se de uma estrela que são os restos de uma antiga estrela que explodiu em uma supernova." },
];

function Home() {
  const [apod, setApod] = useState(null);
  const [loadingApod, setLoadingApod] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Carrega favoritos do banco de daddos 
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/favorites`) 
      .then(res => setFavorites(res.data.map(f => f.name)))
      .catch(err => console.error("Erro ao carregar favoritos:", err));
  }, []);

  // API da NASA
  useEffect(() => {
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(res => {
        setApod(res.data);
        setLoadingApod(false);
      })
      .catch(() => {
        setApod({
          title: "Nebulosa do Coração",
          url: "https://apod.nasa.gov/apod/image/2412/Heart_HorneEvans_4096.jpg",
          explanation: "Uma das nebulosas mais belas do céu, capturada em alta resolução (fallback - API NASA temporariamente indisponível)."
        });
        setLoadingApod(false);
      });
  }, []);

  // MArcar como favorito
  const toggleFavorite = (item) => {
    const isFav = favorites.includes(item.name);
    if (isFav) {
      setFavorites(favorites.filter(f => f !== item.name));
    } else {
      axios.post(`${BACKEND_URL}/api/favorites`, { name: item.name, description: item.short })
        .then(() => setFavorites([...favorites, item.name]))
        .catch(err => console.error("Erro ao salvar favorito:", err));
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      <h1 className="text-center my-5" style={{ fontSize: '4rem', fontWeight: 'bold', textShadow: '0 0 20px #00ffff', letterSpacing: '2px' }}>Explore o Universo</h1>

      <div className="mb-5">
        <h2 className="text-center mb-4" style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#00ffff' }}>Imagem do Dia da NASA</h2>
        {loadingApod ? (
          <div className="text-center"><Spinner animation="border" variant="light" size="lg" /></div>
        ) : (
          apod && (
            <Row className="align-items-center bg-dark p-4 rounded shadow">
              <Col md={7} className="text-center">
                <img src={apod.url} alt={apod.title} style={{ maxWidth: '700px', width: '100%', borderRadius: '20px', boxShadow: '0 0 30px rgba(0,255,255,0.7)' }} />
              </Col>
              <Col md={5} className="text-white">
                <h3 style={{ fontSize: '2rem' }}>{apod.title}</h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{apod.explanation}</p>
              </Col>
            </Row>
          )
        )}
      </div>

      <div className="row">
        {allItems.map(item => (
          <div className="col-md-4 mb-4" key={item.name}>
            <AstroCard
              item={item}
              onClick={() => handleCardClick(item)}
              isFavorite={favorites.includes(item.name)}
              onFavoriteToggle={toggleFavorite}
            />
          </div>
        ))}
      </div>

      <DetailModal show={showModal} handleClose={() => setShowModal(false)} item={selectedItem} />
    </>
  );
}


function CardGrid({ items, title }) {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get('https://space-explorer-backend-ksro.onrender.com/api/favorites')
      .then(res => setFavorites(res.data.map(f => f.name)))
      .catch(err => console.error(err));
  }, []);

  const toggleFavorite = (item) => {
    const isFav = favorites.includes(item.name);
    if (isFav) {
      setFavorites(favorites.filter(f => f !== item.name));
    } else {
      axios.post('https://space-explorer-backend-ksro.onrender.com/api/favorites', { name: item.name, description: item.short })
        .then(() => setFavorites([...favorites, item.name]))
        .catch(err => console.error(err));
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      <h1 className="text-center my-5">{title}</h1>
      <div className="row">
        {items.map(item => (
          <div className="col-md-4 mb-4" key={item.name}>
            <AstroCard
              item={item}
              onClick={() => handleCardClick(item)}
              isFavorite={favorites.includes(item.name)}
              onFavoriteToggle={toggleFavorite}
            />
          </div>
        ))}
      </div>
      <DetailModal show={showModal} handleClose={() => setShowModal(false)} item={selectedItem} />
    </>
  );
}

function SolarSystem() {
  const items = allItems.filter(i => !i.name.includes('Sirius') && !i.name.includes('Alpha Centauri') && !i.name.includes('Proxima'));
  return <CardGrid items={items} title="Sistema Solar" />;
}

function Moons() {
  const items = allItems.filter(i => i.name.includes('Europa') || i.name.includes('Io') || i.name.includes('Ganímedes') || i.name.includes('Calisto') || i.name.includes('Titã') || i.name.includes('Lua') || i.name.includes('Encélado') || i.name.includes('Phobos'));
  return <CardGrid items={items} title="Luas Principais" />;
}

function OtherSystems() {
  const items = allItems.filter(i => i.name.includes('Alpha Centauri') || i.name.includes('Proxima') || i.name.includes('Sirius'));
  return <CardGrid items={items} title="Outros Sistemas Estelares" />;
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/favorites`)
      .then(res => {
        const favNames = res.data.map(f => f.name);
        const favItems = allItems.filter(item => favNames.includes(item.name));
        setFavorites(favItems);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      <h1 className="text-center my-5" style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#00ffff' }}>
        Meus Favoritos ⭐
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-white" style={{ fontSize: '1.5rem' }}>
          Nenhum favorito ainda. Clique na estrelinha ☆ nos cards para adicionar!
        </p>
      ) : (
        <div className="row">
          {favorites.map(item => (
            <div className="col-md-4 mb-4" key={item.name}>
              <AstroCard
                item={item}
                onClick={() => handleCardClick(item)}
                isFavorite={true}
                onFavoriteToggle={() => {}} 
              />
            </div>
          ))}
        </div>
      )}

      <DetailModal show={showModal} handleClose={() => setShowModal(false)} item={selectedItem} />
    </>
  );
}

function Contact() {
  const [form, setForm] = useState({ topic: '', content: '' });

  const send = () => {
    axios.post(`${BACKEND_URL}/api/notes`, form)
      .then(() => alert('Mensagem enviada com sucesso!'))
      .catch(() => alert('Erro ao enviar. Verifique se o backend está rodando.'));
    setForm({ topic: '', content: '' });
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Contato / Sugestões</h1>
      <div className="col-md-8 mx-auto">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tópico</Form.Label>
            <Form.Control value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Mensagem</Form.Label>
            <Form.Control as="textarea" rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" size="lg" onClick={send}>Enviar</Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default App;