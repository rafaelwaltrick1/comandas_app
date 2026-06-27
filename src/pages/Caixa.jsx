// Caixa.jsx

import { useState } from "react";

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";

import {
    PointOfSale,
    ReceiptLong
} from "@mui/icons-material";

import PageLayout from "../components/common/PageLayout";

const Caixa = () => {
    const [funcionarioRecebimento, setFuncionarioRecebimento] = useState("Rafael Waltrick");
    const [clientePagamento, setClientePagamento] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
    const [desconto, setDesconto] = useState(0);
    const [acrescimo, setAcrescimo] = useState(0);

    const [dataHoraRecebimento, setDataHoraRecebimento] = useState("");

    const [comandas, setComandas] = useState([
        {
            id: 1,
            numero: "Rafael Waltrick",
            cliente: "Rafael Waltrick",
            status: "Aberta",
            funcionario: "Rafael Waltrick",
            aberta: true,
            itens: [
                { descricao: "X-Burguer", quantidade: 1, valor: 25 },
                { descricao: "Refrigerante", quantidade: 1, valor: 8 },
                { descricao: "Batata Frita", quantidade: 1, valor: 15 }
            ]
        },
        {
            id: 2,
            numero: "Mesa 02",
            cliente: "João Silva",
            status: "Aberta",
            funcionario: "Eduarda Machado",
            aberta: true,
            itens: [
                { descricao: "Pizza", quantidade: 1, valor: 45 },
                { descricao: "Suco Natural", quantidade: 2, valor: 10 },
                { descricao: "Sobremesa", quantidade: 1, valor: 18 }
            ]
        },
        {
            id: 3,
            numero: "Mesa 03",
            cliente: "Maria Souza",
            status: "Aberta",
            funcionario: "Rafael Waltrick",
            aberta: true,
            itens: [
                { descricao: "Pastel", quantidade: 2, valor: 12 },
                { descricao: "Café", quantidade: 1, valor: 6 },
                { descricao: "Água Mineral", quantidade: 1, valor: 5 }
            ]
        }
    ]);

    const [selecionadas, setSelecionadas] = useState([]);
    const [comprovanteAberto, setComprovanteAberto] = useState(false);
    const [comandasRecebidas, setComandasRecebidas] = useState([]);

    const calcularTotal = (comanda) => {
        return comanda.itens.reduce(
            (total, item) => total + item.quantidade * item.valor,
            0
        );
    };

    const subtotalSelecionado = comandas
        .filter((comanda) => selecionadas.includes(comanda.id))
        .reduce((total, comanda) => total + calcularTotal(comanda), 0);

    const calcularTotalFinal = () => {
        return subtotalSelecionado - Number(desconto || 0) + Number(acrescimo || 0);
    };

    const alternarSelecao = (id) => {
        if (selecionadas.includes(id)) {
            setSelecionadas(selecionadas.filter((item) => item !== id));
        } else {
            setSelecionadas([...selecionadas, id]);
        }
    };

    const receberComandas = () => {
        const recebidas = comandas.filter((comanda) =>
            selecionadas.includes(comanda.id)
        );

        if (recebidas.length !== 2) {
            alert("Na recuperação, o recebimento deve ser feito com exatamente duas comandas em uma única operação.");
            return;
        }

        const agora = new Date().toLocaleString("pt-BR");

        const comandasAtualizadas = recebidas.map((comanda) => ({
            ...comanda,
            aberta: false,
            status: "Fechada",
            statusCodigo: 1,
            funcionarioRecebimento,
            cliente:
                clientePagamento.trim() !== ""
                    ? clientePagamento
                    : comanda.cliente,
            desconto: Number(desconto || 0),
            acrescimo: Number(acrescimo || 0),
            valorOriginal: calcularTotal(comanda),
            dataHoraRecebimento: agora
        }));

        setComandas(
            comandas.map((comanda) => {
                const atualizada = comandasAtualizadas.find(
                    (item) => item.id === comanda.id
                );

                return atualizada || comanda;
            })
        );

        setComandasRecebidas(comandasAtualizadas);
        setDataHoraRecebimento(agora);
        setComprovanteAberto(true);
        setSelecionadas([]);
    };

    const totalRecebidoOriginal = comandasRecebidas.reduce(
        (total, comanda) => total + comanda.valorOriginal,
        0
    );

    const totalRecebidoFinal =
        totalRecebidoOriginal - Number(desconto || 0) + Number(acrescimo || 0);

    return (
        <PageLayout title="Caixa - Recebimento" maxWidth="lg">
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <img
                    src="/rafael.jpg"
                    alt="Foto Rafael"
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #1976d2"
                    }}
                />

                <Box>
                    <Typography variant="h5">
                        Caixa - Comandas
                    </Typography>

                    <Typography>
                        Recebimento de comandas com funcionário, desconto, acréscimo e comprovante.
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 2
                }}
            >
                <TextField
                    label="Funcionário responsável pelo recebimento"
                    value={funcionarioRecebimento}
                    onChange={(e) => setFuncionarioRecebimento(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Ajustar cliente no pagamento"
                    value={clientePagamento}
                    onChange={(e) => setClientePagamento(e.target.value)}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Forma de pagamento</InputLabel>

                    <Select
                        value={formaPagamento}
                        label="Forma de pagamento"
                        onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                        <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                        <MenuItem value="Pix">Pix</MenuItem>
                        <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                        <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Desconto"
                    type="number"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Acréscimo"
                    type="number"
                    value={acrescimo}
                    onChange={(e) => setAcrescimo(e.target.value)}
                    fullWidth
                />

                <Box>
                    <Typography>
                        Comandas selecionadas: {selecionadas.length}
                    </Typography>

                    <Typography>
                        Subtotal: R$ {subtotalSelecionado.toFixed(2)}
                    </Typography>

                    <Typography variant="h6">
                        Total final: R$ {calcularTotalFinal().toFixed(2)}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<PointOfSale />}
                    onClick={receberComandas}
                    disabled={selecionadas.length === 0}
                >
                    Receber selecionadas
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Comandas abertas para recebimento
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 2
                }}
            >
                {comandas
                    .filter((comanda) => comanda.aberta)
                    .map((comanda) => (
                        <Card key={comanda.id}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            Comanda: {comanda.numero}
                                        </Typography>

                                        <Typography>
                                            Cliente: {comanda.cliente}
                                        </Typography>

                                        <Typography>
                                            Funcionário da comanda: {comanda.funcionario}
                                        </Typography>
                                    </Box>

                                    <Checkbox
                                        checked={selecionadas.includes(comanda.id)}
                                        onChange={() => alternarSelecao(comanda.id)}
                                    />
                                </Box>

                                <Chip
                                    label={comanda.status}
                                    color="success"
                                    size="small"
                                    sx={{ mt: 1 }}
                                />

                                <Divider sx={{ my: 2 }} />

                                {comanda.itens.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1
                                        }}
                                    >
                                        <Typography>
                                            {item.quantidade}x {item.descricao}
                                        </Typography>

                                        <Typography>
                                            R$ {(item.quantidade * item.valor).toFixed(2)}
                                        </Typography>
                                    </Box>
                                ))}

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6">
                                    Total: R$ {calcularTotal(comanda).toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
            </Box>

            <Dialog
                open={comprovanteAberto}
                onClose={() => setComprovanteAberto(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ReceiptLong />
                    Comprovante de Recebimento
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ mb: 1 }}>
                        Recebimento realizado com sucesso.
                    </Typography>

                    <Typography>
                        Data e hora: {dataHoraRecebimento}
                    </Typography>

                    <Typography>
                        Funcionário responsável: {funcionarioRecebimento}
                    </Typography>

                    <Typography>
                        Forma de pagamento: {formaPagamento}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {comandasRecebidas.map((comanda) => (
                        <Box key={comanda.id} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                                Comanda: {comanda.numero}
                            </Typography>

                            <Typography>
                                Status: Fechada (1)
                            </Typography>

                            <Typography>
                                Cliente: {comanda.cliente}
                            </Typography>

                            <Typography>
                                Funcionário da comanda: {comanda.funcionario}
                            </Typography>

                            <Typography>
                                Funcionário do recebimento: {comanda.funcionarioRecebimento}
                            </Typography>

                            {comanda.itens.map((item, index) => (
                                <Typography key={index}>
                                    {item.quantidade}x {item.descricao} - R$ {(item.quantidade * item.valor).toFixed(2)}
                                </Typography>
                            ))}

                            <Typography sx={{ mt: 1 }}>
                                Valor original: R$ {comanda.valorOriginal.toFixed(2)}
                            </Typography>

                            <Divider sx={{ mt: 2 }} />
                        </Box>
                    ))}

                    <Typography>
                        Desconto: R$ {Number(desconto || 0).toFixed(2)}
                    </Typography>

                    <Typography>
                        Acréscimo: R$ {Number(acrescimo || 0).toFixed(2)}
                    </Typography>

                    <Typography>
                        Total original: R$ {totalRecebidoOriginal.toFixed(2)}
                    </Typography>

                    <Typography variant="h6">
                        Total final recebido: R$ {totalRecebidoFinal.toFixed(2)}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => setComprovanteAberto(false)}
                    >
                        Fechar comprovante
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default Caixa;