// Comandas.jsx

import { useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton
} from "@mui/material";

import {
    Add,
    Delete,
    Visibility,
    PointOfSale
} from "@mui/icons-material";

import PageLayout from "../components/common/PageLayout";

const Comandas = () => {
    const produtos = [
        { id: 1, descricao: "X-Burguer", valor: 25 },
        { id: 2, descricao: "Refrigerante", valor: 8 },
        { id: 3, descricao: "Batata Frita", valor: 15 },
        { id: 4, descricao: "Pizza", valor: 45 },
        { id: 5, descricao: "Suco Natural", valor: 10 },
        { id: 6, descricao: "Sobremesa", valor: 18 },
        { id: 7, descricao: "Pastel", valor: 12 },
        { id: 8, descricao: "Café", valor: 6 },
        { id: 9, descricao: "Água Mineral", valor: 5 }
    ];

    const [comandas, setComandas] = useState([
        {
            id: 1,
            numero: "Rafael Waltrick",
            cliente: "Rafael Waltrick",
            status: "Aberta",
            itens: [
                { idProduto: 1, descricao: "X-Burguer", quantidade: 1, valor: 25 },
                { idProduto: 2, descricao: "Refrigerante", quantidade: 1, valor: 8 },
                { idProduto: 3, descricao: "Batata Frita", quantidade: 1, valor: 15 }
            ]
        },
        {
            id: 2,
            numero: "Mesa 02",
            cliente: "João Silva",
            status: "Aberta",
            itens: [
                { idProduto: 4, descricao: "Pizza", quantidade: 1, valor: 45 },
                { idProduto: 5, descricao: "Suco Natural", quantidade: 2, valor: 10 },
                { idProduto: 6, descricao: "Sobremesa", quantidade: 1, valor: 18 }
            ]
        },
        {
            id: 3,
            numero: "Mesa 03",
            cliente: "Maria Souza",
            status: "Aberta",
            itens: [
                { idProduto: 7, descricao: "Pastel", quantidade: 2, valor: 12 },
                { idProduto: 8, descricao: "Café", quantidade: 1, valor: 6 },
                { idProduto: 9, descricao: "Água Mineral", quantidade: 1, valor: 5 }
            ]
        }
    ]);

    const [filtro, setFiltro] = useState("");

    const [dialogNovaAberto, setDialogNovaAberto] = useState(false);
    const [novoNumero, setNovoNumero] = useState("");
    const [novoCliente, setNovoCliente] = useState("");

    const [dialogItemAberto, setDialogItemAberto] = useState(false);
    const [comandaSelecionada, setComandaSelecionada] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState(1);

    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [comandaVisualizada, setComandaVisualizada] = useState(null);

    const calcularTotal = (comanda) => {
        return comanda.itens.reduce(
            (total, item) => total + item.quantidade * item.valor,
            0
        );
    };

    const abrirNovaComanda = () => {
        setNovoNumero("");
        setNovoCliente("");
        setDialogNovaAberto(true);
    };

    const criarComanda = () => {
        if (!novoNumero || !novoCliente) {
            alert("Informe o número da comanda e o cliente.");
            return;
        }

        const novaComanda = {
            id: Date.now(),
            numero: novoNumero,
            cliente: novoCliente,
            status: "Aberta",
            itens: []
        };

        setComandas([...comandas, novaComanda]);
        setDialogNovaAberto(false);
    };

    const abrirAdicionarItem = (comanda) => {
        setComandaSelecionada(comanda);
        setProdutoSelecionado("");
        setQuantidade(1);
        setDialogItemAberto(true);
    };

    const adicionarItem = () => {
        if (!produtoSelecionado || quantidade <= 0) {
            alert("Selecione um produto e informe a quantidade.");
            return;
        }

        const produto = produtos.find(
            (produto) => produto.id === Number(produtoSelecionado)
        );

        const novasComandas = comandas.map((comanda) => {
            if (comanda.id !== comandaSelecionada.id) {
                return comanda;
            }

            const itemExistente = comanda.itens.find(
                (item) => item.idProduto === produto.id
            );

            if (itemExistente) {
                return {
                    ...comanda,
                    itens: comanda.itens.map((item) =>
                        item.idProduto === produto.id
                            ? {
                                ...item,
                                quantidade:
                                    Number(item.quantidade) + Number(quantidade)
                            }
                            : item
                    )
                };
            }

            return {
                ...comanda,
                itens: [
                    ...comanda.itens,
                    {
                        idProduto: produto.id,
                        descricao: produto.descricao,
                        quantidade: Number(quantidade),
                        valor: produto.valor
                    }
                ]
            };
        });

        setComandas(novasComandas);
        setDialogItemAberto(false);
    };

    const removerItem = (idComanda, idProduto) => {
        const novasComandas = comandas.map((comanda) => {
            if (comanda.id !== idComanda) {
                return comanda;
            }

            return {
                ...comanda,
                itens: comanda.itens.filter(
                    (item) => item.idProduto !== idProduto
                )
            };
        });

        setComandas(novasComandas);
    };

    const visualizarComanda = (comanda) => {
        setComandaVisualizada(comanda);
        setDialogVisualizarAberto(true);
    };

    const enviarParaCaixa = (comanda) => {
        alert(
            `Comanda ${comanda.numero} enviada para o caixa. No vídeo, agora acesse a tela Caixa para fazer o recebimento.`
        );
    };

    const comandasFiltradas = comandas.filter((comanda) =>
        comanda.numero.toLowerCase().includes(filtro.toLowerCase()) ||
        comanda.cliente.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <PageLayout
            title="Comandas"
            maxWidth="lg"
            actions={
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={abrirNovaComanda}
                >
                    Nova Comanda
                </Button>
            }
        >
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 2 }}>
                    Funcionalidade de comandas abertas, consumo de itens e envio para recebimento no caixa.
                </Typography>

                <TextField
                    label="Pesquisar por número da comanda ou cliente"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 2
                }}
            >
                {comandasFiltradas.map((comanda) => (
                    <Card key={comanda.id}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1
                                }}
                            >
                                <Typography variant="h6">
                                    Comanda: {comanda.numero}
                                </Typography>

                                <Chip
                                    label={comanda.status}
                                    color="success"
                                    size="small"
                                />
                            </Box>

                            <Typography>
                                Cliente: {comanda.cliente}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Itens consumidos
                            </Typography>

                            {comanda.itens.length === 0 && (
                                <Typography color="text.secondary">
                                    Nenhum item consumido.
                                </Typography>
                            )}

                            {comanda.itens.map((item) => (
                                <Box
                                    key={item.idProduto}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                        gap: 1
                                    }}
                                >
                                    <Typography>
                                        {item.quantidade}x {item.descricao}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <Typography>
                                            R$ {(item.quantidade * item.valor).toFixed(2)}
                                        </Typography>

                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                removerItem(comanda.id, item.idProduto)
                                            }
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Total: R$ {calcularTotal(comanda).toFixed(2)}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() => abrirAdicionarItem(comanda)}
                                >
                                    Adicionar Item
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Visibility />}
                                    onClick={() => visualizarComanda(comanda)}
                                >
                                    Visualizar
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={<PointOfSale />}
                                    onClick={() => enviarParaCaixa(comanda)}
                                >
                                    Caixa
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog
                open={dialogNovaAberto}
                onClose={() => setDialogNovaAberto(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Nova Comanda
                </DialogTitle>

                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1
                        }}
                    >
                        <TextField
                            label="Número da Comanda"
                            value={novoNumero}
                            onChange={(e) => setNovoNumero(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Cliente"
                            value={novoCliente}
                            onChange={(e) => setNovoCliente(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogNovaAberto(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={criarComanda}
                    >
                        Criar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogItemAberto}
                onClose={() => setDialogItemAberto(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Adicionar Item
                </DialogTitle>

                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1
                        }}
                    >
                        <TextField
                            select
                            label="Produto"
                            value={produtoSelecionado}
                            onChange={(e) => setProdutoSelecionado(e.target.value)}
                            fullWidth
                        >
                            {produtos.map((produto) => (
                                <MenuItem
                                    key={produto.id}
                                    value={produto.id}
                                >
                                    {produto.descricao} - R$ {produto.valor.toFixed(2)}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Quantidade"
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogItemAberto(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={adicionarItem}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogVisualizarAberto}
                onClose={() => setDialogVisualizarAberto(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Visualizar Comanda
                </DialogTitle>

                <DialogContent>
                    {comandaVisualizada && (
                        <Box>
                            <Typography variant="h6">
                                Comanda: {comandaVisualizada.numero}
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                Cliente: {comandaVisualizada.cliente}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {comandaVisualizada.itens.map((item) => (
                                <Typography key={item.idProduto}>
                                    {item.quantidade}x {item.descricao} - R$ {(item.quantidade * item.valor).toFixed(2)}
                                </Typography>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6">
                                Total: R$ {calcularTotal(comandaVisualizada).toFixed(2)}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => setDialogVisualizarAberto(false)}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default Comandas;