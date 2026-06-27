// ClienteList.jsx

import { useState } from "react";

import {
    Typography,
    Box,
    Button,
    TextField,
    Pagination
} from "@mui/material";

import { FiberNew, Visibility, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";

const ClienteList = () => {
    const navigate = useNavigate();

    const [filtro, setFiltro] = useState("");
    const [pagina, setPagina] = useState(1);

    const clientes = [
        {
            id: 1,
            nome: "Rafael Waltrick",
            cpf: "123.456.789-00",
            telefone: "(49) 99999-9999"
        },
        {
            id: 2,
            nome: "João Silva",
            cpf: "987.654.321-00",
            telefone: "(49) 98888-8888"
        }
    ];

    const itensPorPagina = 5;

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.cpf.includes(filtro) ||
        cliente.telefone.includes(filtro)
    );

    const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);

    const clientesPaginados = clientesFiltrados.slice(
        (pagina - 1) * itensPorPagina,
        pagina * itensPorPagina
    );

    return (
        <PageLayout
            title="Clientes"
            actions={
                <Button
                    variant="contained"
                    startIcon={<FiberNew />}
                    onClick={() => navigate("/cliente")}
                >
                    Novo
                </Button>
            }
        >
            <TextField
                label="Filtrar por nome, CPF ou telefone"
                value={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value);
                    setPagina(1);
                }}
                fullWidth
                sx={{ mb: 3 }}
            />

            {clientesPaginados.map((cliente) => (
                <Box
                    key={cliente.id}
                    sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2
                    }}
                >
                    <Typography>
                        Nome: {cliente.nome}
                    </Typography>

                    <Typography>
                        CPF: {cliente.cpf}
                    </Typography>

                    <Typography>
                        Telefone: {cliente.telefone}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                            mt: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => navigate(`/cliente/${cliente.id}/visualizar`)}
                        >
                            Visualizar
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => navigate(`/cliente/${cliente.id}/editar`)}
                        >
                            Editar
                        </Button>
                    </Box>
                </Box>
            ))}

            {clientesFiltrados.length === 0 && (
                <Typography>
                    Nenhum cliente encontrado.
                </Typography>
            )}

            {totalPaginas > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3
                    }}
                >
                    <Pagination
                        count={totalPaginas}
                        page={pagina}
                        onChange={(event, value) => setPagina(value)}
                        color="primary"
                    />
                </Box>
            )}
        </PageLayout>
    );
};

export default ClienteList;