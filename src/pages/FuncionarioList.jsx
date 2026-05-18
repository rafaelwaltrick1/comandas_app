// FuncionarioList.jsx

import {
    Typography,
    Box,
    Button
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";

const FuncionarioList = () => {

    const navigate = useNavigate();

    const funcionarios = [
        {
            id: 1,
            nome: "Zé das Batatas",
            cpf: "12345678900",
            telefone: "49999999999",
            grupo: 1
        }
    ];

    return (
        <PageLayout
            title="Funcionários"
            actions={
                <Button
                    variant="contained"
                    startIcon={<FiberNew />}
                    onClick={() => navigate("/funcionario")}
                >
                    Novo
                </Button>
            }
        >

            {funcionarios.map((funcionario) => (
                <Box
                    key={funcionario.id}
                    sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2
                    }}
                >
                    <Typography>
                        Nome: {funcionario.nome}
                    </Typography>

                    <Typography>
                        CPF: {funcionario.cpf}
                    </Typography>

                    <Typography>
                        Telefone: {funcionario.telefone}
                    </Typography>

                    <Typography>
                        Grupo: {funcionario.grupo}
                    </Typography>
                </Box>
            ))}

        </PageLayout>
    );
};

export default FuncionarioList;