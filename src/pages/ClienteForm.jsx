// ClienteForm.jsx

import {
    Box,
    TextField,
    Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";

const ClienteForm = () => {

    const navigate = useNavigate();

    return (
        <PageLayout
            title="Cadastro de Cliente"
            maxWidth="md"
        >

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
            >

                <TextField
                    label="Nome"
                    defaultValue="Rafael Waltrick"
                    fullWidth
                />

                <TextField
                    label="CPF"
                    fullWidth
                />

                <TextField
                    label="Telefone"
                    fullWidth
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/clientes")}
                    >
                        Cancelar
                    </Button>

                    <Button variant="contained">
                        Salvar
                    </Button>
                </Box>

            </Box>

        </PageLayout>
    );
};

export default ClienteForm;