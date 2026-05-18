// FuncionarioForm.jsx

import {
    Box,
    TextField,
    Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";

const FuncionarioForm = () => {

    const navigate = useNavigate();

    return (
        <PageLayout
            title="Cadastro de Funcionário"
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
                    label="Matrícula"
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

                <TextField
                    label="Grupo"
                    fullWidth
                />

                <TextField
                    label="Senha"
                    type="password"
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
                        onClick={() => navigate("/funcionarios")}
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

export default FuncionarioForm;