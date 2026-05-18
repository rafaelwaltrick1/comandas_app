// ClienteList.jsx

import {
    Typography,
    Box,
    Button
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";

const ClienteList = () => {

    const navigate = useNavigate();

    const clientes = [
        {
            id: 1,
            nome: "Rafael Waltrick",
            cpf: "12345678900",
            telefone: "49999999999"
        }
    ];

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

            {clientes.map((cliente) => (
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
                </Box>
            ))}

        </PageLayout>
    );
};

export default ClienteList;