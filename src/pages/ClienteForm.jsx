// ClienteForm.jsx

import { useState } from "react";

import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";

const ClienteForm = () => {
    const navigate = useNavigate();
    const { id, modo } = useParams();

    const clientes = [
        {
            id: 1,
            nome: "Rafael Waltrick",
            cpf: "12345678900",
            telefone: "49999999999"
        }
    ];

    const clienteOriginal = clientes.find(
        (cliente) => cliente.id === Number(id)
    );

    const visualizando = modo === "visualizar";
    const editando = modo === "editar";

    const [nome, setNome] = useState(clienteOriginal?.nome || "");
    const [cpf, setCpf] = useState(clienteOriginal?.cpf || "");
    const [telefone, setTelefone] = useState(clienteOriginal?.telefone || "");

    const [dialogAberto, setDialogAberto] = useState(false);
    const [clienteDuplicado, setClienteDuplicado] = useState(null);

    const mascaraCPF = (valor) => {
        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    };

    const mascaraTelefone = (valor) => {
        valor = valor.replace(/\D/g, "");

        if (valor.length <= 10) {
            valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        }

        return valor;
    };

    const obterCamposAlterados = (original, atual) => {
        const alterados = {};

        Object.keys(atual).forEach((campo) => {
            if (original[campo] !== atual[campo]) {
                alterados[campo] = atual[campo];
            }
        });

        return alterados;
    };

    const salvar = () => {
        const cpfLimpo = cpf.replace(/\D/g, "");
        const telefoneLimpo = telefone.replace(/\D/g, "");

        const duplicado = clientes.find(
            (cliente) =>
                cliente.cpf === cpfLimpo &&
                cliente.id !== Number(id)
        );

        if (duplicado) {
            setClienteDuplicado(duplicado);
            setDialogAberto(true);
            return;
        }

        const clienteAtual = {
            nome,
            cpf: cpfLimpo,
            telefone: telefoneLimpo
        };

        if (editando) {
            const alteracoes = obterCamposAlterados(
                {
                    nome: clienteOriginal.nome,
                    cpf: clienteOriginal.cpf,
                    telefone: clienteOriginal.telefone
                },
                clienteAtual
            );

            console.log("Campos alterados para enviar no PATCH:", alteracoes);
        } else {
            console.log("Cliente novo para enviar no POST:", clienteAtual);
        }

        navigate("/clientes");
    };

    return (
        <PageLayout
            title={
                visualizando
                    ? "Visualizar Cliente"
                    : editando
                        ? "Editar Cliente"
                        : "Cadastro de Cliente"
            }
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
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={visualizando}
                    fullWidth
                />

                <TextField
                    label="CPF"
                    value={mascaraCPF(cpf)}
                    onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                    inputProps={{ maxLength: 14 }}
                    disabled={visualizando}
                    fullWidth
                />

                <TextField
                    label="Telefone"
                    value={mascaraTelefone(telefone)}
                    onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                    inputProps={{ maxLength: 15 }}
                    disabled={visualizando}
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
                        Voltar
                    </Button>

                    {!visualizando && (
                        <Button
                            variant="contained"
                            onClick={salvar}
                        >
                            Salvar
                        </Button>
                    )}
                </Box>
            </Box>

            <Dialog
                open={dialogAberto}
                onClose={() => setDialogAberto(false)}
            >
                <DialogTitle>
                    CPF já cadastrado
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Já existe um cliente cadastrado com este CPF.
                    </Typography>

                    {clienteDuplicado && (
                        <Box sx={{ mt: 2 }}>
                            <Typography>
                                Nome: {clienteDuplicado.nome}
                            </Typography>

                            <Typography>
                                CPF: {mascaraCPF(clienteDuplicado.cpf)}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogAberto(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(`/cliente/${clienteDuplicado.id}/visualizar`)
                        }
                    >
                        Visualizar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() =>
                            navigate(`/cliente/${clienteDuplicado.id}/editar`)
                        }
                    >
                        Editar
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default ClienteForm;