import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme"; // estilos globais
import Navbar from "./components/common/Navbar"; // componente reutilizável de navegação
import AppRoutes from "./routes/Router"; // rotas da aplicação

function App() {
  return (
    // Aplica o tema global ao aplicativo - Material UI
    <ThemeProvider theme={theme}>
      {/* Normaliza estilos CSS */}
      <CssBaseline />

      {/* BrowserRouter é o roteador principal que gerencia as rotas da aplicação */}
      <BrowserRouter>
        {/* O AuthProvider envolve toda a aplicação, permitindo que os componentes filhos acessem o contexto de autenticação */}
        <AuthProvider>
          {/* Navbar é o componente de navegação que contém os links para as diferentes páginas da aplicação */}
          <Navbar />

          {/* Container fornece um layout responsivo e centralizado */}
          <Container
            maxWidth="xl"
            sx={{
              mt: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2 }
            }}
          >
            {/* AppRoutes contém as rotas da aplicação */}
            <AppRoutes />
          </Container>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;